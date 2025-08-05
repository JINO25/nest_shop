/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';
import jwtConfig from '../config/jwt.config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from '../enums/role.enum';
import { AUTH_KEY } from '../../common/decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<Roles[]>(AUTH_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (authTypes?.includes(Roles.None)) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException("Please login again!");
    }

    if (authTypes.length > 0) {
      const role = payload?.role;
      console.log(role, authTypes);

      if (!authTypes.includes(role)) {
        throw new ForbiddenException("You do not have permission!")
      }
    }

    return true;
  }


  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    const cookieToken = request.cookies?.['access_token'];
    if (cookieToken) {
      return cookieToken;
    }

    return undefined;
  }
}
