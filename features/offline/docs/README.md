# Offline System & PWA

Purpose: Offline-first core learning with installable PWA delivery and background sync.

## Responsibilities

- Cache lesson sessions, review bundles, and audio in IndexedDB
- Queue offline mutations for lesson start, lesson complete, and review submit
- Sync queued mutations through `POST /api/sync/batch` with conflict resolution
- Register a service worker for app shell and static asset caching
- Surface install prompt, offline status, manual sync, and offline preparation controls

## IndexedDB Stores

| Store | Contents |
|-------|----------|
| `lessons` | Cached `LessonSessionViewModel` by lesson ID |
| `review_bundles` | Review session + due card queue |
| `sync_queue` | Pending offline mutations |
| `audio` | Cached lesson audio blobs |
| `meta` | Last sync timestamp |

## Client Services

- `features/offline/services/offline-client.service.ts` — browser facade for cache, queue, sync
- `features/offline/services/offline-prefetch.service.ts` — explicit “Prepare for offline” batch cache
- `features/offline/services/sync-server.service.ts` — server-side batch replay

## API

- `GET /api/learning/regions` — learning path used for offline lesson prefetch
- `GET /api/review/session` — review bundle for offline caching
- `POST /api/review/submit/batch` — buffered online review ratings (every 5 cards or session end)
- `POST /api/sync/batch` — apply queued offline mutations
- `POST /api/admin/maintenance/archive` — move stale events to archive tables (content admin)

## Conflict Resolution

Educational progress is authoritative (`lib/offline/conflict-resolver.ts`):

- Duplicate lesson completions defer to existing server completion
- Review submissions replay through the SRS service on sync

## UI

- `OfflineProvider` — service worker registration, update banner, status banner, auto-sync on reconnect
- `PwaInstallPrompt` — journey (`/tree`) and settings install CTA
- `OfflineSyncPanel` — settings sync status, manual sync, prepare-for-offline action

## PWA Assets

- Manifest: `public/manifest.json` (`start_url`: `/tree`)
- Service worker: `public/sw.js`
- Icons and iOS splash screens: `public/icons/` (build via `npm run pwa:icons`)
- Validation: `npm run pwa:validate`

Navigation shell HTML is cached on visit (network-first). Do not precache authenticated routes at service worker install time.

## Known Limitations

- Camp dashboard is not fully cached offline (lessons/reviews are)
- Gamification replay after offline sync may award deferred EP/achievements on reconnect only
- Background Sync API is registered when supported; iOS Safari relies on reconnect, manual sync, or reopening the standalone app
- Offline preparation caches the next three incomplete lessons plus the current review bundle
- JWT `is_content_admin` claims sync when `SUPABASE_SERVICE_ROLE_KEY` is configured (users may need a token refresh)
