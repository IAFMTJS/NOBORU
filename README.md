# Noboru

Japanese language learning platform — your climb, your language, your journey.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- ShadCN UI
- Supabase Auth
- Framer Motion (installed, ready for animated feedback)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase project URL and anon key to `.env.local`.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check

## Project Structure

```
app/           Next.js App Router routes
components/    Shared UI components
features/      Feature modules (auth, learning, review, etc.)
lib/           Utilities and Supabase clients
docs/          Product and architecture documentation
assets/        Source assets with metadata
public/        Static assets served by Next.js
supabase/      Database and Supabase configuration
```

## Architecture

Code follows `.cursor/rules/architecture.mdc`:

- **UI** → components/pages (presentation only)
- **Application** → hooks, orchestrators (`lib/orchestration/`)
- **Service** → `features/*/services/`
- **Repository** → `features/*/repositories/` (only layer that calls Supabase)
- **Placeholder content** → `features/*/constants/` until database/CMS is connected

## Governance (Complete)

- [x] 16 core agents — `.cursor/agents/core/`
- [x] 50 sub-agents — `.cursor/agents/subagents/`
- [x] 14 cursor rules — `.cursor/rules/`
- [x] 22 documentation files — `docs/` (see `docs/README.md`)

## Phase 0 Status

- [x] Next.js + TypeScript + Tailwind
- [x] ShadCN UI foundation with Noboru design tokens
- [x] Supabase client + auth middleware
- [x] Layered auth (repository → service → hook → component)
- [x] App shell with 6-tab navigation per `uiux.mdc`
- [x] Home screen fields per HOME SCREEN RULE
- [x] Theme-aware Yama assets via asset registry
- [x] Auth pages (login, register)
- [x] PWA manifest
- [x] Agent system, cursor rules, documentation setup

## Phase 1 Status — Design System Foundation

- [x] Extended theme tokens (surface, semantic colors, elevation, motion)
- [x] Typography and spacing system in `app/globals.css` + `tailwind.config.ts`
- [x] Token reference in `lib/design-system/tokens.ts`
- [x] Button (primary, secondary, ghost, outline, destructive, loading)
- [x] Card, Badge, FormField, Input, Label, Checkbox, Switch, Select
- [x] Dialog (modal) and Sheet (bottom sheet)
- [x] Tabs + JLPT filter tabs
- [x] ProgressBar, Skeleton, SkeletonCard, Spinner, YamaLoading, EmptyState
- [x] Layout: PageContainer, ScreenHeader, ListRow, BottomNav
- [x] Barrel exports in `components/ui/index.ts`


## Phase 2 Status — Authentication & User Core

- [x] Supabase migration: `profiles`, `user_settings`, RLS, signup trigger
- [x] Registration, login, logout, password reset, update password
- [x] Auth callback route and protected route middleware
- [x] Profile creation on signup and display name editing
- [x] Settings with theme selection (Light / Dark / System) persisted to DB
- [x] Layered client/server repositories for auth, profile, and settings


## Phase 3 Status — Onboarding

- [x] 7-step onboarding flow at `/onboarding`
- [x] Welcome, goal, level, daily goal, theme, Meet Yama, Foothills region intro
- [x] Database fields: `onboarding_completed`, `learning_goal`, `current_level`, `current_region_slug`
- [x] Middleware redirects incomplete users to onboarding
- [x] Home dashboard personalized for Foothills after completion

## Design Reference

UI follows approved mockups in `assets/marketing/` and rules in `.cursor/rules/uiux.mdc`.