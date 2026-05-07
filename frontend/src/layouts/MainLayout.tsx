import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/Header/Header';

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
