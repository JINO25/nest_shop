/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entities/Image.entity';
import { Repository } from 'typeorm';
import { Product } from '../../entities/Product.entity';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';


@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @Inject('CLOUDINARY')
        private readonly cloudinary: typeof Cloudinary
    ) { }

    private async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.upload_stream({ folder: 'shop/products' }, (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("No result returned from Cloudinary"));
                resolve(result);
            }).end(file.buffer);
        });
    }


    async addImage(productId: number, userId: number, files: Express.Multer.File[], isCover?: boolean) {
        const product = await this.productRepo.findOne({ where: { id: productId, userId } });
        if (!product) throw new NotFoundException(`Product ${productId} not found`);

        const uploadedImages: Image[] = [];
        for (const file of files) {

            const uploadResult = await this.uploadToCloudinary(file);
            const image = new Image();
            image.name = file.originalname;
            image.url = uploadResult.secure_url;
            image.public_Id = uploadResult.public_id;
            image.isCover = isCover || false;
            image.productId = product.id;
            uploadedImages.push(image);
        }

        return this.imageRepo.save(uploadedImages);
    }

    async updateImage(
        imageId: number,
        file: Express.Multer.File,
        userId: number,
        isCover?: boolean
    ) {
        const image = await this.imageRepo.findOne({
            where: { id: imageId },
            relations: ['product'],
        });

        if (!image) {
            throw new NotFoundException(`Image ${imageId} not found`);
        }

        if (image.product.userId !== userId) {
            throw new ForbiddenException(`You are not the owner of this product`);
        }

        const uploadResult = await this.uploadToCloudinary(file);

        image.name = file.originalname;
        image.url = uploadResult.secure_url;
        image.public_Id = uploadResult.public_id;
        image.isCover = isCover ?? image.isCover;

        return this.imageRepo.save(image);
    }

    async deleteImage(imageId: number, userId: number) {
        const image = await this.imageRepo.findOne({
            where: { id: imageId },
            relations: ['product'],
        });

        if (!image) {
            throw new NotFoundException(`Image ${imageId} not found`);
        }

        if (image.product.userId !== userId) {
            throw new ForbiddenException(`You are not the owner of this product`);
        }

        await new Promise<void>((resolve, reject) => {
            this.cloudinary.uploader.destroy(image.public_Id, (error) => {
                if (error) return reject(error);
                resolve();
            });
        });

        await this.imageRepo.delete(imageId);

        return { message: `Image ${imageId} deleted successfully` };
    }



    // ADMIN

    async getAllImage() {
        const data = await this.imageRepo.find();

        if (!data) return new NotFoundException(`Not found images!`);

        return data;
    }

}
