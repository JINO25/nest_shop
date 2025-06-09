/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../auth/enums/role.enum';


export const AUTH_KEY = 'auth';

// export type Roles = 'admin' | 'user' | 'seller' | 'public';

export const Auth = (roles: Roles[] = []) => SetMetadata(AUTH_KEY, roles);
