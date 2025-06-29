/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
