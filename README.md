# SmartLib

Online library CRM — books catalog, reading notes, AI recommendations.

## Repository layout

```
SmartLib/
├── backend/      NestJS + Prisma/PostgreSQL API
│   └── README.md
├── frontend/     React + Redux Toolkit + RTK Query SPA
│   └── README.md
├── .github/      Shared GitHub config (PR template, future CI)
└── .gitignore
```

Each side is a self-contained Node project with its own `package.json`,
lockfile and tooling. They share nothing at install time — pick whichever
half you need to work on, or run both.

## Run locally

Open two terminals:

```bash
# 1) Backend — NestJS on :3000
cd backend
npm install
cp .env.example .env          # fill JWT_SECRET, DATABASE_URL, OPENAI_API_KEY
npx prisma migrate dev
npm run start:dev

# 2) Frontend — Vite on :5173 (proxies /api → :3000)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Swagger docs live at http://localhost:3000/api/docs.

## What's where

| Concern                                  | Lives in                          |
| ---------------------------------------- | --------------------------------- |
| REST API, auth, business logic           | `backend/src/`                    |
| Database schema & migrations             | `backend/prisma/`                 |
| External book search (Google / OpenLib)  | `backend/src/books-parser/`       |
| AI recommendations (OpenAI)              | `backend/src/ai/`                 |
| UI design system (buttons, modals, …)    | `frontend/src/shared/ui/`         |
| Feature slices + RTK Query endpoints     | `frontend/src/features/`          |
| Pages & routing                          | `frontend/src/pages/`, `app/`     |

## Conventions

- Each side has its own README with deeper architecture notes.
- `.env` files are git-ignored; `.env.example` documents what to set.
- Migrations live in `backend/prisma/migrations/`; never edit applied ones.
- Frontend never imports from backend (and vice versa) — they communicate
  only over HTTP, through the typed API in `frontend/src/features/*/api.ts`.

## Future considerations

- npm workspaces / pnpm workspaces if shared types grow (e.g., a `shared/`
  package for DTO/contract types). For now, the front re-declares the small
  surface it needs in `shared/types/`.
- CI: add GitHub Actions in `.github/workflows/` running
  `cd backend && npm test` and `cd frontend && npm run typecheck`.
