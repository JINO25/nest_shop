/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { AddressesService } from './providers/addresses.service';
import { GetUserID } from '../common/decorators/get-user-id.decorator';
import { Address } from '../entities/Address.entity';
import { AddressDTO } from './dto/address.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';

@Controller('addresses')
export class AddressesController {
    constructor(
        private readonly addressesService: AddressesService
    ) { }

    @Get()
    @Auth([Roles.User])
    getByUserById(@GetUserID() userId: number): Promise<Address[]> {
        return this.addressesService.getAddressByUserId(userId);
    }

    @Post()
    @Auth([Roles.User])
    create(@Body() dto: AddressDTO, @GetUserID() userId: number): Promise<Address> {
        return this.addressesService.createAddress(dto, userId);
    }

    @Put('update')
    @Auth([Roles.User])
    update(
        @Query('id') id: number,
        @Body() dto: AddressDTO,
        @GetUserID() userId: number,
    ): Promise<Address> {
        return this.addressesService.updateAddressByUserId(dto, id, userId);
    }

    @Delete('delete')
    @Auth([Roles.User, Roles.Admin])
    delete(@Query('id') id: number): Promise<void> {
        return this.addressesService.deleteAddressByUserId(id);
    }
}
