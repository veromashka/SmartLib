import { NavLink } from 'react-router-dom';
import { BookOpen, Home, BarChart3, BookMarked } from 'lucide-react';
import { HeaderSearch } from './HeaderSearch';
import { UserMenu } from './UserMenu';
import { cn } from '@/shared/ui/cn';

const navItems = [
  { to: '/books',    label: 'Home',     icon: <Home size={16} /> },
  { to: '/my-books', label: 'My Books', icon: <BookMarked size={16} /> },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <NavLink to="/books" className="flex items-center gap-2 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
            <BookOpen size={18} />
          </span>
          <span className="hidden font-display text-xl tracking-tight sm:block">
            SmartLib
          </span>
        </NavLink>

        {/* Primary nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-muted hover:bg-brand-50 hover:text-ink',
                )
              }
            >
              {it.icon}
              {it.label}
            </NavLink>
          ))}
        </nav>

        {/* Search — flex grows to fill */}
        <div className="flex flex-1 justify-center">
          <HeaderSearch />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Reading Analytics — placeholder for future feature */}
          <button
            title="Reading analytics (coming soon)"
            aria-label="Reading analytics"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-ink-muted shadow-soft transition hover:border-brand-300 hover:text-brand-600 sm:flex"
          >
            <BarChart3 size={18} />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
