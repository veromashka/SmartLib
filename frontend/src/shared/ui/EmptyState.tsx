import type { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 shadow-soft">
        {icon ?? <BookOpen size={28} />}
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-ink">{title}</h3>
        {description && (
          <p className="max-w-md text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
