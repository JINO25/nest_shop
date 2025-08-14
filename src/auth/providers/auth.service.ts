/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SignInProvider } from './sign-in.provider';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { MailService } from '../../common/mail/mail.service';
import { createHash, randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordReset } from '../../entities/PasswordReset.entity';
import { Repository } from 'typeorm';
import { PasswordResetDTO } from '../dto/password-reset.dto';
import { HashingProvider } from './hashing.provider';
import { User } from '../../entities/User.entity';


@Injectable()
export class AuthService {
    constructor(
        // Injecting UserService
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        @InjectRepository(PasswordReset)
        private readonly passRepo: Repository<PasswordReset>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        private readonly hashingProvider: HashingProvider,

        /**
         * Inject the signInProvider
         */
        private readonly signInProvider: SignInProvider,

        /**
         * Inject refreshTokensProvider
         */
        private readonly refreshTokensProvider: RefreshTokensProvider,

        private readonly mailService: MailService,
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.signIn(signInDto);
    }

    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
    }

    public async verifyToken(token: string) {
        const record = await this.passRepo.findOne({
            where: {
                token
            }
        });

        if (!record) {
            throw new NotFoundException(`Not found User`);
        }

        const check = this.isTokenValid(record);

        if (!check) {
            throw new BadRequestException('Token is expired!Token is expired!');
        }

        return {
            email: record.email,
            valid: true
        };
    }

    private isTokenValid(record: PasswordReset): boolean {
        const now = new Date();
        const expires = new Date(record.expires);

        return now.getTime() < expires.getTime();
    }


    public async forgotPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email);

        const token = randomBytes(32).toString('hex');

        const tokenReset = createHash('sha256').update(token).digest('hex');

        const prs = new PasswordReset();
        prs.email = email;
        prs.token = tokenReset;
        prs.expires = new Date(Date.now() + 10 * 60 * 1000);
        await this.passRepo.save(prs);

        await this.mailService.sendForgotPasswordEmail(user.email, tokenReset);

        return { message: 'Reset password email sent' };
    }

    async resetPassword(pwdResetDTO: PasswordResetDTO, token: string) {

        const { valid, email } = await this.verifyToken(token);

        if (!valid) {
            throw new BadRequestException(`Token expired, please send email again!`);
        }

        if (!email) {
            throw new BadRequestException('Email not found for this token');
        }

        const user = await this.usersService.findOneByEmail(email);


        if (!user) {
            throw new NotFoundException(`User not found with email: ${email}`);
        }

        const hashPass = await this.hashingProvider.hashPassword(pwdResetDTO.password);

        user.password = hashPass;
        await this.userRepo.save(user);

        await this.passRepo.delete({ email });

        return { message: 'Password reset successfully' };
    }

}