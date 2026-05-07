import { EmptyState } from '@/shared/ui/EmptyState';
import { BookMarked } from 'lucide-react';

export default function MyBooksPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">My books</h1>
        <p className="text-ink-muted">Books you currently have on loan or saved.</p>
      </header>
      <EmptyState
        icon={<BookMarked size={28} />}
        title="Nothing here yet"
        description="Once you check out books, they'll appear in your shelf."
      />
    </section>
  );
}
