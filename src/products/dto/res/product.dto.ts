/* eslint-disable prettier/prettier */
import { Expose, Type } from 'class-transformer';
import { ProductVariantDTO } from './product-variant.dto';

export class ProductDTO {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    categoryName: string;

    @Expose()
    username?: string;

    @Expose()
    @Type(() => ProductVariantDTO)
    productVariants: ProductVariantDTO[];
}
