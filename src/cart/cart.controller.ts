/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { GetUserID } from '../common/decorators/get-user-id.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';
import { CartReqDto } from './dto/req/cart-req.dto';
import { UpdateCartReqDTO } from './dto/req/update-cart.dto';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) { }

    @Get('my-cart')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    getMyCart(@GetUserID() userID: number) {
        return this.cartService.getCartForCurrentUser(userID);
    }

    @Post('add')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    addItemToCart(@GetUserID() userID: number, @Body() cartReqDto: CartReqDto) {
        return this.cartService.addItem(userID, cartReqDto);
    }

    @Patch('update/:id')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    async updateItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCartReqDTO: UpdateCartReqDTO,
        @GetUserID() userId: number
    ) {
        const check = await this.cartService.updateItemInCart(id, userId, updateCartReqDTO);
        return { result: check ? 'success' : 'fail!' }
    }

    @Delete('delete')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    async deleteItem(
        @Query('id', ParseIntPipe) id: number,
    ) {
        const check = await this.cartService.removeItem(id);
        return { result: check ? 'success' : 'fail!' }
    }

    @Delete('clear')
    @Auth([Roles.User])
    @HttpCode(HttpStatus.OK)
    async clearCart(
        @GetUserID() userId: number
    ) {
        const check = await this.cartService.clearCartItem(userId);
        return { result: check ? 'success' : 'fail!' }
    }
}
