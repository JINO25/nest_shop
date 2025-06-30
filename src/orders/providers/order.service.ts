/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getDataSourceToken, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductVariant } from '../../entities/ProductVariant.entity';
import { Order } from '../../entities/Order.entity';
import { OrderDetail } from '../../entities/OrderDetail.entity';
import { Bill } from '../../entities/Bill.entity';
import { OrderDetailReqDTO } from '../dto/req/order-detail-req.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { plainToInstance } from 'class-transformer';
import { OrderDTO } from '../dto/res/order.dto';
import { UpdateOrderStatusDTO } from '../dto/req/update-status-oder-dto';
import { CartItemEqDTO } from '../dto/req/cart-item-eq.dto';
import { CartItem } from '../../entities/CartItem.entity';
import { CartStatus } from '../../cart/enums/cart-status.enum';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ProductVariant)
        private readonly productVariantRepository: Repository<ProductVariant>,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>,

        @InjectRepository(Bill)
        private readonly billRepository: Repository<Bill>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @Inject(getDataSourceToken()) // Inject DataSource để dùng queryRunner
        private readonly dataSource: DataSource,
    ) { }

    async createOrder(orderReq: OrderDetailReqDTO, userId: number): Promise<OrderDTO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException("Please login again!");
        }

        const productVariant = await this.productVariantRepository.findOne({
            where: { id: orderReq.productVariantId }
        });

        if (!productVariant) {
            throw new NotFoundException(`Product not found with id: ${orderReq.productVariantId}`);
        }

        if (productVariant.stock < orderReq.quantity) {
            throw new BadRequestException(`Not enough stock for order with id variant: ${orderReq.productVariantId}`);
        }

        productVariant.stock -= orderReq.quantity;
        await this.productVariantRepository.save(productVariant);

        const order = this.orderRepository.create({
            user,
            orderDate: new Date(),
            status: OrderStatus.PENDING
        });

        await this.orderRepository.save(order);

        const orderDetail = this.orderDetailRepository.create({
            quantity: orderReq.quantity,
            price: productVariant.price,
            productVariant,
            order
        });


        order.orderDetails = [orderDetail];
        await this.orderDetailRepository.save(orderDetail);

        const bill = this.billRepository.create({
            order,
            billDate: new Date(),
            method: 'COD',
            paymentStatus: PaymentStatus.UNPAID,
            total: orderDetail.price * orderDetail.quantity,
        });

        await this.billRepository.save(bill);

        const orderRes = await this.orderRepository.findOne({
            where: { id: order.id },
            relations: ['user', 'orderDetails.productVariant', 'orderDetails.productVariant.product']
        });

        if (!orderRes) {
            throw new NotFoundException(`Order not found with id: ${order.id}`);
        }

        const data = {
            ...orderRes,
            userName: orderRes?.user.name
        };

        return plainToInstance(OrderDTO, data, {
            excludeExtraneousValues: true
        });
    }

    async getAllOrder(): Promise<OrderDTO[]> {
        const order = await this.orderRepository.find({
            relations: ['user', 'orderDetails.productVariant', 'orderDetails.productVariant.product']
        });
        if (order.length === 0) {
            return [];
        }

        const orderList = order.map(el => ({
            ...el,
            userName: el?.user.name
        }));

        return plainToInstance(OrderDTO, orderList, { excludeExtraneousValues: true });
    }

    async getAllOrderForSeller(userId: number): Promise<OrderDTO[]> {
        const orders = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.product', 'product')
            .leftJoinAndSelect('product.user', 'seller')
            .where('seller.id = :id', { id: userId })
            .getMany();

        if (orders.length === 0) {
            return [];
        }

        const orderList = orders.map(el => ({
            ...el,
            userName: el?.user.name
        }));

        return plainToInstance(OrderDTO, orderList, { excludeExtraneousValues: true });
    }

    async getAllOrderForUser(userId: number): Promise<OrderDTO[]> {
        const orders = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.product', 'product')
            // .leftJoinAndSelect('product.user', 'seller')
            .where('user.id = :id', { id: userId })
            .getMany();

        if (orders.length === 0) {
            return [];
        }

        const orderList = orders.map(el => ({
            ...el,
            userName: el?.user.name
        }));

        return plainToInstance(OrderDTO, orderList, { excludeExtraneousValues: true });
    }

    async getOrderByID(id: number): Promise<OrderDTO> {
        const order = await this.orderRepository.findOne({
            where: {
                id: id
            },
            relations: ['user', 'orderDetails.productVariant', 'orderDetails.productVariant.product']
        });

        if (!order) throw new NotFoundException(`Order not found with id: ${id}`);

        const data = {
            ...order,
            userName: order.user.name
        };

        return plainToInstance(OrderDTO, data, { excludeExtraneousValues: true });
    }

    async updateStatusOrder(id: number, dto: UpdateOrderStatusDTO, userId: number) {

        const order = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.product', 'product')
            .leftJoinAndSelect('product.user', 'seller')
            .where('order.id = :orderId', { orderId: id })
            .andWhere('seller.id = :id', { id: userId })
            .getOne();

        if (!order) throw new NotFoundException(`Order not found with id: ${id}`);

        order.status = dto.status;
        await this.orderRepository.save(order);

        return { message: 'Order status updated successfully' };
    }

    async deleteOrder(id: number, userId: number) {
        // const order = await this.orderRepository
        //     .createQueryBuilder('order')
        //     .leftJoinAndSelect('order.user', 'user')
        //     .leftJoinAndSelect('order.orderDetails', 'orderDetails')
        //     .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
        //     .leftJoinAndSelect('productVariant.product', 'product')
        //     .leftJoinAndSelect('product.user', 'seller')
        //     .where('order.id = :orderId', { orderId: id })
        //     .andWhere('seller.id = :id', { id: userId })
        //     .getOne();

        // if (!order) {
        //     throw new NotFoundException(`Order not found with id: ${id}`);
        // }

        // if (order.status !== OrderStatus.PENDING.toString()) {
        //     throw new BadRequestException('Only pending orders can be deleted.');
        // }

        // try {
        //     for (const detail of order.orderDetails) {
        //         if (!detail.productVariant) {
        //             throw new InternalServerErrorException(
        //                 `ProductVariant not found for order detail ID: ${detail.id}`,
        //             );
        //         }
        //         const productVariant = detail.productVariant;
        //         productVariant.stock += detail.quantity;
        //         await this.productVariantRepository.save(productVariant);
        //     }           

        //     await this.orderRepository.remove(order);

        //     return { message: 'Delete order successful!' };
        // } catch (error: any) {
        //     throw new InternalServerErrorException({
        //         message: 'Delete order failed! Try again.',
        //         error: error?.message || error,
        //     });
        // }

        // using transaction
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = await queryRunner.manager
                .getRepository(Order)
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.user', 'user')
                .leftJoinAndSelect('order.orderDetails', 'orderDetails')
                .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
                .leftJoinAndSelect('productVariant.product', 'product')
                .leftJoinAndSelect('product.user', 'seller')
                .where('order.id = :orderId', { orderId: id })
                .andWhere('seller.id = :id', { id: userId })
                .getOne();

            if (!order) {
                throw new NotFoundException(`Order not found with id: ${id}`);
            }

            if (order.status !== OrderStatus.PENDING.toString()) {
                throw new BadRequestException('Only pending orders can be deleted.');
            }

            for (const detail of order.orderDetails) {
                if (!detail.productVariant) {
                    throw new InternalServerErrorException(
                        `ProductVariant not found for order detail ID: ${detail.id}`,
                    );
                }

                detail.productVariant.stock += detail.quantity;
                await queryRunner.manager.getRepository(ProductVariant).save(detail.productVariant);
            }

            await queryRunner.manager.getRepository(Order).remove(order);

            await queryRunner.commitTransaction();
            return { message: 'Delete order successful!' };

        } catch (error: any) {

            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                message: 'Delete order failed! Try again.',
                error: error?.message || error,
            });

        } finally {
            await queryRunner.release();
        }
    }

    async cancelOrderForUser(id: number, userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = await queryRunner.manager
                .getRepository(Order)
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.user', 'user')
                .leftJoinAndSelect('order.orderDetails', 'orderDetails')
                .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
                .leftJoinAndSelect('productVariant.product', 'product')
                .where('order.id = :orderId', { orderId: id })
                .andWhere('user.id = :id', { id: userId })
                .getOne();

            if (!order) {
                throw new NotFoundException(`Order not found with id: ${id}`);
            }

            if (order.status !== OrderStatus.PENDING.toString()) {
                throw new BadRequestException('Only pending orders can be deleted.');
            }

            for (const detail of order.orderDetails) {
                if (!detail.productVariant) {
                    throw new InternalServerErrorException(
                        `ProductVariant not found for order detail ID: ${detail.id}`,
                    );
                }

                detail.productVariant.stock += detail.quantity;
                await queryRunner.manager.getRepository(ProductVariant).save(detail.productVariant);
            }

            order.status = OrderStatus.CANCELLED;
            await queryRunner.manager.getRepository(Order).save(order);

            await queryRunner.commitTransaction();
            return { message: 'Delete order successful!' };

        } catch (error: any) {

            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                message: 'Delete order failed! Try again.',
                error: error?.message || error,
            });

        } finally {
            await queryRunner.release();
        }
    }

    async createOrderFromCart(dto: CartItemEqDTO, userId: number): Promise<OrderDTO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User not found with id: ${userId}`);
        }

        const order = this.orderRepository.create({
            orderDate: new Date(),
            status: OrderStatus.PENDING,
            user,
        });

        await this.orderRepository.save(order);

        const orderDetails: OrderDetail[] = [];

        for (const cartItemId of dto.cartItemIds) {
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['productVariant'],
            });

            if (!cartItem) {
                throw new NotFoundException(`Cart item not found: ${cartItemId}`);
            }

            const productVariant = await this.productVariantRepository.findOne({
                where: { id: cartItem.productVariant.id },
            });

            if (!productVariant) {
                throw new NotFoundException(`Product variant not found with id: ${cartItem.productVariant.id}`);
            }

            if (productVariant.stock < cartItem.quantity) {
                throw new BadRequestException(`Not enough stock for variant ID: ${productVariant.id}`);
            }

            productVariant.stock -= cartItem.quantity;
            await this.productVariantRepository.save(productVariant);

            const orderDetail = this.orderDetailRepository.create({
                price: productVariant.price,
                quantity: cartItem.quantity,
                order,
                productVariant,
            });

            orderDetails.push(orderDetail);

            cartItem.status = CartStatus.CHECKED_OUT;
            await this.cartItemRepository.save(cartItem);
        }

        order.orderDetails = orderDetails;
        await this.orderRepository.save(order);

        const total = orderDetails.reduce((sum, d) => sum + d.price * d.quantity, 0);

        const bill = this.billRepository.create({
            order,
            billDate: new Date(),
            method: 'COD',
            paymentStatus: PaymentStatus.UNPAID,
            total,
        });

        await this.billRepository.save(bill);

        const orderRes = await this.orderRepository.findOne({
            where: { id: order.id },
            relations: ['user', 'orderDetails.productVariant', 'orderDetails.productVariant.product']
        });

        if (!orderRes) {
            throw new NotFoundException(`Order not found with id: ${order.id}`);
        }

        const data = {
            ...orderRes,
            userName: orderRes?.user.name
        };

        return plainToInstance(OrderDTO, data, {
            excludeExtraneousValues: true
        });
    }

}
