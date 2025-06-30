/* eslint-disable prettier/prettier */
import { IsInt, Min } from "class-validator";

export class OrderDetailReqDTO {
    @IsInt()
    productVariantId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}
