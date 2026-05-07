/** Mirrors backend `Role` enum in src/common/enums/role.enum.ts */
export type Role = 'ADMIN' | 'MANAGER' | 'READER';

export const ROLE: Record<Role, Role> = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  READER: 'READER',
};
