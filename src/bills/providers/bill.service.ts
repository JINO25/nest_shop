/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from '../../entities/Bill.entity';
import { Repository } from 'typeorm';
import { BillResponseDTO } from '../dto/res/bill.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateStatusBillDTO } from '../dto/req/update-bill.dto';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class BillService {
    constructor(
        @InjectRepository(Bill)
        private readonly billRepository: Repository<Bill>
    ) { }

    async getAllBills(): Promise<BillResponseDTO[]> {
        const bills = await this.billRepository.find({
            relations: ['order', 'order.orderDetails', 'order.orderDetails.productVariant', 'order.orderDetails.productVariant.product'],
        });

        if (bills.length === 0) {
            return [];
        }

        return plainToInstance(BillResponseDTO, bills, {
            excludeExtraneousValues: true,
        });
    }

    async getBillByID(id: number): Promise<BillResponseDTO> {
        const bill = await this.billRepository.findOne({
            where: { id },
            relations: ['order', 'order.orderDetails', 'order.orderDetails.productVariant', 'order.orderDetails.productVariant.product'],
        });

        if (!bill) {
            throw new NotFoundException(`Bill not found with id: ${id}!`);
        }

        return plainToInstance(BillResponseDTO, bill, { excludeExtraneousValues: true });
    }

    async getBillForUser(userId: number): Promise<BillResponseDTO[]> {
        const bills = await this.billRepository.find({
            where: {
                order: {
                    userId: userId
                }
            },
            relations: ['order', 'order.orderDetails', 'order.orderDetails.productVariant', 'order.orderDetails.productVariant.product']
        });

        if (bills.length === 0) {
            return [];
        }

        return plainToInstance(BillResponseDTO, bills, {
            excludeExtraneousValues: true,
        });
    }

    async getBillForSeller(sellerId: number): Promise<BillResponseDTO[]> {
        const bills = await this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.order', 'order')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.product', 'product')
            .leftJoinAndSelect('product.user', 'seller')
            .where('seller.id = :id', { id: sellerId })
            .getMany();

        if (bills.length === 0) {
            return [];
        }

        return plainToInstance(BillResponseDTO, bills, {
            excludeExtraneousValues: true,
        });
    }

    async updatePaymentStatus(updatePaymentDTO: UpdateStatusBillDTO, sellerId: number, id: number) {
        const bill = await this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.order', 'order')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.product', 'product')
            .leftJoinAndSelect('product.user', 'seller')
            .where('seller.id = :sellerId', { sellerId: sellerId })
            .andWhere('bill.id = :id', { id: id })
            .getOne();

        if (!bill) {
            throw new NotFoundException(`Bill not found with id: ${id}!`);
        }

        bill.paymentStatus = PaymentStatus.PAID;

        bill.paymentTime = new Date().toISOString();

        const updated = await this.billRepository.save(bill);

        return plainToInstance(BillResponseDTO, updated, {
            excludeExtraneousValues: true,
        });
    }
}
