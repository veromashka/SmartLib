import { Library, Users as UsersIcon, BookPlus, Sparkles } from 'lucide-react';

const tiles = [
  { icon: <Library size={20} />,   label: 'Catalog',         hint: 'Manage books'   },
  { icon: <BookPlus size={20} />,  label: 'Import',          hint: 'From Google / Open Library' },
  { icon: <UsersIcon size={20} />, label: 'Readers',         hint: 'View activity'  },
  { icon: <Sparkles size={20} />,  label: 'AI insights',     hint: 'Recommendations' },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Manager dashboard</h1>
        <p className="text-ink-muted">Quick access to your most-used tools.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <button
            key={t.label}
            className="group flex flex-col items-start gap-3 rounded-3xl border border-brand-50 bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-card hover:border-brand-100"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
              {t.icon}
            </span>
            <div>
              <p className="font-display text-lg text-ink">{t.label}</p>
              <p className="text-sm text-ink-muted">{t.hint}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
