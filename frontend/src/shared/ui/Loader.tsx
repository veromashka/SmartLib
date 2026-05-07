import { cn } from './cn';
import { Spinner } from './Spinner';

interface Props {
  fullscreen?: boolean;
  label?: string;
  className?: string;
}

/**
 * One loader to cover three contexts:
 *  - inline:    <Loader />
 *  - fill page: <Loader fullscreen />
 *  - extra info: <Loader label="Loading…" />
 */
export function Loader({ fullscreen, label = 'Loading…', className }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-ink-muted',
        fullscreen
          ? 'fixed inset-0 z-50 bg-surface-subtle/80 backdrop-blur-sm'
          : 'py-12',
        className,
      )}
    >
      <Spinner size="lg" className="text-brand-500" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
