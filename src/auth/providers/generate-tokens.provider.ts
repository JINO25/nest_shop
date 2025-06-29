/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from '../../entities/User.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        /**
         * Inject jwtService
         */
        private readonly jwtService: JwtService,

        /**
         * Inject jwtConfiguration
         */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) { }

    public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            },
        );
    }

    public async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            // Generate Access Token with Email
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accessTokenTtl,
                {
                    email: user.email,
                    role: user.role.role,
                },
            ),

            // Generate Refresh token without email
            this.signToken(user.id,
                this.jwtConfiguration.refreshTokenTtl,
                {
                    role: user.role.role
                }
            ),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
}