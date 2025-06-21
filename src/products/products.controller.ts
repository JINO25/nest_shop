/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';
import { CreateProductDTO } from './dto/req/create-product.dto';
import { GetUserID } from '../common/decorators/get-user-id.decorator';
import { UpdateProductDTO } from './dto/req/update-product.dto';
import { UpdateFullDTO } from './dto/req/update-full.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productSer: ProductsService
    ) { }

    @Get()
    @Auth([Roles.None])
    @HttpCode(HttpStatus.OK)
    getAllProduct(@Query('name') name?: string) {
        return name
            ? this.productSer.findProductByName(name)
            : this.productSer.findAll();
    }


    @Get(":id")
    @Auth([Roles.None])
    @HttpCode(HttpStatus.OK)
    getProductByID(@Param('id') id: number) {
        return this.productSer.findById(id);
    }

    @Post()
    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.CREATED)
    createProduct(
        @Body() dto: CreateProductDTO,
        @GetUserID() userId: number,
    ) {
        return this.productSer.createProduct(dto, userId);
    }

    @Put(':id/variant/:variantId')
    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.OK)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Param('variantId', ParseIntPipe) variantId: number,
        @Body() dto: UpdateProductDTO,
    ) {
        return this.productSer.update(id, variantId, dto);
    }

    @Put(':id')
    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.OK)
    updateProductMultiVariants(
        @Param('id', ParseIntPipe) productId: number,
        @Body() dto: UpdateFullDTO,
    ) {

        return this.productSer.updateMultiVariants(productId, dto);
    }

    @Delete(':id/variant/:variantId')
    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.OK)
    deleteVariant(
        @Param('id', ParseIntPipe) productId: number,
        @Param('variantId', ParseIntPipe) variantId: number,
    ) {
        return this.productSer.deleteVariant(productId, variantId);
    }

    @Delete(':id')
    @Auth([Roles.Admin, Roles.Seller])
    @HttpCode(HttpStatus.OK)
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productSer.deleteProduct(id);
    }

}
