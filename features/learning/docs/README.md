# Learning Feature

## Purpose

Home dashboard, learning paths, lesson delivery, and progress tracking.

## Learning Architecture

Authoritative pedagogy spec: `docs/NOBORU LEARNING ARCHITECTURE BIBLE.md`

Shared runtime rules: `lib/learning/` (constants, golden content validator, active vocabulary pool, session mixer, lifecycle mapping)

- **Player knowledge** — `player-knowledge.service.ts` builds `PlayerKnowledgeContext` (known/weak/mastered vocabulary, active pool, unlocked branches/chapters)
- **Grammar caps** — `capNewGrammarInLessonContents` per JLPT mini chapter
- **Story assembly** — reading stories annotated via `assembleStoryForPlayer` (golden rule + highlights)
- **Mastery tracking** — `user_content_mastery` table + `content-mastery.service.ts` (15+ correct rule)

- **Golden Content Rule** — no activity may use vocabulary not yet introduced; validate via `validateGoldenContentRule`
- **Active Vocabulary Pool** — current + previous chapter + recently learned + scheduled review
- **Session mix** — ~70% review / 30% new via `mixSessionItems`
- **World Tree mapping** — region→JLPT, `learning_branches`→branch (unit alias), lesson→mini chapter, practice lesson→checkpoint, trial→boss

## Responsibilities

- Home dashboard via `dashboard-server.service.ts` (orchestrated in `lib/orchestration/home.orchestrator.ts`)
- Learning path via `learning-path.service.ts` (orchestrated in `lib/orchestration/learn.orchestrator.ts`)
- Lesson assembly and player steps via `lesson.service.ts`
- Progress persistence via `progress.service.ts` and `user_progress` table

## Routes

- `/learn` — path-first journey map (primary Learn experience)
- `/learn/world` — spatial mountain world overview
- `/learn/[regionSlug]` — redirects to `/learn?region=slug`
- `/learn/lesson/[lessonId]` — interactive lesson player

## Journey System

Authoritative spec: `docs/world-map-learning-journey-system.md`

- **Journey domain** — `journey.service.ts` builds ordered nodes with path positions, landmarks, and server-side lesson gating
- **Profile sync** — `syncCurrentRegionToProfile()` updates `current_region_slug` after lesson completion
- **Path contract** — `lib/design-system/journey-path-contracts.json` (authoritative spine; art follows path)
- **Scroll art** — v3 path-aligned scrolls per region (`npm run assets:journey-path-scrolls`)
- **Legacy anchors** — `trail-path-anchors.json` deprecated for journey; retained for art dimensions and build scripts
- **World map** — `features/world-map/` spatial mountain overview fed by `JourneyPathViewModel`
- **Home preview** — `JourneyPreviewMap` on expedition hero (journey nodes, not artwork anchors)
- **Shared trail UI** — `components/trail/` markers, sheets, and elevation indicator reused by journey screens

## Dependencies

- Profile and settings for personalized dashboard
- Published CMS content (regions, units, lessons, lesson items)

## Phase 17 — Immersive Learning

- Visual trail map on `/learn`, region pages, and home expedition hero
- Typed recall drills for hiragana, katakana, vocabulary, and kanji
- Matching drill for multi-item lessons
- Lesson audio playback (hosted audio or TTS fallback) respecting `sound_enabled`
- Ruby/furigana presentation via `JapaneseText` component

## Phase 22 — N4 Expansion

- Mount N4 region with vocabulary, grammar, kanji units, and trail lessons
- JLPT-aware vocabulary, grammar, kanji, reading, and listening hubs (`?jlpt=n4`)
- Mount N4 region page with content quick links
- N4 reading/listening curriculum units and comprehension content
- N4 trials: Proving Ground, Keeper, and Final capstone
- Mount N4 unlocks after passing Final N5 Trial

## Phase 23 — Performance Hardening

- Vitest unit tests for hot-path utilities and analytics validation
- Lesson audio prefetch and deferred celebration bundles in the lesson player
- PWA cache v2 and Lighthouse score gates in CI
- Analytics ingest API and core learning/PWA event instrumentation
- Accessibility and security hardening for production surfaces

## Known Limitations

- Ordering, tap-to-build, and fill-in-blank drill types deferred
- Region artwork follows path geometry; full per-segment art pipeline deferred
- Landmarks use label cycle constants; CMS-backed landmark metadata deferred
- Global recall distractor pool uses prioritized learned vocabulary; CMS distractor metadata deferred
