import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Attaches a list of allowed roles to a route handler / controller.
 *
 * @example
 *   @Roles(Role.ADMIN, Role.MANAGER)
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Post()
 *   createBook() {}
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
