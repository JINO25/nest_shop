/* eslint-disable prettier/prettier */
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CartItemEqDTO {
    @IsArray()
    @ArrayNotEmpty({ message: 'Cart item IDs cannot be empty' })
    @IsInt({ each: true })
    cartItemIds: number[];
}
