import { Role } from '../../common/enums/role.enum';

/**
 * Shape of the JWT payload after `JwtStrategy.validate()`.
 * This is what `request.user` will contain in protected routes.
 */
export interface JwtPayload {
  sub: string;     // user id (uuid)
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
