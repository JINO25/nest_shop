/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AddressesService } from './providers/addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../entities/Address.entity';
import { User } from '../entities/User.entity';
import { AddressesController } from './addresses.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Address, User])],
    providers: [AddressesService],
    controllers: [AddressesController]
})
export class AddressesModule { }
