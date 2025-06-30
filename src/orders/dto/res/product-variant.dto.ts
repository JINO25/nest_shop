/* eslint-disable prettier/prettier */
import { Expose, Type } from 'class-transformer';
import { ProductDTO } from './product.dto';

export class ProductVariantOrderDTO {
    @Expose()
    id?: number;

    @Expose()
    option: string;

    @Expose()
    color: string;

    @Expose()
    price: number;

    @Expose()
    stock: number;

    @Expose()
    @Type(() => ProductDTO)
    product?: ProductDTO;
}

