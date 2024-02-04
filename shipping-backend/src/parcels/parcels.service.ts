import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from './parcel.entity';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 14);

const parcelInputFields = [
  {
    name: 'sku',
    required: true,
  },
  {
    name: 'description',
    required: false,
  },
  {
    name: 'streetAddress',
    required: true,
  },
  {
    name: 'town',
    required: true,
  },
  {
    name: 'country',
    required: true,
  },
  {
    name: 'deliveryDate',
    required: true,
  },
];

@Injectable()
export class ParcelsService {
  constructor(
    @InjectRepository(Parcel)
    private parcelsRepository: Repository<Parcel>,
  ) {}

  async create(parcel: Parcel): Promise<Parcel | Error> {
    // Check for missing/non-string required fields (user input validation)
    for (const field of parcelInputFields) {
      if (field.required && !parcel[field.name]?.trim?.()) {
        return {
          name: 'missing-field-values',
          message: 'Missing required field values',
        };
      }

      // Set missing/non-string not required fields to empty string
      parcel[field.name] = parcel[field.name]?.trim?.() || '';
    }

    // Check if delivery date is a valid date (user input validation)
    if (isNaN(new Date(parcel.deliveryDate).getTime())) {
      return {
        name: 'invalid-delivery-date',
        message: 'Invalid delivery date',
      };
    }

    const existingParcel = await this.parcelsRepository.findOne({
      where: { sku: parcel.sku },
      // Only select 1 field to reduce response size
      select: ['uniqueId'],
    });
    if (existingParcel) {
      return {
        name: 'duplicate-sku',
        message: 'Parcel with duplicate SKU already exists',
      };
    }

    // Creation attempts in case of unique ID collision (max 5 attempts)
    for (let i = 0; i < 5; i++) {
      try {
        parcel.uniqueId = nanoid();
        await this.parcelsRepository.insert(parcel);

        return parcel;
      } catch (error) {
        console.error('Parcel unique ID collision, retrying...');
      }
    }

    console.error('Failed to save parcel after 5 retries');
    return {
      name: 'create-failed',
      message: 'Failed to save parcel, try again later',
    };
  }

  async findAll(
    country?: string,
    description?: string,
    page: number = 0,
  ): Promise<Parcel[]> {
    // Check if page is a valid number
    if (isNaN(page) || page < 0) {
      page = 0;
    }

    // Constant page size to keep users from requesting too many parcels at once (potentially can add more presets like 10, 50, 100, etc.)
    const pageSize = 20;

    const queryBuilder = this.parcelsRepository.createQueryBuilder('parcel');

    // Apply filtering
    if (country) {
      queryBuilder.andWhere('parcel.country ILIKE :country', {
        country: `%${country}%`,
      });
    }

    if (description) {
      queryBuilder.andWhere('parcel.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    queryBuilder
      .orderBy(
        "CASE WHEN parcel.country ILIKE 'estonia' THEN 0 ELSE 1 END, parcel.deliveryDate",
        'ASC',
      )
      // Return 20 parcels per page + 1 to check if there are more pages
      .take(pageSize + 1)
      .skip(page * pageSize);

    return queryBuilder.getMany();
  }
}
