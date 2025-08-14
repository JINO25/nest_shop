/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './providers/images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../common/decorators/auth.decorator';
import { Roles } from '../auth/enums/role.enum';
import { GetUserID } from '../common/decorators/get-user-id.decorator';

@Controller('images')
export class ImagesController {
    constructor(
        private readonly imgService: ImagesService,
    ) { }

    @Auth([Roles.Seller])
    @Post(':productId')
    @UseInterceptors(FilesInterceptor('images'))
    async addImage(
        @GetUserID() userId: number,
        @Param('productId') productId: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body('isCover') isCover?: boolean
    ) {
        return await this.imgService.addImage(productId, userId, files, isCover);
    }

    @Put('update/:id')
    @Auth([Roles.Seller])
    @UseInterceptors(FileInterceptor('image'))
    updateImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @GetUserID('id') userId: number
    ) {
        return this.imgService.updateImage(id, file, userId);
    }

    @Delete('delete/:id')
    @Auth([Roles.Seller])
    deleteImage(
        @Param('id', ParseIntPipe) id: number,
        @GetUserID('id') userId: number
    ) {
        return this.imgService.deleteImage(id, userId);
    }
}
