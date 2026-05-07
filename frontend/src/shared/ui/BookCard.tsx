import { BookOpen } from 'lucide-react';
import { cn } from './cn';

interface Props {
  title: string;
  author: string;
  year?: number | string;
  thumbnailUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function BookCard({ title, author, year, thumbnailUrl, onClick, className }: Props) {
  return (
    <article
      onClick={onClick}
      className={cn(
        'group flex flex-col overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-soft',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-brand-100',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-400">
            <BookOpen size={36} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink">
          {title}
        </h3>
        <p className="line-clamp-1 text-sm text-ink-muted">{author}</p>
        {year && (
          <p className="mt-1 text-xs text-ink-soft">{year}</p>
        )}
      </div>
    </article>
  );
}
