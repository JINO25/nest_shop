/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../../users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly generateTokenProvider: GenerateTokensProvider,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }

    public async refreshTokens(refreshTokenDTO: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'>
            >(refreshTokenDTO.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            });
            // Fetch the user from the database
            const user = await this.usersService.findOneById(sub);

            // Generate the tokens
            return await this.generateTokenProvider.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException("Please login again!");
        }
    }
}
