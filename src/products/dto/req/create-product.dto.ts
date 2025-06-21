/* eslint-disable prettier/prettier */
import { IsString, IsNumber } from 'class-validator';

export class CreateProductDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    categoryName: string;

    @IsString()
    option: string;

    @IsString()
    color: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;
}

