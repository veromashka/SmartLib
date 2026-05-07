import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import type { Role } from '@/shared/types/role';

interface Props {
  allow: Role[];
  /** Where to send users without the role. Default: their own role's home. */
  fallback?: string;
}

/**
 * Composable role check. Wrap routes inside <RoleGuard allow={['ADMIN']}>.
 * Place AFTER ProtectedRoute in the route tree so we know `user` is loaded.
 */
export function RoleGuard({ allow, fallback }: Props) {
  const { role } = useAuth();
  if (!role || !allow.includes(role)) {
    return <Navigate to={fallback ?? roleHome(role)} replace />;
  }
  return <Outlet />;
}

export function roleHome(role: Role | undefined): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'MANAGER':
      return '/dashboard';
    case 'READER':
      return '/books';
    default:
      return '/login';
  }
}
