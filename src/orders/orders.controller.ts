/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';
import { OrderDetailReqDTO } from './dto/req/order-detail-req.dto';
import { GetUserID } from '../common/decorators/get-user-id.decorator';
import { UpdateOrderStatusDTO } from './dto/req/update-status-oder-dto';
import { CartItemEqDTO } from './dto/req/cart-item-eq.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrderService,
    ) { }

    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    @Post('create')
    createOrder(
        @Body() orderReq: OrderDetailReqDTO,
        @GetUserID() userId: number
    ) {
        return this.orderService.createOrder(orderReq, userId);
    }

    @Auth([Roles.Admin])
    @HttpCode(HttpStatus.OK)
    @Get()
    getAllOrder() {
        return this.orderService.getAllOrder();
    }

    @Auth([Roles.Seller])
    @HttpCode(HttpStatus.OK)
    @Get('seller')
    getAllOrderForSeller(
        @GetUserID() userId: number
    ) {
        return this.orderService.getAllOrderForSeller(userId);
    }

    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    @Get('user')
    getAllOrderForUser(
        @GetUserID() userId: number
    ) {
        return this.orderService.getAllOrderForUser(userId);
    }

    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getOrderByID(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.orderService.getOrderByID(id);
    }

    @Auth([Roles.Seller])
    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    updateOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() status: UpdateOrderStatusDTO,
        @GetUserID() userId: number
    ) {
        return this.orderService.updateStatusOrder(id, status, userId);
    }

    @Auth([Roles.Seller, Roles.User])
    @HttpCode(HttpStatus.OK)
    @Delete(':id/delete')
    deleteOrder(
        @Param('id', ParseIntPipe) id: number,
        @GetUserID() userId: number
    ) {
        return this.orderService.deleteOrder(id, userId);
    }

    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    @Delete(':id/cancel')
    cancelOrder(
        @Param('id', ParseIntPipe) id: number,
        @GetUserID() userId: number
    ) {
        return this.orderService.cancelOrderForUser(id, userId);
    }

    @Post('from-cart')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    async createOrderFromCart(
        @Body() dto: CartItemEqDTO,
        @GetUserID() userId: number,
    ) {
        return this.orderService.createOrderFromCart(dto, userId);
    }

}
