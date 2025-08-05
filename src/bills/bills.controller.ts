/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put } from '@nestjs/common';
import { BillService } from './providers/bill.service';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';
import { GetUserID } from '../common/decorators/get-user-id.decorator';
import { UpdateStatusBillDTO } from './dto/req/update-bill.dto';

@Controller('bills')
export class BillsController {
    constructor(
        private readonly bilService: BillService,
    ) { }

    @Auth([Roles.Admin])
    @HttpCode(HttpStatus.OK)
    @Get()
    getAllBills() {
        return this.bilService.getAllBills();
    }

    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    @Get('user')
    getAllBillsForUser(
        @GetUserID() userId: number
    ) {
        return this.bilService.getBillForUser(userId);
    }

    @Auth([Roles.Seller])
    @HttpCode(HttpStatus.OK)
    @Get('seller')
    getAllBillsForSeller(
        @GetUserID() sellerId: number
    ) {
        return this.bilService.getBillForSeller(sellerId);
    }

    @Auth([Roles.Admin])
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getBillByID(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bilService.getBillByID(id);
    }

    @Auth([Roles.Seller])
    @HttpCode(HttpStatus.OK)
    @Put('update/:id')
    updatePaymentSatuts(
        @Param('id', ParseIntPipe) id: number,
        @GetUserID() sellerId: number,
        @Body() updateDTO: UpdateStatusBillDTO
    ) {
        return this.bilService.updatePaymentStatus(updateDTO, sellerId, id);
    }
}
