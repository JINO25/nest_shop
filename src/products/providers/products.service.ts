/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/Product.entity';
import { ILike, Repository } from 'typeorm';
import { ProductVariant } from '../../entities/ProductVariant.entity';
import { User } from '../../entities/User.entity';
import { ProductDTO } from '../dto/res/product.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductDTO } from '../dto/req/create-product.dto';
import { Category } from '../../entities/Category.entity';
import { UpdateProductDTO } from '../dto/req/update-product.dto';
import { UpdateFullDTO } from '../dto/req/update-full.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(ProductVariant)
        private readonly productVariantRepo: Repository<ProductVariant>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async findAll(): Promise<ProductDTO[]> {
        const products = await this.productRepo.find({
            relations: ['category', 'productVariants', 'user']
        });

        const productList = products.map(product => ({
            ...product,
            categoryName: product.category?.name ?? null,
            username: product.user?.name ?? null
        }));

        return plainToInstance(ProductDTO, productList, { excludeExtraneousValues: true });
    }

    async findById(id: number): Promise<ProductDTO> {
        const data = await this.productRepo.findOne({
            where: { id: id },
            relations: ['category', 'productVariants', 'user']
        });

        if (!data) {
            throw new NotFoundException(`Product not found with id: ${id}`);
        }

        const product = {
            ...data,
            categoryName: data.category?.name ?? null,
            username: data.user?.name ?? null
        };
        return plainToInstance(ProductDTO, product, { excludeExtraneousValues: true });
    }

    async findProductByName(name: string): Promise<ProductDTO[]> {
        const data = await this.productRepo.find({
            where: { name: ILike(`%${name}%`) },
            relations: ['category', 'productVariants', 'user']
        });

        if (!data) throw new NotFoundException(`Not found ${name} product!`);

        const productList = data.map(product => ({
            ...product,
            categoryName: product.category?.name ?? null,
            username: product.user?.name ?? null
        }));

        return plainToInstance(ProductDTO, productList, { excludeExtraneousValues: true });
    }

    async findProductByCategory(category: string): Promise<ProductDTO[]> {
        const data = await this.productRepo.find({
            where: {
                category: {
                    name: category
                }
            },
            relations: ['productVariants', 'user']
        });

        if (!data) throw new NotFoundException(`Not found products in ${category} category!`);

        const productList = data.map(product => ({
            ...product,
            categoryName: product.category?.name ?? null,
            username: product.user?.name ?? null
        }));

        return plainToInstance(ProductDTO, productList, { excludeExtraneousValues: true });
    }

    async createProduct(dto: CreateProductDTO, userID: number): Promise<ProductDTO> {
        const user = await this.userRepo.findOne({ where: { id: userID } });

        if (!user) throw new NotFoundException('User not found!');

        const product = new Product();
        product.user = user;
        product.name = dto.name;
        product.description = dto.description;

        let category = await this.categoryRepo.findOne({ where: { name: dto.categoryName } });
        if (!category) {
            category = this.categoryRepo.create({ name: dto.categoryName });
            await this.categoryRepo.save(category);
        }
        product.category = category;

        const savedProduct = await this.productRepo.save(product);

        const variant = this.productVariantRepo.create({
            option: dto.option,
            color: dto.color,
            price: dto.price,
            stock: dto.stock,
            product: savedProduct,
        });

        await this.productVariantRepo.save(variant);
        product.productVariants = [variant];

        const resultProduct = await this.productRepo.findOne({
            where: { id: savedProduct.id },
            relations: ['category', 'user', 'productVariants'],
        });

        if (!resultProduct) {
            throw new NotFoundException(`Product not found!`);
        }

        const productRes = {
            ...resultProduct,
            categoryName: resultProduct.category?.name ?? null,
            username: resultProduct.user?.name ?? null,
        };

        return plainToInstance(ProductDTO, productRes, { excludeExtraneousValues: true });
    }

    async update(id: number, variantId: number, dto: UpdateProductDTO): Promise<ProductDTO> {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException(`Product not found with id: ${id}`);
        }

        if (dto.name) {
            product.name = dto.name;
        }

        if (dto.description) {
            product.description = dto.description;
        }

        let category = await this.categoryRepo.findOne({ where: { name: dto.categoryName } });

        if (!category) {
            category = this.categoryRepo.create({ name: dto.categoryName });
            await this.categoryRepo.save(category);
        }

        product.category = category;

        const variant = await this.productVariantRepo.findOne({ where: { id: variantId } });

        if (!variant) {
            throw new NotFoundException(`Product variant not found with id: ${variantId}`);
        }

        variant.option = dto.option ?? null;
        variant.color = dto.color ?? null;
        variant.price = dto.price ?? 0;
        variant.stock = dto.stock ?? 0;
        variant.product = product;

        await this.productVariantRepo.save(variant);
        await this.productRepo.save(product);

        const resultProduct = await this.productRepo.findOne({
            where: { id },
            relations: ['category', 'user', 'productVariants'],
        });

        if (!resultProduct) {
            throw new NotFoundException(`Product not found!`);
        }

        const productRes = {
            ...resultProduct,
            categoryName: resultProduct.category?.name ?? null,
            username: resultProduct.user?.name ?? null,
        };

        return plainToInstance(ProductDTO, productRes, { excludeExtraneousValues: true });
    }

    async updateMultiVariants(productId: number, dto: UpdateFullDTO): Promise<ProductDTO> {
        const product = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['category', 'user', 'productVariants']
        });

        if (!product) {
            throw new NotFoundException(`Product not found with id: ${productId}`);
        }

        if (dto.name !== undefined) product.name = dto.name;
        if (dto.description !== undefined) product.description = dto.description;

        let category = await this.categoryRepo.findOne({ where: { name: dto.categoryName } });
        if (!category) {
            category = this.categoryRepo.create({ name: dto.categoryName });
            await this.categoryRepo.save(category);
        }
        product.category = category;
        const savedProduct = await this.productRepo.save(product);

        if (dto.productVariants && dto.productVariants.length > 0) {

            for (const variantDTO of dto.productVariants) {
                let variant: ProductVariant;

                if (variantDTO.id) {

                    const existingVariant = await this.productVariantRepo.findOne({
                        where: { id: variantDTO.id, product: { id: productId } },
                        relations: ['product']
                    });

                    if (!existingVariant) {
                        throw new NotFoundException(`Variant not found with id: ${variantDTO.id} for product ${productId}`);
                    }

                    variant = existingVariant;
                    variant.product = savedProduct;
                } else {
                    variant = new ProductVariant();
                    variant.product = savedProduct;
                }

                if (variantDTO.option !== undefined) variant.option = variantDTO.option;
                if (variantDTO.color !== undefined) variant.color = variantDTO.color;
                if (variantDTO.price !== undefined) variant.price = variantDTO.price;
                if (variantDTO.stock !== undefined) variant.stock = variantDTO.stock;

                await this.productVariantRepo.save(variant);
            }
        }

        const updatedProduct = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['category', 'user', 'productVariants']
        });

        if (!updatedProduct) {
            throw new NotFoundException(`Product not found after update with id: ${productId}`);
        }

        const productRes = {
            ...updatedProduct,
            categoryName: updatedProduct.category?.name ?? null,
            username: updatedProduct.user?.name ?? null
        };

        return plainToInstance(ProductDTO, productRes, { excludeExtraneousValues: true });
    }


    async deleteVariant(productId: number, variantId: number): Promise<boolean> {
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product not found with id: ${productId}`);
        }

        const variant = await this.productVariantRepo.findOne({ where: { id: variantId } });
        if (!variant) {
            throw new NotFoundException(`Product variant not found with id: ${variantId}`);
        }

        await this.productVariantRepo.delete(variantId);
        return true;
    }

    async deleteProduct(id: number): Promise<boolean> {
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product not found with id: ${id}`);
        }

        await this.productRepo.delete(id);
        return true;
    }
}
