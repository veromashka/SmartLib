import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  useListUsersQuery,
  useDeleteUserMutation,
} from '@/features/users/usersApi';
import { Loader } from '@/shared/ui/Loader';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import { useAuth } from '@/features/auth/useAuth';

export default function AdminPage() {
  const { user: current } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useListUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const toast = useToast();

  async function onDelete(id: string, login: string) {
    if (!confirm(`Delete user "${login}"? This is reversible (soft delete).`)) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted', login);
    } catch (err: any) {
      toast.error('Could not delete', err?.data?.message ?? 'Please try again');
    }
  }

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage onRetry={refetch} />;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Admin · Users</h1>
        <p className="text-ink-muted">Manage user accounts and roles.</p>
      </header>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/60 text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data!.data.map((u) => (
              <tr key={u.id} className="border-t border-brand-50/80 transition hover:bg-brand-50/40">
                <td className="px-4 py-3 font-medium text-ink">{u.login}</td>
                <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">
                  {u.deletedAt ? 'Deleted' : 'Active'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<Trash2 size={14} />}
                    loading={deleting}
                    disabled={u.id === current?.id}
                    onClick={() => onDelete(u.id, u.login)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-ink-muted">
        <span>
          Page {data!.meta.page} of {data!.meta.totalPages} · {data!.meta.total} users
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= data!.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
