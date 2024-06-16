import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@common/auth/roles.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
