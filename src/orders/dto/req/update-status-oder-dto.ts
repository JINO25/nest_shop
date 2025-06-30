/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';

export class UpdateOrderStatusDTO {
    @IsEnum(OrderStatus, { message: 'Invalid status value' })
    status: OrderStatus;
}
