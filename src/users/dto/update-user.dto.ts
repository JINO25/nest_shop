/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";

// import { IsEmail } from "class-validator";

export class UpdateUserDto {
    @IsString()
    name: string;
    // @IsEmail({}, { message: 'Invalid email format!' })
    // email: string;    
    photo: string;
}
