import { useAuth } from '@/features/auth/useAuth';

export default function ProfilePage() {
  const { user, role } = useAuth();
  return (
    <section className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl text-ink">Profile</h1>
      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-brand-50">
        <Field label="Login" value={user?.login} />
        <Field label="Email" value={user?.email} />
        <Field label="Role" value={role} />
        <Field label="User ID" value={user?.id} mono />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-brand-50 py-3 last:border-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className={`text-sm text-ink ${mono ? 'font-mono text-xs' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}
