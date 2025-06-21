/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/Category.entity';
import { Product } from '../entities/Product.entity';
import { CategoryService } from './providers/categories.service';
import { CategoryController } from './categories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Product])],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [CategoryService]
})
export class CategoriesModule { }
