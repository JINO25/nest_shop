/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillService } from './providers/bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '../entities/Bill.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bill])],
    controllers: [BillsController],
    providers: [BillService]
})
export class BillsModule { }
