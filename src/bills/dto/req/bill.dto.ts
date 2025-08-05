/* eslint-disable prettier/prettier */
import { IsInt, IsNumber, IsOptional, IsString, IsEnum, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { OrderDTO } from '../../../orders/dto/res/order.dto';

export class BillDTO {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsNumber()
    total: number;

    @Type(() => Date)
    @IsDate()
    billDate: Date;

    @IsString()
    method: string;

    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    paymentTime?: Date;

    @ValidateNested()
    @Type(() => OrderDTO)
    orderDTO: OrderDTO;
}
