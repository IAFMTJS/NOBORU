# Legacy slugs — implementation only (not JWorld vocabulary)

**For:** Engineers migrating CMS + code. **Not** for brainstorm or art briefs.

The old setup used **8 region slugs** baked into the database, migrations, and TypeScript. Learners were never meant to live in this model long term — JWorld replaces it with **5 worlds**.

---

## Why docs mentioned foothills / forest trail

Those names are **not** the new world concept. They appeared in JWorld session 1–3 as a **reuse shortcut** (“which existing lesson bucket maps where”). That was misleading for a greenfield setup.

**Today they are hardcoded** in:

| Layer | Examples |
|-------|----------|
| **Postgres** | `regions.slug`, migrations seeding hiragana/katakana/N5 into `foothills`, `forest-trail`, `mount-n5` |
| **TypeScript** | `lib/design-system/regions.ts`, `REGION_SLOT_TARGETS`, onboarding default `foothills`, launch criteria |
| **Blueprint** | `features/journey/data/world-tree-curriculum-blueprint.ts` |
| **Narrative** | `lib/design-system/narrative-regions.ts` (4 arcs × 8 slugs) |

Lesson **content** lives under those region FKs today. The **names and split** are legacy.

---

## Old slug → new world (migration map)

| Legacy `region.slug` | Target world | N5 act (if applicable) |
|----------------------|--------------|-------------------------|
| `foothills` | `n5` | Act I — Awakening |
| `forest-trail` | `n5` | Act II — First steps |
| `mount-n5` | `n5` | Act III — The climb begins |
| `mount-n4` | `n4` | — |
| `mount-n3` | `n3` | — |
| `mount-n2` | `n2` | — |
| `mount-n1` | `n1` | — |
| `master-summit` | `n1` (epilogue) | — |

After migration, admin and analytics may retain a `legacy_region_slug` column for one release if needed — not shown to learners.

---

## Legacy trial slugs (content kept, names may change)

| Legacy slug | Target |
|-------------|--------|
| `foothills-guardian` | N5 Act I trial (rename display only) |
| `forest-trail` trial | N5 Act II trial |
| `mount-n5-proving-ground` | N5 Act III checkpoint |
| `n5-final-trial` | Gate of Ascent → N4 portal |

---

## Code cleanup scope (implementation — not brainstorm)

When the new setup ships:

1. Replace `REGION_SLUGS` eight-pack with five-world catalog (+ optional internal IDs).
2. Point `N5_WORLD.regionSlugs` (or equivalent) at `n5` only.
3. Remove or archive `world-tree-curriculum-blueprint` zone IDs (`deep_roots`, etc.).
4. Update launch criteria from `foothills` / `forest_trail` to `n5` world completion.
5. Migration: `UPDATE units SET region_id = …` where lessons move under `n5` region row.

**Lesson rows and vocabulary links stay.** Only grouping and display change.
