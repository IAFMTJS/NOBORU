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

## Phase 4 Status — Content Management System

- [x] Supabase migration: content tables, RLS, admin roles, Foothills seed
- [x] Domain repositories and admin services (vocabulary, kanji, grammar, lessons, regions, achievements)
- [x] Protected admin API routes under `/api/admin/*`
- [x] Admin panel at `/admin` with six content managers
- [x] Content workflow: draft → review → approved → published → archived

### Admin setup

1. Run migrations: `npx supabase db push` (or apply `supabase/migrations/20260608140000_content_cms.sql`)
2. Promote your user in Supabase SQL:

```sql
UPDATE profiles SET role = 'content_manager' WHERE user_id = '<your-auth-user-id>';
```

3. Sign in and open [http://localhost:3000/admin](http://localhost:3000/admin)

Admin routes require authentication but not completed onboarding.

## Phase 5 Status — Learning Engine

- [x] Migration: `lesson_items`, `user_progress`, starter Base Camp lessons
- [x] Lesson framework: intro → teach → recall → complete steps
- [x] Vocabulary, kanji, and grammar lesson types
- [x] Learning path at `/learn` with region navigation
- [x] Lesson player at `/learn/lesson/[lessonId]`
- [x] Progress saved via `/api/learning/progress/[lessonId]`
- [x] Home dashboard links to next incomplete lesson

## Phase 6 Status — Hiragana Region (Foothills)

- [x] Migration: `hiragana`, `reading_exercises`, `review_items`, full hiragana catalog (104 characters)
- [x] Foothills curriculum: 13 row lessons, 3 reading exercises, 1 mastery practice lesson
- [x] Hiragana + reading lesson types in the lesson engine
- [x] Hiragana chart at `/learn/hiragana` with learned progress
- [x] Review queue populated after hiragana lesson completion
- [x] Review tab shows due hiragana cards with Again / Good / Easy

Run migration: `npx supabase db push` (includes `20260608180000_hiragana_region.sql`)

## Phase 7 Status — Katakana Region (Forest Trail)

- [x] Migration: `katakana`, reading exercise `script` column, full katakana catalog (104 characters)
- [x] Forest Trail curriculum: 13 row lessons, 3 reading exercises, 1 mastery practice lesson
- [x] Katakana + reading lesson types in the lesson engine
- [x] Katakana chart at `/learn/katakana` with learned progress
- [x] Review queue populated after katakana lesson completion
- [x] Review tab shows due katakana cards with Again / Good / Easy

Run migration: `npx supabase db push` (includes `20260608200000_katakana_region.sql`)

## Phase 8 Status — N5 Vocabulary System

- [x] Migration: `vocabulary_examples`, Mount N5 region, 35 N5 words with example sentences
- [x] Curriculum: 7 vocabulary lessons + 1 mixed practice lesson across 4 units
- [x] Vocabulary lessons with examples and optional audio in the lesson player
- [x] N5 word list at `/learn/vocabulary` and word detail at `/learn/vocabulary/[wordId]`
- [x] Review queue populated after vocabulary lesson completion
- [x] Admin vocabulary form supports audio URL

Run migration: `npx supabase db push` (includes `20260608220000_n5_vocabulary_region.sql`)

## Phase 9 Status — N5 Grammar System

- [x] Migration: `grammar_examples`, 16 N5 grammar points with example sentences
- [x] Mount N5 curriculum: 4 grammar lessons + 1 mixed practice lesson
- [x] Grammar lessons with examples in teach steps and recall exercises
- [x] N5 grammar list at `/learn/grammar` and detail at `/learn/grammar/[grammarId]`
- [x] Review queue populated after grammar lesson completion

Run migration: `npx supabase db push` (includes `20260608240000_n5_grammar_region.sql`)

## Phase 10 Status — Kanji Academy

- [x] Migration: `kanji_examples`, 103 N5 kanji with readings and example words
- [x] Mount N5 curriculum: 13 kanji lessons + 1 mixed practice lesson across 5 units
- [x] Kanji lessons with readings, stroke count, and examples in teach steps
- [x] Kanji catalog at `/learn/kanji` and detail at `/learn/kanji/[kanjiId]`
- [x] Review queue populated after kanji lesson completion

Run migration: `npx supabase db push` (includes `20260608260000_n5_kanji_academy.sql`)

## Phase 11 Status — Review Engine

- [x] Migration: `review_history`, SRS interval and streak columns on `review_items`
- [x] SRS logic with mastery states (new → learning → good → strong → mastered → legendary)
- [x] Review history logged on every rating
- [x] Weak area detection grouped by content type
- [x] Review center shows queue stats, mastery badges, and recent history
- [x] `GET /api/review/stats` for mastery and weak-area summary

Run migration: `npx supabase db push` (includes `20260608280000_review_engine.sql`)

## Phase 12 Status — Reading System

- [x] Migration: `stories`, `story_sections`, `reading_questions`, `dialogue_scenarios`, `dialogue_nodes`, `dialogue_choices`, `reading_progress`
- [x] N5 seed: 3 stories with comprehension questions, 2 dialog scenarios
- [x] Reading hub at `/learn/reading` with stories and dialogs
- [x] Story reader and dialogue player with progress tracking
- [x] Mount N5 unit: Reading Comprehension (story + dialogue lessons)
- [x] `POST /api/reading/progress` for reading mastery tracking

Run migration: `npx supabase db push` (includes `20260608300000_reading_system.sql`)

## Design Reference

UI follows approved mockups in `assets/marketing/` and rules in `.cursor/rules/uiux.mdc`.