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

## Phase 13 Status — Listening System

- [x] Migration: `listening_exercises`, `listening_challenges`, `listening_challenge_items`, `listening_progress`
- [x] N5 seed: 4 audio lessons, 1 multi-part listening challenge
- [x] Listening hub at `/learn/listening` with exercises and challenges
- [x] Audio playback with hosted URL or browser TTS fallback
- [x] Mount N5 unit: Listening Practice (lesson + challenge types)
- [x] `POST /api/listening/progress` for listening mastery tracking

Run migration: `npx supabase db push` (includes `20260608320000_listening_system.sql`)

## Phase 14 Status — Progress Tracking

- [x] Mastery dashboard at `/progress` with overall and domain mastery
- [x] Region and unit progress breakdown with links to each trail
- [x] Learning statistics (lessons, scores, reading, listening)
- [x] Review statistics integrated from review engine
- [x] Profile stats wired to live progress data
- [x] Home dashboard link to full progress view
- [x] `GET /api/progress/dashboard` for typed progress summary

## Phase 15 Status — Elevation System

- [x] Migration: `user_elevation`, `elevation_events`, `level_rewards`
- [x] EP awarded on lesson completion, review ratings, reading, and listening
- [x] Level system (1–100) with increasing thresholds
- [x] Level rewards seeded (titles at levels 1, 2, 5, 10, 20, 50)
- [x] Elevation summary on home, progress dashboard, and profile
- [x] EP feedback on lesson complete and review submit
- [x] `GET /api/elevation/summary`

Run migration: `npx supabase db push` (includes `20260608340000_elevation_system.sql`)

## Phase 16 Status — Achievement System

- [x] Migration: `user_achievements`, `user_streaks`, MVP achievement seeds
- [x] Achievement engine with slug-based trigger evaluation
- [x] Unlock tracking with idempotent inserts and EP awards
- [x] Study streak tracking for 7-day achievement
- [x] Integration hooks on lessons, reviews, reading, and listening
- [x] Showcase on home, profile, progress dashboard, and `/achievements`
- [x] Unlock feedback on lesson complete and review submit
- [x] `GET /api/achievements`

Run migration: `npx supabase db push` (includes `20260610300000_achievement_system.sql`)

## Phase 18 Status — Daily Quest System

- [x] Migration: `quest_templates`, `user_daily_quests`, MVP daily seeds
- [x] Migration: weekly quest period, `user_weekly_quests`, MVP weekly seeds
- [x] 4 daily quests assigned per user per day (timezone-aware)
- [x] 2 weekly quests assigned per user per week (timezone-aware)
- [x] Auto-tracking for vocabulary, lessons, reviews, and EP earned
- [x] Auto-completion with EP rewards via elevation
- [x] Quest cards integrated into home expedition hero trail layout
- [x] Daily and weekly quest panels on progress dashboard
- [x] Smart deep links to next lesson and review queue
- [x] Quest completion feedback on lesson complete and review submit
- [x] `GET /api/quests` and `GET /api/quests/daily`

Run migrations: `npx supabase db push --include-all` (includes `20260610400000_daily_quest_system.sql` and `20260610500000_weekly_quest_system.sql`)

## Phase 19 Status — Yama System

- [x] Yama feature module with contextual messaging service
- [x] Yama appearances on home expedition hero with trail-aware copy
- [x] Yama loading states across app route loading boundaries
- [x] Yama encouragement during interactive drill feedback
- [x] Yama reactions on achievement and quest unlock feedback
- [x] Yama celebration on lesson complete and level-up
- [x] Yama encouragement on review ratings and empty review queue
- [x] Yama milestone hint on in-progress trail nodes

No migration required for Phase 19.

## Phase 20 Status — Offline System & PWA

- [x] Enhanced web app manifest with shortcuts and standalone display
- [x] Service worker for app shell and static asset caching
- [x] PWA install prompt on home and settings
- [x] IndexedDB caches for lessons, reviews, audio, and sync queue
- [x] Offline lesson player with queued progress mutations
- [x] Offline review session with local queue advancement
- [x] Offline audio cache for previously played lesson audio
- [x] Sync engine via `POST /api/sync/batch`
- [x] Conflict resolution with educational progress priority
- [x] Offline status banner and settings sync panel

No migration required for Phase 20.

## Phase 21 Status — N5 Trials

