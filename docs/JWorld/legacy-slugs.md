# Legacy region slugs → JWorld `n5`

**Status:** Migration reference (2026-06-23)

Canonical world slug for Realm of First Light is **`n5`**. Legacy CMS region slugs remain in migrations and some code paths until fully purged.

## Slug map

| Legacy slug | World slug | Act (approx.) | Normalizer |
|-------------|------------|---------------|------------|
| `foothills` | `n5` | I — Awakening | `normalizeRegionSlug()` in [`lib/design-system/worlds.ts`](../../lib/design-system/worlds.ts) |
| `forest-trail` | `n5` | II — First steps | same |
| `mount-n5` | `n5` | III — The climb begins | same |
| `n5` | `n5` | all acts | canonical |

## Code paths still referencing legacy slugs

| Area | File | Notes |
|------|------|-------|
| Trials | `features/trials/constants/trial.constants.ts` | CMS slugs unchanged (`foothills-guardian`, etc.) |
| Chests | `features/chests/services/chest.service.ts` | Region keys |
| Cinematics | `features/cinematics/constants/cinematic.constants.ts` | Scene routing |
| Journey merge | `features/journey/utils/journey-blueprint-merge.utils.ts` | Blueprint branch ids |
| Worlds tests | `features/worlds/tests/n5-world.utils.test.ts` | Display title remap |
| Design system | `lib/design-system/worlds.ts` | `LEGACY_REGION_TO_WORLD` map |

## Learner-facing copy

Use **Realm of First Light** / **N5 · 始まりの境** in UI. Do not show `foothills`, `forest-trail`, or `mount-n5` to learners.

## Purge schedule

- After founder N5 sign-off ([11-n5-complete-spec.md](./11-n5-complete-spec.md)): remove legacy thumbnail art mappings in `lib/assets/art-mappings.ts` where JWorld constants exist.
- Post-N5: rename trial `region_slug` display only; CMS slugs stay stable for data integrity.
