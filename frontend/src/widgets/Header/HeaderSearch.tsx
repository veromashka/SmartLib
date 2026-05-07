import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '@/shared/ui/SearchInput';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { useSearchByTitleQuery } from '@/features/books/booksApi';
import { Spinner } from '@/shared/ui/Spinner';

/**
 * Debounced search bar with dropdown of suggestions.
 * - debounce avoids per-keystroke requests
 * - skip token when query too short
 * - click-outside closes the dropdown
 */
export function HeaderSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(q, 350);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useSearchByTitleQuery(
    { q: debounced, pageSize: 6 },
    { skip: debounced.trim().length < 2 },
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const items = data?.items ?? [];
  const showDropdown = open && debounced.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <SearchInput
        value={q}
        onChange={(v) => {
          setQ(v);
          setOpen(true);
        }}
        placeholder="Search books or authors…"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-auto rounded-2xl bg-white p-2 shadow-card ring-1 ring-brand-100 animate-fade-in">
          {isFetching ? (
            <div className="flex items-center justify-center py-6 text-ink-soft">
              <Spinner size="sm" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-soft">
              No matches for "{debounced}"
            </p>
          ) : (
            items.map((b) => (
              <Link
                key={`${b.source}-${b.externalId}`}
                to={b.infoUrl ?? '#'}
                target={b.infoUrl ? '_blank' : undefined}
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-brand-50"
              >
                {b.thumbnailUrl ? (
                  <img
                    src={b.thumbnailUrl}
                    alt=""
                    className="h-12 w-9 rounded-md object-cover shadow-soft"
                  />
                ) : (
                  <div className="h-12 w-9 rounded-md bg-brand-100" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{b.title}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {b.authors.join(', ') || '—'}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
