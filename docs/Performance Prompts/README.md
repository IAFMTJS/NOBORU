# Performance Prompts

Agent prompts for Noboru performance work. Output of the baseline audit lives in [`docs/performance-audit.md`](../performance-audit.md).

## Execution order

Run prompts in this sequence unless scoped to a single domain:

1. **Complete Performance Audit** — baseline and priorities
2. **Database Query Optimisatie** — indexes, N+1, heavy queries
3. **API Request Batching** — collapse waterfalls
4. **XP System Debouncing** + **Database Push Queue** — write path
5. **Smart Caching** — memory, KV, CDN layers
6. **Infinite Scroll Optimalisatie** — virtualize long lists
7. **Lesson Preloading** — next lesson, audio, images
8. **Leaderboard Optimalisatie** — async ranking
9. **Rate Limiting Systeem** — abuse protection
10. **Asset Delivery** — WebP/AVIF, compression

## Prompt index

| File | Domain |
|------|--------|
| `Complete Performance Audit.md` | Full-stack audit, P1/P2/P3 |
| `Database Query Optimisatie.md` | Queries, indexes, N+1 |
| `API Request Batching.md` | Batch endpoints, fewer round trips |
| `XP System Debouncing.md` | EP buffer, optimistic UI |
| `Database Push Queue.md` | Write queue, workers, DLQ |
| `Smart Caching.md` | Multi-layer cache + invalidation |
| `Lesson Preloading.md` | X+1 prefetch, idle time |
| `Infinite Scroll Optimalisatie.md` | Virtualization, max 30 visible |
| `Leaderboard Optimalisatie.md` | Redis/KV sorted sets |
| `Rate Limiting Systeem.md` | Per-user/IP limits |
| `Asset Delivery.md` | Image formats, CDN |

## Rules for every prompt

- Follow `architecture.mdc`: UI → Service → Repository → Database
- Respect `performance.mdc` targets (2s / 300ms / 100ms / Lighthouse 90)
- Educational progress is authoritative; gamification reads only
- Prefer **Vercel KV / Upstash** over self-hosted Redis on Vercel
- Define **exit criteria** (ms saved, calls reduced) before closing work

## How to invoke

In Cursor chat:

> Run the **XP System Debouncing** performance prompt. Follow `docs/performance-audit.md` P1 #1.

Or enable the **performance-workflow** rule when working on perf-related files.

## Existing codebase hooks

| System | Location |
|--------|----------|
| Curriculum cache | `lib/cache/content-cache.ts` |
| Dashboard dedupe | `lib/cache/dashboard-cache.ts` |
| User progress (request-scoped) | `lib/cache/user-progress-cache.ts` |
| Windowed lists | `components/ui/windowed-list.tsx` |
| Review batch | `app/api/review/submit/batch/route.ts` |
| Analytics batch | `app/api/analytics/events/batch/route.ts` |
| Offline sync batch | `features/offline/services/sync-server.service.ts` |
| Lesson audio prefetch | `lib/learning/lesson-audio-prefetch.ts` |
| Lighthouse CI | `.github/workflows/lighthouse.yml` |
