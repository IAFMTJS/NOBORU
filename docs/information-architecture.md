# Noboru Information Architecture

Version: 1.0

Status: AUTHORITATIVE

This document defines application structure, navigation, routing, and content hierarchy for Noboru.

**Related documents:** [uiux.mdc](../.cursor/rules/uiux.mdc), [prd.md](./prd.md), [admin-panel-spec.md](./admin-panel-spec.md), [jlpt-content-architecture.md](./jlpt-content-architecture.md)

---

## IA Principles

From [uiux.mdc](../.cursor/rules/uiux.mdc):

- Navigation must be **simple** — no deep nesting, no hidden critical features
- Maximum **6 primary navigation items**
- Admin is **separate** from learner navigation
- Every screen answers within 3 seconds: where, what, why, progress

---

## Application Structure

```
Noboru
├── Public (unauthenticated)
│   ├── Landing
│   ├── Login
│   └── Register
├── Learner App (authenticated)
│   ├── Home
│   ├── Learn
│   ├── Review
│   ├── Games
│   ├── Community
│   ├── Profile
│   └── Settings
└── Admin (role-gated, separate shell)
    ├── Dashboard
    ├── Content Management
    ├── User Management
    ├── Asset Management
    └── System Configuration
```

---

## Primary Navigation (Immersive 5-Tab Bottom Nav)

From [immersive-navigation-system.md](./immersive-navigation-system.md):

| Tab | Purpose | Primary Content |
|-----|---------|-----------------|
| **Camp** | Player headquarters | Daily goals, streak, continue learning, quests, Yama updates |
| **Journey** | Main progression | World path, lessons, checkpoints, region progression |
| **Dojo** | Training Grounds | Kana, vocabulary, grammar, listening, review queue, weakness drills |
| **World** | Discovery | Regions, lore, trials, games, community, collectibles, achievements |
| **Profile** | Player identity | Stats, achievements, customization, settings entry |

Settings is accessed from Profile — not a sixth tab.

Legacy routes `/home` and `/explore` redirect to `/camp` and `/world`.

---

## Route Map

### Current Implementation (`/app`)

| Route | Layout Group | Auth | Description |
|-------|--------------|------|-------------|
| `/` | root | Public | Landing / redirect |
| `/login` | `(auth)` | Public | Email login |
| `/register` | `(auth)` | Public | Email registration |
| `/` | root | Public | Landing / redirect to Camp |
| `/camp` | `(app)` | Protected | Camp headquarters (daily dashboard) |
| `/home` | `(app)` | Protected | Redirect → `/camp` |
| `/learn` | `(app)` | Protected | Journey path hub |
| `/dojo` | `(app)` | Protected | Training Grounds hub |
| `/review` | `(app)` | Protected | Review session (Dojo child) |
| `/world` | `(app)` | Protected | World discovery hub |
| `/explore` | `(app)` | Protected | Redirect → `/world` |
| `/games` | `(app)` | Protected | Game center |
| `/community` | `(app)` | Protected | Community hub (placeholder MVP) |
| `/profile` | `(app)` | Protected | User profile |
| `/settings` | `(app)` | Protected | App settings |

### Planned Learner Routes (Nested)

| Route | Parent | Description |
|-------|--------|-------------|
| `/learn/[regionId]` | Learn | Region detail |
| `/learn/[regionId]/[unitId]` | Learn | Unit detail |
| `/learn/[regionId]/[unitId]/[lessonId]` | Learn | Lesson player |
| `/learn/vocabulary/[wordId]` | Learn | Vocabulary detail |
| `/learn/kanji/[kanjiId]` | Learn | Kanji detail |
| `/learn/grammar/[grammarId]` | Learn | Grammar detail |
| `/review/session` | Review | Active review session |
| `/games/[gameId]` | Games | Game play screen |
| `/profile/achievements` | Profile | Achievement gallery |
| `/onboarding` | `(auth)` or `(app)` | 7-step onboarding flow |

### Admin Routes (Separate Shell)

From [admin-panel-spec.md](./admin-panel-spec.md) and [uiux.mdc](../.cursor/rules/uiux.mdc):

