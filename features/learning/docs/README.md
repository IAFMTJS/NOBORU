# Learning Feature

## Purpose

Home dashboard, learning paths, lesson delivery, and progress tracking.

## Responsibilities

- Home dashboard via `dashboard-server.service.ts` (orchestrated in `lib/orchestration/home.orchestrator.ts`)
- Learning path via `learning-path.service.ts` (orchestrated in `lib/orchestration/learn.orchestrator.ts`)
- Lesson assembly and player steps via `lesson.service.ts`
- Progress persistence via `progress.service.ts` and `user_progress` table

## Routes

- `/learn` — region and unit overview
- `/learn/[regionSlug]` — lessons in a region
- `/learn/lesson/[lessonId]` — interactive lesson player

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
- Trail art assets use icon states; custom node art deferred to asset pipeline
- Global recall distractor pool not yet implemented
