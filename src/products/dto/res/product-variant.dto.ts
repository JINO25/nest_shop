/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class ProductVariantDTO {
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
}

