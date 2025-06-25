/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from '../../entities/Cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../../entities/ProductVariant.entity';
import { User } from '../../entities/User.entity';
import { plainToInstance } from 'class-transformer';
import { CartDTORespone } from '../dto/res/cart-respone.dto';
import { CartReqDto } from '../dto/req/cart-req.dto';
import { CartStatus } from '../enums/cart-status.enum';
import { CartItem } from '../../entities/CartItem.entity';
import { UpdateCartReqDTO } from '../dto/req/update-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(ProductVariant)
        private readonly productVariantRepo: Repository<ProductVariant>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createCart(user: User, manager?: EntityManager): Promise<Cart> {
        const cartRepo = manager ? manager.getRepository(Cart) : this.cartRepository;

        const cart = cartRepo.create({ user });
        return await cartRepo.save(cart);
    };

    async getCartForCurrentUser(userID: number) {
        const cart = await this.cartRepository.find({
            where: {
                user: {
                    id: userID
                }
            },
            relations: ['user', 'cartItems', 'cartItems.productVariant.product']
        });

        if (!cart.length) {
            return [];
        }

        const cartList = cart.map(el => ({
            ...el,
            userName: el.user?.name,

        }))

        return plainToInstance(CartDTORespone, cartList, { excludeExtraneousValues: true });
    }

    async addItem(userID: number, cartReqDto: CartReqDto) {
        const user = await this.userRepository.findOne({ where: { id: userID } });
        if (!user) {
            throw new NotFoundException(`User not found with id: ${userID}`);
        }

        let cart = await this.cartRepository.findOne({
            where: { user: user },
            relations: ['cartItems', 'user']
        });

        if (!cart) {
            cart = this.cartRepository.create({ user });
            cart = await this.cartRepository.save(cart);
        }

        const existingItem = cart.cartItems.find(
            item => item.productVariantId === cartReqDto.productVariantId && item.status !== CartStatus.CHECKED_OUT
        );

        if (existingItem) {
            existingItem.quantity += cartReqDto.quantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            const productVariant = await this.productVariantRepo.findOne({
                where: { id: cartReqDto.productVariantId }
            });

            if (!productVariant) {
                throw new NotFoundException(`Product not found!`);
            }

            const newItem = this.cartItemRepository.create({
                cart,
                quantity: cartReqDto.quantity,
                status: CartStatus.PENDING,
                productVariant,
            });

            await this.cartItemRepository.save(newItem);
        }

        const updatedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['user', 'cartItems', 'cartItems.productVariant.product'],
        });

        if (!updatedCart) throw new NotFoundException('Cart not found after update');

        const cartList = {
            ...updatedCart,
            userName: updatedCart.user?.name,
        };

        return plainToInstance(CartDTORespone, cartList, {
            excludeExtraneousValues: true,
        });
    }

    async updateItemInCart(cartItemID: number, userId: number, dto: UpdateCartReqDTO) {
        const cartItem = await this.cartItemRepository.findOne({
            where: {
                cart: {
                    userId: userId
                },
                id: cartItemID
            }
        });

        if (!cartItem) {
            throw new NotFoundException('Cart not found!');
        }


        const check = await this.cartItemRepository.update(cartItem, {
            quantity: dto.quantity
        },);

        if (check.affected && check.affected > 0) {
            return true;
        }

        throw new NotFoundException(`Item in cart not found!`);
    }

    async removeItem(cartItemID: number) {
        const item = await this.cartItemRepository.findOneBy({
            id: cartItemID
        });

        if (!item) {
            throw new NotFoundException(`Item in cart not found with id: ${cartItemID}!`);
        }

        await this.cartItemRepository.delete(item);

        return true;
    }

    async clearCartItem(userId: number) {

        const cart = await this.cartRepository.findOne({
            where: { userId: userId }
        });

        if (!cart) {
            throw new NotFoundException('Cart not found!');
        }

        const item = cart.cartItems.filter(item =>
            item.status === CartStatus.PENDING
        );

        if (item.length === 0) {
            return false;
        }

        await this.cartItemRepository.remove(item);
        return true;
    }
}
