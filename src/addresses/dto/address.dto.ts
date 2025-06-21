/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDTO {
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    street: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;
}
