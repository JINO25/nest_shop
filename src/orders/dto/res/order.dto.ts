/* eslint-disable prettier/prettier */

import { Expose, Type } from "class-transformer";
import { OrderStatus } from "../../enums/order-status.enum";
import { OrderDetailDTO } from "./order-detail.dto";

export class OrderDTO {
    @Expose()
    id: number;

    @Expose()
    orderDate: Date;

    @Expose()
    status: OrderStatus;

    @Expose()
    userName: string;

    @Expose()
    @Type(() => OrderDetailDTO)
    orderDetails: OrderDetailDTO[];
}