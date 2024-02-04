import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import { Parcel } from './parcel.entity';

@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post()
  async create(@Body() parcel: Parcel): Promise<Parcel | Error> {
    return this.parcelsService.create(parcel);
  }

  @Get()
  async findAll(
    @Query('country') country?: string,
    @Query('description') description?: string,
    @Query('page') page?: number,
  ): Promise<Parcel[]> {
    return this.parcelsService.findAll(country, description, page);
  }
}
