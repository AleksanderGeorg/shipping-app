import { Entity, Column } from 'typeorm';

@Entity('parcels')
export class Parcel {
  @Column({ unique: true, primary: true })
  uniqueId: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  description: string;

  @Column()
  streetAddress: string;

  @Column()
  town: string;

  @Column()
  country: string;

  @Column()
  deliveryDate: Date;
}
