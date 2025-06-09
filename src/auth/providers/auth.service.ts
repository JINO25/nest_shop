/* eslint-disable prettier/prettier */
import { SignInProvider } from './sign-in.provider';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        // Injecting UserService
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        /**
         * Inject the signInProvider
         */
        private readonly signInProvider: SignInProvider,

        /**
         * Inject refreshTokensProvider
         */
        private readonly refreshTokensProvider: RefreshTokensProvider,
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.signIn(signInDto);
    }

    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
    }
}