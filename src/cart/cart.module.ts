/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/Cart.entity';
import { User } from '../entities/User.entity';
import { ProductVariant } from '../entities/ProductVariant.entity';
import { CartItem } from '../entities/CartItem.entity';
import { CartController } from './cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, User, ProductVariant, CartItem]),
  ],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController]
})
export class CartModule { }
