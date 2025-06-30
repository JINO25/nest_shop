/* eslint-disable prettier/prettier */

import { Expose, Type } from 'class-transformer';
import { ProductVariantOrderDTO } from './product-variant.dto';

export class OrderDetailDTO {
    @Expose()
    id: number;

    @Expose()
    quantity: number;

    @Expose()
    price: number;

    @Expose()
    @Type(() => ProductVariantOrderDTO)
    productVariant: ProductVariantOrderDTO;
}
