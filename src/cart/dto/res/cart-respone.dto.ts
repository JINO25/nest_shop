/* eslint-disable prettier/prettier */

import { Expose, Type } from "class-transformer";
import { CartItemDTORespone } from "./cart-items-respone.dto";

export class CartDTORespone {
    @Expose()
    id: number;

    @Expose()
    userName: string;

    @Expose()
    @Type(() => CartItemDTORespone)
    cartItems: CartItemDTORespone[];
}