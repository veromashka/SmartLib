import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

/**
 * Centered layout used for /login and any future onboarding pages.
 * The pink gradient lives in `index.css` body — we just frame the card here.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-2 px-6 py-5 text-ink">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
          <BookOpen size={18} />
        </span>
        <span className="font-display text-xl tracking-tight">SmartLib</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </div>

      <footer className="px-6 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} SmartLib · Made with ♡
      </footer>
    </div>
  );
}
