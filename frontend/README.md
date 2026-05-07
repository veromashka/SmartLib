# SmartLib — Frontend

Modern React frontend for the SmartLib library CRM. Pairs with the NestJS
backend in `../` (root of repo).

## Stack

- **React 18** + **TypeScript** + **Vite** (fast HMR, ESM build)
- **Redux Toolkit** + **RTK Query** (state + data layer in one)
- **React Router v6** (data router, lazy routes)
- **TailwindCSS** (soft pink design system, `tailwind.config.js`)
- **lucide-react** icons, **clsx** classname helper

No Axios — RTK Query's `fetchBaseQuery` covers our needs (smaller bundle,
better cache integration).

## Quick start

```bash
cd frontend
npm install
cp .env.example .env       # optional — defaults work via Vite proxy
npm run dev
# → http://localhost:5173 (proxies /api → http://localhost:3000)
```

Backend should be running (`npm run start:dev` in repo root).

## Folder structure (feature-sliced)

```
src/
├── app/                  # store, hooks, router — wiring layer only
│   ├── store.ts
│   ├── hooks.ts          # typed useAppDispatch / useAppSelector
│   └── router.tsx
│
├── shared/               # reusable, no business logic
│   ├── api/baseApi.ts    # RTK Query root + JWT injection + 401 handler
│   ├── lib/              # pure helpers (tokenStorage, useDebouncedValue)
│   ├── types/            # cross-feature types (Role, User, PaginatedResponse)
│   └── ui/               # design system (Button, Input, Modal, Loader, Toast…)
│
├── features/             # business domains, each with its own slice + api
│   ├── auth/             # authSlice, authApi, useAuth
│   ├── books/            # booksApi, types
│   ├── notes/            # notesApi
│   └── users/            # usersApi
│
├── widgets/              # cross-feature composite UI
│   ├── Header/           # Header, HeaderSearch, UserMenu
│   └── ProtectedRoute/   # route gates
│
├── layouts/              # AuthLayout, MainLayout
├── pages/                # LoginPage, BooksPage, BookDetailPage, …
│
├── App.tsx
├── main.tsx
├── index.css             # Tailwind + body gradient + shimmer keyframes
└── vite-env.d.ts
```

### Why this layout

- **`features/` over `pages/`**: business logic (slices, queries, hooks) lives
  next to its domain, not its render target. Pages stay thin — they compose
  feature hooks + UI.
- **`widgets/`** for things used by multiple pages but built on multiple
  features (Header pulls auth + books search).
- **`shared/ui/`** is the design system — strictly no domain knowledge.

## Architecture decisions

### Single `baseApi`, endpoint injection per feature

`shared/api/baseApi.ts` defines the API once (base URL, headers, 401 handler).
Each feature ships its own file (`booksApi.ts`, `notesApi.ts`, …) that calls
`baseApi.injectEndpoints()`. Pros:

- one cache, one tag namespace → cross-feature invalidation just works
  (`invalidatesTags: ['Books']` from notes? → no problem)
- code-split friendly — endpoints register lazily
- never mutate `baseApi` directly

### JWT lifecycle

```
[Login]            authApi.login mutation
                       │
                       ▼ onQueryStarted → setCredentials({accessToken, user})
                authSlice (Redux) ──────► tokenStorage.set(...)   (localStorage)
                       │
                       ▼ on every request
        baseApi prepareHeaders → 'Authorization: Bearer <token>'
                       │
                       ▼ on 401
              baseQueryWithReauth → dispatch(logout())
                       │
                       ▼
        ProtectedRoute sees !isAuthenticated → /login
```

**Refresh-token slot is ready** in `baseApi.ts` — when backend adds
`/auth/refresh`, do the refresh-then-retry inside `baseQueryWithReauth`. No
component needs to change.

### Token storage trade-offs

- `localStorage` (chosen) — simple, survives reload, vulnerable to XSS
- `sessionStorage` — gone on tab close
- `httpOnly` cookie — best vs XSS, requires backend cookie support

`shared/lib/tokenStorage.ts` is the **single** place that touches storage —
swap to cookies later by changing one file.

### Routing & guards

```
<ProtectedRoute>          → requires any authenticated user
  <RoleGuard allow={…}>   → composable, runs after auth is known
```

- ProtectedRoute waits for `isHydrated` so we don't redirect on refresh.
- `state.from` carries the originally requested URL → after login we
  return there instead of the role default.
- `roleHome(role)` is the single source of truth for role-based redirects.

### Debounced search

`HeaderSearch` uses `useDebouncedValue(q, 350)` and feeds the debounced
value into `useSearchByTitleQuery({ skip: q.length < 2 })`. RTK Query
de-dupes identical args, so we get free request coalescing.

### Skeleton, empty, error — never blank

Every list page has three states wired:

```
isLoading → <BookCardSkeletonGrid />     (shimmer)
isError   → <ErrorMessage onRetry={…} /> (friendly card with retry)
empty     → <EmptyState … />             (encouraging copy)
```

This is the difference between "feels broken" and "feels professional".

### Toast system

Tiny context-based provider in `shared/ui/Toast/ToastProvider.tsx`. Use:

```tsx
const toast = useToast();
toast.success('Saved');
toast.error('Could not delete', err.message);
```

Auto-dismisses after 4.5 s, dismissable manually, animated.

### Design system

- Colors: `brand` (50-900), `surface`, `ink` (text). Components reference
  semantic names (`text-ink-muted`, `bg-surface-subtle`) — never raw rose
  values — so re-theming is one config file.
- Shadows: `soft` and `card` — components consistently use them at rest /
  hover for that gentle SaaS lift.
- Radii: `xl` / `2xl` / `3xl` for nested rounding.
- Typography: Inter for UI, DM Serif Display for headings.

## Pages map

| Path             | Page              | Roles                  |
| ---------------- | ----------------- | ---------------------- |
| `/login`         | LoginPage         | public                 |
| `/books`         | BooksPage         | any auth               |
| `/books/:id`     | BookDetailPage    | any auth (notes UI)    |
| `/profile`       | ProfilePage       | any auth               |
| `/my-books`      | MyBooksPage       | any auth               |
| `/dashboard`     | DashboardPage     | MANAGER, ADMIN         |
| `/admin`         | AdminPage         | ADMIN                  |
| `*`              | NotFoundPage      | —                      |

## Best practices to keep

- Always use the typed hooks `useAppDispatch` / `useAppSelector`.
- Never store auth in components — go through `useAuth()`.
- Keep pages dumb — feature hooks handle data, pages compose UI.
- New API calls → add to the matching `features/<x>/<x>Api.ts`. Never
  create another `createApi`.
- New global UI bits → `shared/ui/`. New domain-aware composites →
  `widgets/`.
- Avoid prop-drilling: lift to a feature hook (`useAuth`, …) or context
  if it's strictly UI (Toast).

## Production checklist

- `npm run build` → tree-shaken, code-split per route
- `npm run typecheck` → strict mode, zero `any`
- Set `VITE_API_BASE_URL` in CI to your real API origin
- Rotate JWT secret on backend before going live
- Consider switching `tokenStorage` to httpOnly cookies once backend supports it
