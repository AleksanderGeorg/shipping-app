import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelsService } from './parcels.service';
import { ParcelsController } from './parcels.controller';
import { Parcel } from './parcel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcel])],
  providers: [ParcelsService],
  controllers: [ParcelsController],
})
export class ParcelsModule {}
