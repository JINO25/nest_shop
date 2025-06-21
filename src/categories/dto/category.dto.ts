/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CategoryDTO {
    id?: number;

    @IsNotEmpty({ message: 'Category must have name' })
    name: string;
}
