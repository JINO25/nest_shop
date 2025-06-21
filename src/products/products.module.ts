/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { CategoriesModule } from '../categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/Product.entity';
import { ProductVariant } from '../entities/ProductVariant.entity';
import { User } from '../entities/User.entity';
import { ProductsController } from './products.controller';
import { Category } from '../entities/Category.entity';

@Module({
  imports: [CategoriesModule, TypeOrmModule.forFeature([Product, ProductVariant, User, Category])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule { }
