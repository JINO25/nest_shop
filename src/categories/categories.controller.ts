/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './providers/categories.service';
import { CategoryDTO } from './dto/category.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Auth([Roles.None])
    findAll() {
        const data = this.categoryService.findAll();
        return data;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth([Roles.None])
    create(@Body() dto: CategoryDTO) {
        return this.categoryService.create(dto);
    }

    @Get(':name/products')
    @HttpCode(HttpStatus.OK)
    @Auth([Roles.None])
    findCategoryWithProducts(@Param('name') name: string) {
        return this.categoryService.findCategoryWithProduct(name);
    }

    @Put(':id')
    @Auth([Roles.None, Roles.Admin])
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() dto: CategoryDTO) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @Auth([Roles.None, Roles.Admin])
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: number) {
        return this.categoryService.delete(id);
    }
}

