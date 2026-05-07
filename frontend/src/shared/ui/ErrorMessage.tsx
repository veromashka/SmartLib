import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * Tries to be friendly, not scary. Use for inline errors inside cards/lists.
 * Toast is for transient errors; this one is for "section failed to load".
 */
export function ErrorMessage({
  title = 'Something went wrong',
  message = "We couldn't load this section. Please try again.",
  onRetry,
}: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center animate-fade-in"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-soft">
        <AlertCircle size={22} />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-ink">{title}</h3>
        <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