| Route | Access | Description |
|-------|--------|-------------|
| `/admin` | Admin roles | Dashboard |
| `/admin/content/vocabulary` | Content Manager+ | Vocabulary CRUD |
| `/admin/content/kanji` | Content Manager+ | Kanji CRUD |
| `/admin/content/grammar` | Content Manager+ | Grammar CRUD |
| `/admin/content/lessons` | Curriculum Manager+ | Lesson assembly |
| `/admin/content/regions` | Curriculum Manager+ | Region/unit structure |
| `/admin/users` | Moderator+ | User search and moderation |
| `/admin/achievements` | Administrator+ | Achievement management |
| `/admin/quests` | Administrator+ | Quest templates |
| `/admin/assets` | Asset Manager+ | Asset upload and approval |
| `/admin/analytics` | Analytics Manager+ | Usage dashboards |

**Rule:** Admin must never appear in learner bottom navigation.

---

## Layout Architecture

```
app/
├── layout.tsx              # Root: theme, fonts, providers
├── page.tsx                # Landing
├── (auth)/
│   ├── layout.tsx          # Minimal auth shell
│   ├── login/page.tsx
│   └── register/page.tsx
├── (app)/
│   ├── layout.tsx          # Bottom nav + app shell
│   ├── home/page.tsx
│   ├── learn/page.tsx
│   ├── review/page.tsx
│   ├── games/page.tsx
│   ├── community/page.tsx
│   ├── profile/page.tsx
│   └── settings/page.tsx
└── admin/                  # Separate admin layout (future)
    └── ...
```

Middleware (`middleware.ts`) refreshes Supabase session on protected routes.

---

## Content Hierarchy

From [jlpt-content-architecture.md](./jlpt-content-architecture.md):

```
JLPT Level (N5 → N1)
└── Region (e.g., Foothills, Mount N5)
    └── Unit (thematic group)
        └── Lesson (atomic learning session)
            └── Steps (intro, teach, practice, recognition, recall, review, complete)
                └── Content Items (vocabulary, kanji, grammar references)
```

### Content Ownership

| Domain | Owns | Does Not Own |
|--------|------|--------------|
| Vocabulary | Word data, audio, examples | Lesson structure |
| Kanji | Character data, readings, strokes | Lesson structure |
| Grammar | Rules, examples, exercises | Lesson structure |
| Lessons | Assembly, sequencing, dependencies | Raw content definitions |
| Regions | Progression map, atmosphere | Individual word definitions |

Educational content is sacred — never hardcoded in UI. See [architecture.mdc](../.cursor/rules/architecture.mdc).

---

## Feature Module Mapping

Each tab maps to feature modules under `/features`:

| Tab / Area | Feature Module |
|------------|----------------|
| Authentication | `features/authentication/` |
| Onboarding | `features/authentication/` or dedicated onboarding |
| Home | `features/learning/` (dashboard) |
| Learn | `features/learning/`, `features/vocabulary/`, `features/kanji/`, `features/grammar/` |
| Review | `features/review/` |
| Games | `features/games/` |
| Community | `features/community/` |
| Profile | `features/profile/` |
| Settings | `features/settings/` |
| Admin | `features/admin/` |

Each feature follows:

```
features/feature-name/
├── components/
├── hooks/
├── services/
├── repositories/
├── types/
├── constants/
├── utils/
├── tests/
└── docs/
```

---

## Navigation State Rules

### Active Tab Indication

- Bottom nav highlights current tab
- Nested routes keep parent tab active (e.g., `/learn/foothills` → Learn tab active)

### Back Navigation

- Lesson player: back confirms exit with progress saved
- Review session: back confirms abandon with partial save
- Settings: standard back to Profile

### Deep Linking

- `/learn/[regionId]/[unitId]/[lessonId]` — shareable lesson links (authenticated)
- `/review/session` — direct review start
- Admin routes require role verification server-side

---

## Search and Discovery (Future)

Post-MVP information discovery:

- Global search across vocabulary, kanji, grammar
- Weak area quick links from Home and Review
- Recommended next lesson algorithm

---

## PWA Entry

From `public/manifest.json`:

- `start_url`: `/home`
- `display`: `standalone`
- Icons reference [asset-registry.md](./asset-registry.md)

---

## IA Success Criteria

A new developer or designer should be able to:

1. Locate any screen within 2 navigation levels
2. Understand which feature module owns a route
3. Distinguish learner vs admin surfaces instantly
4. Trace content from region down to individual vocabulary item

---

END OF information-architecture.md
