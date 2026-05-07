import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Loader } from '@/shared/ui/Loader';

/**
 * Gate for any route that requires a logged-in user.
 *
 * - While we haven't yet read storage (`isHydrated === false`) we render a
 *   loader so we never flash a redirect on a browser refresh.
 * - On unauthenticated → bounce to /login, preserving the intended URL in
 *   `state.from` so the login screen can deep-link back after success.
 */
export function ProtectedRoute() {
  const { isHydrated, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isHydrated) return <Loader fullscreen label="Loading session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
