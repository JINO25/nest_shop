/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { User } from '../entities/User.entity';
import { Bill } from '../entities/Bill.entity';
import { ProductVariant } from '../entities/ProductVariant.entity';
import { OrderService } from './providers/order.service';
import { CartItem } from '../entities/CartItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, User, Bill, ProductVariant, CartItem])
  ],
  providers: [OrderService],
  controllers: [OrdersController]
})
export class OrdersModule { }
