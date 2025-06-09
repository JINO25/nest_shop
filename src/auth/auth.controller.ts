/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signin.dto';
import { Roles } from './enums/role.enum';
import { Auth } from '../common/decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @Auth([Roles.None])
    @HttpCode(HttpStatus.OK)
    public async signIn(@Res({ passthrough: true }) res, @Body() signInDto: SignInDto) {
        const { accessToken, refreshToken } = await this.authService.signIn(signInDto);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15, // 15 phút
            sameSite: 'lax',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
            sameSite: 'lax',
        });
        return 'Login successful'
    }

    @Post('refresh')
    @Auth([Roles.None])
    @HttpCode(HttpStatus.OK)
    public async refreshToken(@Req() req, @Res({ passthrough: true }) res) {
        const refresh_token = req.cookies['refresh_token'];
        let refreshTokenDto = new RefreshTokenDto();
        refreshTokenDto.refreshToken = refresh_token;
        const { accessToken, refreshToken } = await this.authService.refreshTokens(refreshTokenDto);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15, // 15 phút
            sameSite: 'lax',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
            sameSite: 'lax',
        });
        return 'Refresh successful'
    }
}
