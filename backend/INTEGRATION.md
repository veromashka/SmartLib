# Integration Notes — Roles, Books Parser, AI Recommendations

## 1. Install dependencies

```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt \
      @nestjs/config @nestjs/swagger @nestjs/throttler \
      @nestjs/axios axios \
      @nestjs/cache-manager cache-manager \
      openai

npm i -D @types/passport-jwt @types/bcrypt
```

## 2. Environment

Copy `.env.example` → `.env` and fill in `JWT_SECRET`, `OPENAI_API_KEY`,
optionally `GOOGLE_BOOKS_API_KEY`.

## 3. Prisma migration

```bash
npx prisma migrate dev
npx prisma generate
```

The migration `20260507000000_roles_admin_manager_reader` remaps the legacy
enum (`USER`→`READER`, `EDITOR`→`MANAGER`, `ADMIN`→`ADMIN`).

## 4. Final folder structure (new files only)

```
src/
├── app.module.ts                 # ← updated: imports Auth/Parser/AI + Throttler
├── main.ts                       # ← updated: Swagger + ValidationPipe
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   └── auth-response.dto.ts
│   └── interfaces/
│       └── jwt-payload.interface.ts
│
├── common/
│   ├── enums/role.enum.ts        # ← updated: ADMIN/MANAGER/READER
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
│
├── books-parser/
│   ├── books-parser.module.ts
│   ├── books-parser.controller.ts
│   ├── books-parser.service.ts
│   ├── providers/
│   │   ├── google-books.provider.ts
│   │   └── open-library.provider.ts
│   ├── dto/
│   │   └── search-books.dto.ts
│   └── interfaces/
│       ├── book-provider.interface.ts
│       └── normalized-book.interface.ts
│
└── ai/
    ├── ai.module.ts
    ├── ai.controller.ts
    ├── ai.service.ts
    └── dto/
        ├── recommendation-request.dto.ts
        └── recommendation-response.dto.ts
```

## 5. Example requests

### Register / Login
```http
POST /api/auth/register
{ "login": "veronika", "email": "v@example.com", "password": "Strong1234!" }

POST /api/auth/login
{ "email": "v@example.com", "password": "Strong1234!" }
→ 200 { "accessToken": "<jwt>", "user": { ..., "role": "READER" } }
```

### Books Parser
```http
GET /api/books-parser/search/title?q=dune&page=1&pageSize=5&source=all
Authorization: Bearer <jwt>
```

```jsonc
{
  "source": "aggregated",
  "page": 1,
  "pageSize": 5,
  "total": 1234,
  "items": [
    {
      "source": "google_books",
      "externalId": "abc123",
      "title": "Dune",
      "authors": ["Frank Herbert"],
      "publishedYear": 1965,
      "isbn13": "9780441172719",
      "thumbnailUrl": "https://...",
      "infoUrl": "https://books.google.com/..."
    }
  ]
}
```

### AI Recommendations
```http
POST /api/ai/recommendations
Authorization: Bearer <jwt>
{ "genre": "fantasy", "limit": 3 }
```

```jsonc
{
  "genre": "fantasy",
  "similarGenres": ["epic fantasy", "sword and sorcery", "dark fantasy"],
  "books": [
    { "title": "The Name of the Wind", "author": "Patrick Rothfuss",
      "reason": "Lyrical prose, classic hero's journey." },
    { "title": "Mistborn: The Final Empire", "author": "Brandon Sanderson",
      "reason": "Hard-magic system, tight plotting." },
    { "title": "The Way of Kings", "author": "Brandon Sanderson",
      "reason": "Epic-scale world-building like fantasy at its grandest." }
  ],
  "explanation": "Selections cover three sub-flavors of fantasy you'll likely enjoy."
}
```

## 6. Architectural decisions (short)

- **Stateless JWT** — `JwtStrategy.validate()` does not hit the DB; role is
  carried in the token. Lower latency, fewer queries. Trade-off: revocation
  needs a deny-list (acceptable for MVP).
- **Two guards, in order** — `JwtAuthGuard` first (authn), then `RolesGuard`
  (authz). `@Public()` lets specific routes bypass authn even when the guard
  is class-level.
- **Provider pattern in books-parser** — Google Books and Open Library
  implement the same `BookProvider` interface. Adding a third source
  (e.g. ISBNdb) means dropping in one provider and registering it.
- **`Promise.allSettled` for aggregated search** — one slow/down provider
  doesn't take down the endpoint.
- **`response_format: json_object` for OpenAI** — eliminates a whole class of
  parse errors. Strict schema is enforced in the system prompt + validated on
  parse.
- **Per-route throttling on `/ai/*`** — global is 60/min, AI is 10/min, since
  LLM calls cost money.
- **`@nestjs/cache-manager`** in books-parser — 1h TTL on
  (kind, source, query, page) tuples. Replace store with Redis for multi-pod.
