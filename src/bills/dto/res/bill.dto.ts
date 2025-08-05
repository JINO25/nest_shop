/* eslint-disable prettier/prettier */
import { Expose, Type } from 'class-transformer';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { OrderDTO } from '../../../orders/dto/res/order.dto';

export class BillResponseDTO {
    @Expose()
    id: number;

    @Expose()
    total: number;

    @Expose()
    billDate: Date;

    @Expose()
    method: string;

    @Expose()
    paymentStatus: PaymentStatus;

    @Expose()
    paymentTime: Date;

    @Expose({ name: 'order' })
    @Type(() => OrderDTO)
    orderDTO: OrderDTO;
}
