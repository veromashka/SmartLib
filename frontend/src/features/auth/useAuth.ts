import { useAppSelector } from '@/app/hooks';
import type { Role } from '@/shared/types/role';

/**
 * Tiny selector hook — keeps components decoupled from the slice shape.
 */
export function useAuth() {
  const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);
  return {
    isHydrated,
    isAuthenticated: Boolean(accessToken),
    accessToken,
    user,
    role: user?.role as Role | undefined,
  };
}
