/* eslint-disable prettier/prettier */

import { Expose, Type } from "class-transformer";
import { CartStatus } from "../../enums/cart-status.enum";
import { ProductVariantCartDTO } from "./product-variant.dto";

export class CartItemDTORespone {
    @Expose()
    id: number;

    @Expose()
    quantity: number;

    @Expose()
    status: CartStatus;

    @Expose()
    @Type(() => ProductVariantCartDTO)
    productVariant: ProductVariantCartDTO;
}