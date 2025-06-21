/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/Category.entity';
import { Product } from '../../entities/Product.entity';
import { CategoryDTO } from '../dto/category.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,

        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    async findAll(): Promise<CategoryDTO[]> {
        const categories = plainToInstance(CategoryDTO, await this.categoryRepo.find());

        return categories;
    }

    async create(dto: CategoryDTO): Promise<CategoryDTO> {
        const newCategory = this.categoryRepo.create({ name: dto.name });
        const saved = await this.categoryRepo.save(newCategory);
        return plainToInstance(CategoryDTO, saved);
    }

    async update(id: number, dto: CategoryDTO): Promise<CategoryDTO> {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new NotFoundException(`Category not found with id ${id}`);

        category.name = dto.name;
        const updated = await this.categoryRepo.save(category);

        return plainToInstance(CategoryDTO, updated);
    }

    async delete(id: number): Promise<boolean> {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) return false;
        await this.categoryRepo.delete(id);
        return true;
    }

    async findCategoryWithProduct(name: string) {
        const category = await this.categoryRepo.findOne({ where: { name } });
        if (!category) throw new NotFoundException(`Category not found`);

        const products = await this.productRepo.find({
            where:
            {
                category:
                    { id: category.id }
            }
        });

        return {
            id: category.id,
            category: category.name,
            productList: products,
        };
    }
}
