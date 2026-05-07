/**
 * User roles aligned with Prisma `Roles` enum.
 *
 * - ADMIN   — full system access (users, books, system settings)
 * - MANAGER — manage books / catalog (CRUD on books, genres, orders)
 * - READER  — read-only access to public catalog endpoints
 */
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  READER = 'READER',
}