- [x] Migration: trial templates, steps, user progress, and attempts
- [x] Regional challenges for foothills, forest trail, and Mount N5
- [x] N5 Sentinel boss trial and Final N5 capstone trial
- [x] Timed multi-step trial player with typed, choice, and matching drills
- [x] Performance tracking with attempts, best scores, and grades
- [x] Completion rewards via elevation EP (grade-based multiplier)
- [x] Review recommendations on failure
- [x] Trial hub, region panels, and games entry point
- [x] `GET /api/trials`, `GET /api/trials/[slug]`, `POST /api/trials/[slug]/complete`

Run migration: `npx supabase db push --include-all` (includes `20260610600000_n5_trial_system.sql`)

## Phase 22 Status — N4 Expansion

- [x] Migration: Mount N4 region with N4 vocabulary, grammar, and kanji seeds
- [x] Five curriculum units with trail lessons and mixed practice check
- [x] JLPT-aware vocabulary, grammar, and kanji hubs (`?jlpt=n4`)
- [x] Mount N4 region page with content quick links
- [x] Dashboard region labels for Mount N4 ascent trail

Run migration: `npx supabase db push --include-all` (includes `20260610700000_n4_expansion.sql`)

### Phase 22 follow-ups

- [x] N4 reading stories, dialogues, and trail lessons
- [x] N4 listening exercises, challenge, and trail lessons
- [x] N4 Proving Ground, Keeper, and Final trials
- [x] Mount N4 region unlock after Final N5 Trial
- [x] JLPT-aware reading/listening hubs (`?jlpt=n4`)

Run migration: `npx supabase db push --include-all` (includes `20260610800000_n4_reading_listening_trials.sql`)

## Phase 23 Status — Performance Hardening

- [x] Vitest test runner with unit tests for region unlock, trail state, trials, audio prefetch, analytics validation
- [x] CI test step and Lighthouse score floors (90+) on public routes
- [x] Lesson player bundle split for celebration/feedback modules
- [x] Lesson audio prefetch pipeline via IndexedDB cache
- [x] PWA service worker v2 with runtime audio stale-while-revalidate
- [x] Product analytics pipeline (`POST /api/analytics/events`) with lesson and PWA events
- [x] Accessibility hardening: `lang="ja"` on Japanese text, reduced-motion skeleton pulses
- [x] Security hardening: admin route guard in middleware, frame/options headers
- [x] Next.js config tuning (`poweredByHeader`, AVIF/WebP images, package import optimization)

## Phase 24 Status — Public Beta

- [x] Beta release flagging via `NEXT_PUBLIC_BETA_MODE` and version label
- [x] In-app beta banner with feedback shortcut
- [x] Feedback collection module (`POST /api/feedback`) with categories for trail, lesson, audio, PWA, and content
- [x] Settings and community beta CTAs to `/feedback`
- [x] Post-lesson feedback prompt on completion
- [x] Admin feedback inbox at `/admin/content/feedback`
- [x] Curriculum polish for Mount N5/N4 region descriptions
- [x] Bug fix: region-aware JLPT level in embedded story/dialogue/listening lesson steps
- [x] Trail map accessibility labels on lesson nodes
- [x] Analytics event `feedback_submitted`
- [x] Unit tests for feedback validation and region JLPT mapping

Run migration: `npx supabase db push --include-all` (includes `20260610900000_beta_feedback_system.sql`)

## Phase 25 Status — Official Launch

- [x] Official release configuration (`NEXT_PUBLIC_APP_VERSION=1.0.0`, beta opt-in via `NEXT_PUBLIC_BETA_MODE=true`)
- [x] Public health endpoint (`GET /api/health`) for monitoring and deploy smoke checks
- [x] Admin launch readiness dashboard with MVP criteria checklist
- [x] Persisted product analytics (`analytics_events` table + admin 7-day summary)
- [x] Analytics instrumentation for review submit, trial complete, and trail continue clicks
- [x] Production metadata: Open Graph, sitemap, robots.txt, manifest, and settings About section
- [x] Auth protection for `/feedback`
- [x] Unit tests for launch readiness and release channel

Run migration: `npx supabase db push --include-all` (includes `20260611000000_official_launch_analytics.sql`)

## Phase 17 Status — Immersive Learning & Trail Experience

- [x] Visual trail map with locked, available, in-progress, and completed nodes
- [x] Trail map on `/learn`, region pages, and home expedition hero
- [x] Expedition-oriented home layout with primary continue-climbing CTA
- [x] Typed recall drills for hiragana, katakana, vocabulary, and kanji
- [x] Matching drill for multi-item lessons
- [x] Immediate drill feedback with step-level lesson progress
- [x] Audio playback in teach steps (respects user `sound_enabled`)
- [x] Ruby/furigana presentation for vocabulary and examples

## Design Reference

UI follows approved mockups in `assets/marketing/` and rules in `.cursor/rules/uiux.mdc`.