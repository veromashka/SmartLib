import { useNavigate } from 'react-router-dom';
import { useListBooksQuery } from '@/features/books/booksApi';
import { BookCard } from '@/shared/ui/BookCard';
import { BookCardSkeletonGrid } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';

export default function BooksPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useListBooksQuery();

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Library</h1>
        <p className="text-ink-muted">Discover something new to read today.</p>
      </header>

      {isLoading ? (
        <BookCardSkeletonGrid count={8} />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No books yet"
          description="When new books are added, they'll show up here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {data.map((b) => (
            <BookCard
              key={b.id}
              title={b.title}
              author={b.author}
              year={b.releaseYear}
              onClick={() => navigate(`/books/${b.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
