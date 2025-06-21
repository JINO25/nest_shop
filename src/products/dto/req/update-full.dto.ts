/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ProductVariantDTO } from './product-variant.dto';

export class UpdateFullDTO {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDTO)
    productVariants?: ProductVariantDTO[];
}