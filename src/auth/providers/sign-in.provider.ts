/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Inject,
    Injectable,
    RequestTimeoutException,
    UnauthorizedException,
    forwardRef,
} from '@nestjs/common';

import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';

@Injectable()
export class SignInProvider {
    constructor(
        // Injecting UserService
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        /**
         * Inject the hashingProvider
         */
        private readonly hashingProvider: HashingProvider,

        /**
         * Inject generateTokensProvider
         */
        private readonly generateTokensProvider: GenerateTokensProvider,
    ) { }

    public async signIn(signInDto: SignInDto) {
        // find user by email ID
        let user = await this.usersService.findOneByEmail(signInDto.email);
        // Throw exception if user is not found
        // Above | Taken care by the findInByEmail method

        let isEqual: boolean = false;

        try {
            // Compare the password to hash
            isEqual = await this.hashingProvider.comparePassword(
                signInDto.password,
                user.password,
            );
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: 'Could not compare the password',
            });
        }

        if (!isEqual) {
            throw new UnauthorizedException('Password does not match');
        }


        // Generate access token
        return await this.generateTokensProvider.generateTokens(user);
    }
}