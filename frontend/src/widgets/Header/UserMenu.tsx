import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, BookMarked, ChevronDown } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { useToast } from '@/shared/ui/Toast/ToastProvider';

export function UserMenu() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = (user?.login ?? user?.email ?? '?')
    .split(/[.@\s_-]+/)
    .map((s) => s[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-brand-100 bg-white py-1.5 pl-1.5 pr-3 text-sm shadow-soft transition hover:border-brand-300 hover:shadow-card"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
          {initials || 'U'}
        </span>
        <span className="hidden text-ink sm:block">{user?.login ?? 'Account'}</span>
        <ChevronDown size={14} className="text-ink-soft" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white p-2 shadow-card ring-1 ring-brand-100 animate-fade-in">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-ink">{user?.login}</p>
            <p className="text-xs text-ink-soft">{user?.email}</p>
            {role && (
              <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                {role}
              </span>
            )}
          </div>
          <hr className="my-1 border-brand-50" />
          <MenuLink to="/profile" icon={<UserIcon size={14} />} label="Profile" onClick={() => setOpen(false)} />
          <MenuLink to="/my-books" icon={<BookMarked size={14} />} label="My Books" onClick={() => setOpen(false)} />
          <button
            onClick={() => {
              dispatch(logout());
              toast.success('Signed out');
              navigate('/login');
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-brand-50"
    >
      {icon}
      {label}
    </Link>
  );
}
