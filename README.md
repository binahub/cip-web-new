# CIP Mehr — Mehrabad Airport Service Reservation

Frontend for Mehrabad Airport CIP (Commercially Important Person) lounge and service reservations. Built with Next.js 16, TanStack Query v5, Axios, and Tailwind CSS v4.

## Features

- Hero search bar with Jalali (Persian) date/time pickers
- Service cards for browsing CIP lounge services (VIP, parking, suites, etc.)
- Dark theme UI matching Figma design specifications
- Responsive layout with RTL support

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
  app/                  # App Router — pages, layouts, error/loading states
  services/             # Data-access layer — Axios calls + React Query hooks
    api-client.ts       # Shared Axios instance with interceptors
  components/
    home/               # Homepage components (Hero, SearchBar, ServiceCard, etc.)
    ui/                 # Generic primitives (Button, Card, Input, SearchField, etc.)
    layout/             # App-wide structure (Header, Footer)
  hooks/                # Shared generic hooks
  providers/            # App-wide providers (QueryClientProvider)
  lib/                  # Cross-cutting helpers
  types/                # Shared TypeScript types (ApiResponse<T>)
  config/               # Environment variable access
```

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Data Fetching:** TanStack Query v5 + Axios
- **Date Picker:** react-multi-date-picker (Jalali/Persian calendar)
- **Icons:** iconsax-react
- **Language:** TypeScript
