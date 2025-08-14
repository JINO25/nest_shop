/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendForgotPasswordEmail(to: string, resetToken: string) {
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        await this.mailerService.sendMail({
            to,
            subject: 'Reset your password',
            template: './forgot-password',
            context: {
                resetUrl,
            },
        });
    }
}
