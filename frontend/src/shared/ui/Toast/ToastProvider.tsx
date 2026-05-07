import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../cn';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastApi {
  show: (t: Omit<ToastItem, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

const kindStyles: Record<ToastKind, { ring: string; icon: ReactNode }> = {
  success: { ring: 'ring-emerald-200', icon: <CheckCircle2 className="text-emerald-500" size={20} /> },
  error:   { ring: 'ring-rose-200',    icon: <AlertTriangle className="text-rose-500" size={20} /> },
  info:    { ring: 'ring-brand-200',   icon: <Info className="text-brand-500" size={20} /> },
};

const TOAST_TTL = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastApi['show']>(
    (t) => {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev, { id, ...t }]);
      setTimeout(() => dismiss(id), TOAST_TTL);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ kind: 'success', title, description }),
      error:   (title, description) => show({ kind: 'error',   title, description }),
      info:    (title, description) => show({ kind: 'info',    title, description }),
    }),
    [show],
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 animate-fade-in',
              kindStyles[t.kind].ring,
            )}
          >
            <div className="mt-0.5">{kindStyles[t.kind].icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-ink-muted break-words">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-full p-1 text-ink-soft hover:bg-brand-50 hover:text-ink transition"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
