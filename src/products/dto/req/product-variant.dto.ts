/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductVariantDTO {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    option: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;
}