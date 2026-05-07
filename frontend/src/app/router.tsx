import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from '@/shared/ui/Loader';
import { ProtectedRoute } from '@/widgets/ProtectedRoute/ProtectedRoute';
import { RoleGuard, roleHome } from '@/widgets/ProtectedRoute/RoleGuard';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/features/auth/useAuth';

// Lazy-load pages → smaller initial bundle, faster TTI on /login.
const LoginPage      = lazy(() => import('@/pages/LoginPage'));
const BooksPage      = lazy(() => import('@/pages/BooksPage'));
const BookDetailPage = lazy(() => import('@/pages/BookDetailPage'));
const ProfilePage    = lazy(() => import('@/pages/ProfilePage'));
const MyBooksPage    = lazy(() => import('@/pages/MyBooksPage'));
const AdminPage      = lazy(() => import('@/pages/AdminPage'));
const DashboardPage  = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage   = lazy(() => import('@/pages/NotFoundPage'));

export function AppRouter() {
  const { role, isAuthenticated, isHydrated } = useAuth();

  return (
    <Suspense fallback={<Loader fullscreen />}>
      <Routes>
        {/* ----- Public ----- */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              isHydrated && isAuthenticated
                ? <Navigate to={roleHome(role)} replace />
                : <LoginPage />
            }
          />
        </Route>

        {/* ----- Authenticated ----- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Default landing depends on role */}
            <Route path="/" element={<Navigate to={roleHome(role)} replace />} />

            {/* Anyone authenticated */}
            <Route path="/books"        element={<BooksPage />} />
            <Route path="/books/:id"    element={<BookDetailPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
            <Route path="/my-books"     element={<MyBooksPage />} />

            {/* MANAGER + ADMIN */}
            <Route element={<RoleGuard allow={['MANAGER', 'ADMIN']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* ADMIN only */}
            <Route element={<RoleGuard allow={['ADMIN']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
