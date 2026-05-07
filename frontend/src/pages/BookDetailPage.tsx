import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Highlighter } from 'lucide-react';
import { useMyNotesForBookQuery, useCreateNoteMutation } from '@/features/notes/notesApi';
import { Loader } from '@/shared/ui/Loader';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/Toast/ToastProvider';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = id!;
  const toast = useToast();

  const { data, isLoading, isError, refetch } = useMyNotesForBookQuery({ bookId });
  const [createNote, { isLoading: saving }] = useCreateNoteMutation();

  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [comment, setComment] = useState('');
  const [pageNumber, setPageNumber] = useState<string>('');

  async function onSave() {
    if (!selectedText.trim()) return;
    try {
      await createNote({
        bookId,
        selectedText: selectedText.trim(),
        comment: comment.trim() || undefined,
        pageNumber: pageNumber ? Number(pageNumber) : undefined,
      }).unwrap();
      toast.success('Highlight saved');
      setOpen(false);
      setSelectedText('');
      setComment('');
      setPageNumber('');
    } catch (err: any) {
      toast.error('Could not save', err?.data?.message ?? 'Please try again');
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-soft">Book</p>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">Reading view</h1>
        </div>
        <Button leftIcon={<Highlighter size={16} />} onClick={() => setOpen(true)}>
          Add highlight
        </Button>
      </header>

      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-brand-50 sm:p-8">
        <h2 className="font-display text-xl text-ink">My notes</h2>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage onRetry={refetch} />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No highlights yet"
            description="Save your first highlight while reading."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {data.data.map((n) => (
              <li
                key={n.id}
                className="rounded-2xl border border-brand-50 bg-surface-muted p-4"
              >
                <p className="text-sm text-ink">"{n.selectedText}"</p>
                {n.comment && (
                  <p className="mt-1 text-xs text-ink-muted">— {n.comment}</p>
                )}
                <p className="mt-1 text-[11px] text-ink-soft">
                  {n.pageNumber ? `p. ${n.pageNumber} · ` : ''}
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New highlight">
        <div className="space-y-4">
          <Input
            label="Selected text"
            placeholder="Paste or type the highlighted fragment"
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
          />
          <Input
            label="Comment (optional)"
            placeholder="Why does this matter?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Input
            label="Page (optional)"
            type="number"
            min={1}
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} loading={saving}>
              Save highlight
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
