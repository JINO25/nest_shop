/* eslint-disable prettier/prettier */
import { IsNotEmpty, Min } from "class-validator";

export class CartReqDto {
    @IsNotEmpty()
    productVariantId: number;

    @IsNotEmpty({ message: 'Quantity must be least 1!' })
    @Min(1)
    quantity: number;
}