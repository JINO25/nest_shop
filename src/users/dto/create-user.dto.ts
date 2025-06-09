/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'User must have a name' })
    @Length(1, 45, { message: 'Name must be between 1 and 45 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsNotEmpty({ message: 'User must have an email' })
    @Length(1, 45, { message: 'Email must be between 1 and 45 characters' })
    email: string;

    @IsString()
    @Length(8, undefined, { message: 'Password must be at least 8 characters!' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;

    @IsOptional()
    @IsString()
    photo?: string;

    @IsString()
    @IsNotEmpty({ message: 'Country cannot be empty' })
    @Length(1, 45, { message: "Country can't be longer than 45 characters." })
    country: string;

    @IsString()
    @IsNotEmpty({ message: 'City cannot be empty' })
    @Length(1, 45, { message: "City can't be longer than 45 characters." })
    city: string;

    @IsString()
    @IsNotEmpty({ message: 'Street cannot be empty' })
    @Length(1, 100, { message: "Street can't be longer than 100 characters." })
    street: string;

    @Matches(/^(?:\+(\d{1,3}))?(\d{10})$/, { message: 'Phone number must be a valid 10-digit phone number.' })
    @IsOptional()
    phoneNumber?: string;
}