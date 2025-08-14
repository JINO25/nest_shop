/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entities/Image.entity';
import { Product } from '../entities/Product.entity';
import { ImagesService } from './providers/images.service';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image, Product]),
        CloudinaryModule
    ],
    providers: [ImagesService],
    exports: [ImagesService],
    controllers: [ImagesController]
})
export class ImagesModule { }
