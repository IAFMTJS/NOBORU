# Noboru Performance Audit

Date: 2026-06-30 (re-baseline)  
Targets: initial load &lt; 2s · route change &lt; 300ms · user action &lt; 100ms · Lighthouse &gt; 90

## Executive summary

June 30 implementation pass addressed the largest remaining client and infra gaps: **Japanese fonts scoped to study routes**, **camp mount deduplication**, **world-tree backdrop lazy loading**, **distributed rate limiting (Upstash)**, **middleware JWT claim sync**, **app-shell code splitting**, and **intake list virtualization**.

Measured local prod (2026-06-30): login LCP ~4.1–4.3s, TBT 620–860ms — font scoping and camp fixes should improve camp/tree-adjacent flows; re-run Lighthouse CI after deploy.

---

## P1 — Resolved (2026-06-30)

| # | Area | Status |
|---|------|--------|
| 1 | Japanese fonts global | **Fixed** — `JapaneseFontScope` on learn/review/tree/study/trials/games/daily-challenge/onboarding only |
| 2 | Camp redundant fetches | **Fixed** — no mount refresh; debounced visibility refresh only |
| 3 | World tree assets | **Improved** — lazy silhouette; act layers mount at opacity &gt; 0.05; priority only for dominant act |
| 4 | Rate limiting scale | **Fixed** — `@upstash/ratelimit` with in-process fallback; set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in prod |
| 5 | Middleware profile DB | **Improved** — JWT claim sync on auth callback + refreshSession; metadata fallbacks; DB only when claims still missing |
| 6 | App shell client weight | **Improved** — lazy offline chrome + settings offline section |

---

## P2 — Resolved / open

| # | Area | Status |
|---|------|--------|
| 7 | Intake vocabulary list | **Fixed** — `WindowedList` |
| 8 | Dead `getHomeDashboard` | **Removed** — orchestrator + 16-call fan-out deleted |
| 9 | `force-dynamic` overuse | **Fixed** — removed from camp, shop, leaderboard, community, collections |
| 10 | Lighthouse score script | **Fixed** — `check-lighthouse-scores.mjs` handles LH12 report shape |
| 11 | Lesson Lighthouse CI | **Fixed** — auto-resolves first published lesson via `/api/learning/regions` when secret unset |
| 12 | Art responsive matrix | **Fixed** — `ArtLibraryImage` cover mode uses `next/image` + `sizes` presets per `asset-delivery.md` |

---

## What is already working

(Unchanged from prior audit — curriculum cache, EP batching, review batch, offline sync, game/lesson splits, `WindowedList` on vocab/kanji/grammar, leaderboard 45s cache, dashboard dedupe.)

---

## Exit criteria (global)

| Metric | Before (2026-06-30) | Target |
|--------|---------------------|--------|
| Camp extra API calls on mount | 2 + router.refresh | 0 ✓ |
| Noto JP on `/camp` | ~994 KB woff2 | 0 ✓ |
| Rate limit (multi-instance) | In-process only | Upstash when env set ✓ |
| Login LCP (local prod) | ~4.2s | &lt; 2.5s (auth lazy-load pass 2026-06-30 — re-measure) |
| Lighthouse performance (camp) | CI-tracked | ≥ 90 |

