# Next.js Starter

Frontend-only boilerplate with Next.js 16, TanStack Query v5, Axios, and Tailwind CSS v4.

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
  app/                  # App Router — pages, layouts, error/loading states only
  services/             # Data-access layer — Axios calls + React Query hooks
    api-client.ts       # Shared Axios instance with interceptors
    users/              # User service (queries, mutations, types)
    orders/             # Order service (queries, mutations, types)
  components/
    ui/                 # Generic primitives (Button, Card, Input, Spinner)
    layout/             # App-wide structure (Header, Footer)
    users/              # User-specific components
    orders/             # Order-specific components
  hooks/                # Shared generic hooks
  providers/            # App-wide providers (QueryClientProvider)
  lib/                  # Cross-cutting helpers
  types/                # Shared TypeScript types (ApiResponse<T>)
  config/               # Environment variable access
```

## Adding a New Service

1. Create `src/services/<name>/` with `types.ts`, `queries.ts`, `mutations.ts`
2. Create `src/components/<name>/` for route-specific UI
3. Create `src/app/<name>/page.tsx` that imports from both
4. Follow the `users` folder as a template

## Assumptions

- Backend API returns responses shaped as `ApiResponse<T>`: `{ data: T, status: number, message?: string }`
- Auth uses Bearer token in localStorage (scaffolded, not implemented)
- API base URL comes from `NEXT_PUBLIC_API_BASE_URL` env var
