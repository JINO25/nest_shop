/* eslint-disable prettier/prettier */

import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        cloudinary.config({
            cloud_name: configService.get<string>('cloudinary.cloud_name'),
            api_key: configService.get<string>('cloudinary.api_key'),
            api_secret: configService.get<string>('cloudinary.api_secret'),
        });
        return cloudinary;
    },
};
