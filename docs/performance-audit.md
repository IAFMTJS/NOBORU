# Noboru Performance Audit

Date: 2026-06-21  
Targets: initial load &lt; 2s · route change &lt; 300ms · user action &lt; 100ms · Lighthouse &gt; 90

## Executive summary

Noboru already has solid foundations: curriculum caching (`lib/cache/content-cache.ts`), request-scoped dashboard dedupe (`lib/cache/dashboard-cache.ts`), camp above/below-fold split, review/analytics batch endpoints, offline sync batching, lesson audio prefetch, `WindowedList` on vocabulary/grammar, AVIF/WebP in `next.config.ts`, and Lighthouse CI.

The biggest gaps are **write-path amplification** (XP/EP per action), **missing cross-request user caches**, **unvirtualized large lists**, **live DB leaderboards**, and **no rate limiting**. Addressing P1 items should yield the largest perceived and measured wins.

---

## P1 — Critical

| # | Area | Finding | Est. gain | Prompt |
|---|------|---------|-----------|--------|
| 1 | **XP / EP writes** | ~~Per-rating DB writes~~ — `awardEpBatch` + `processReviewGamificationBatch`; review client flushes every 30s or 5 ratings (2026-06-21). | −200–500 ms per lesson session; −50–150 DB writes/session | XP System Debouncing, Database Push Queue |
| 2 | **Dashboard fan-out** | ~~Duplicate chest + quest fetches~~ — `getDashboardSnapshot`, cached quests on camp below-fold; home dashboard 16 parallel calls (was 17) (2026-06-21). | −300–800 ms TTFB on home | API Request Batching, Smart Caching |
| 3 | **User progress cache** | ~~Request-scoped only~~ — `unstable_cache` with 30s revalidate + `revalidateUserProgress` on mutations (2026-06-21). | −80–200 ms per dashboard/tree load | Smart Caching |
| 4 | **Large study lists** | ~~Kanji list rendered all entries~~ — now uses `WindowedList` (2026-06-21). Audit remaining long lists (reading, friends). | −100–400 ms scroll jank on N3+ lists | Infinite Scroll Optimalisatie |
| 5 | **Leaderboard** | `leagueService.getDashboard` runs live `listLeaderboard` DB query every load. No Redis sorted set or TTL cache. | −150–400 ms on community/leaderboard | Leaderboard Optimalisatie |
| 6 | **Rate limiting** | No per-user/IP rate limits on API routes. Risk under abuse; sync bursts unbounded. | Stability + cost control | Rate Limiting Systeem |

---

## P2 — Important

| # | Area | Finding | Est. gain | Prompt |
|---|------|---------|-----------|--------|
| 7 | **Lesson preloading** | ~~No lesson X+1 prefetch~~ — `useNextLessonPrefetch` idle-prefetches route, session API, and audio (2026-06-21). | −200–600 ms next-lesson start | Lesson Preloading |
| 8 | **Select discipline** | ~~`select("*")` on hot paths~~ — profile, settings, elevation repos use explicit columns; lesson page reads `sound_enabled` only (2026-06-21). | −20–80 ms per over-fetch | Database Query Optimisatie |
| 9 | **Elevation level-up loop** | ~~Sequential `findRewardForLevel`~~ — `listRewardsForLevelRange` single query (2026-06-21). | −50–200 ms on level-up bursts | Database Query Optimisatie |
| 10 | **Analytics batching** | Client buffers 30s / 5 events with beacon flush — verified in `analytics.service.ts`. | Already met | API Request Batching |
| 11 | **Asset pipeline** | Responsive size matrix documented in `docs/asset-delivery.md` (2026-06-21). Art Library PNG→WebP conversion remains incremental. | −0.5–3 MB initial on art-heavy routes | Asset Delivery |
| 12 | **Lighthouse coverage** | CI now audits `/camp`, `/tree`, `/review` when auth secrets set (2026-06-21). Lesson player still needs fixture lesson id. | Regression detection | Complete Performance Audit |
| 13 | **Game bundles** | All four game routes use `game-player-loaders.tsx` dynamic imports — verified. | Already met | Complete Performance Audit |

---

## P3 — Nice to have

| # | Area | Finding | Est. gain | Prompt |
|---|------|---------|-----------|--------|
| 14 | **Redis layer** | Prompts assume Redis; stack is Vercel + Supabase. Use **Vercel KV / Upstash** for leaderboard + rate limits before raw Redis. | Infra alignment | Smart Caching |
| 15 | **Middleware session** | Auth middleware runs every request — profile JWT claims work in progress. Finish claim sync to cut profile round-trips. | −20–50 ms/request | Smart Caching |
| 16 | **World tree scroll** | `WorldScreen` renders full path — acceptable at current scale; virtualize if node count grows. | Future-proofing | Infinite Scroll Optimalisatie |
| 17 | **Framer Motion tree-shake** | `optimizePackageImports` configured — good. Audit motion on list rows. | −10–30 KB | Complete Performance Audit |
| 18 | **Duplicate quest fetch** | Camp below-fold re-fetches `questService.getQuestDashboard` while above-fold uses cached version. | −50–100 ms on camp | API Request Batching |

---

## What is already working

- **Curriculum cache**: `unstable_cache` + React `cache`, 1h revalidate, tag invalidation hook
- **Camp streaming**: above-fold fast, below-fold in `Suspense`
- **Review batch RPC**: `submit_review_ratings_batch` migration + batch route
- **Offline sync**: batch mutations, concurrency limit 5, max 50 per batch
- **Lesson player**: dynamic imports for story/dialogue/listening; audio prefetch batch
- **Bundle analyzer**: `ANALYZE=true` via `@next/bundle-analyzer`
- **Dashboard dedupe**: `getDashboardSnapshot`, cached quest dashboard on camp below-fold
- **Cross-request user caches**: progress, elevation, quests, review stats (30s TTL + tag invalidation)
- **EP batching**: `awardEpBatch`, `processReviewGamificationBatch`, 30s review flush timer

---

## Recommended execution order

1. Complete Performance Audit (this document) — baseline
2. XP debouncing + write queue — highest DB load reduction
3. Smart caching — cross-request user progress + composed dashboard read
4. API batching — collapse dashboard fan-out
5. Infinite scroll — kanji + any remaining long lists
6. Leaderboard + rate limiting — before community scale
7. Lesson preloading + asset delivery — perceived speed
8. Re-run Lighthouse CI on core learning routes

---

## Exit criteria (global)

| Metric | Current (est.) | Target |
|--------|----------------|--------|
| Camp TTFB | ~400–900 ms | &lt; 400 ms |
| Lesson API calls per session | 5–15+ writes | ≤ 3 batched writes |
| Kanji list mount (N5) | All DOM nodes | ≤ 30 visible nodes |
| Leaderboard load | Live DB sort | Cached top-100, &lt; 100 ms |
| Lighthouse performance (camp) | CI-tracked | ≥ 90 |

---

## Architecture constraints (all optimizations)

- UI → Service → Repository → Database — no shortcuts
- Educational progress stays authoritative; gamification reads only
- Offline-first: buffers must flush safely on reconnect
- Cache invalidation required on progress mutations

See `docs/Performance Prompts/README.md` for per-prompt invocation and `.cursor/rules/performance-workflow.mdc` for agent workflow.
