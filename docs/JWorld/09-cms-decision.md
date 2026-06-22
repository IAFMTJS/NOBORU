# CMS decision — Option A (locked)

**Status:** DECIDED (2026-06-22)  
**Chosen:** **Option A — five `regions` rows, one per JLPT world**

Option B (`world_id` column without collapsing regions) was rejected — unnecessary indirection when `regions.slug` can equal world id.

---

## Schema

### `regions` (five published worlds)

| `slug` | `name` (learner-facing, working) | `order_index` | `unlock_requirement` |
|--------|----------------------------------|---------------|----------------------|
| `n5` | Realm of First Light | 0 | — |
| `n4` | Realm of the Green Ascent | 1 | `n5-final-trial` |
| `n3` | Realm of the Cloudline | 2 | `n4-final-trial` |
| `n2` | Realm of the Sky Temple | 3 | `n3-final-trial` |
| `n1` | Realm of the Celestial Summit | 4 | `n2-final-trial` |

`master-summit` content merges under `n1` at migration; slug archived.

### `units.act_index` (new column)

| Column | Type | Purpose |
|--------|------|---------|
| `act_index` | `smallint` null | Vertical chapter inside a world (N5: 1 = Awakening, 2 = First steps, 3 = Climb begins) |

Nullable for N4+ until acts are defined. N5 units get `1`, `2`, or `3` from migration based on source legacy region.

### Unchanged

- `lessons` → `unit_id` (lesson rows untouched)
- All vocabulary, kanji, grammar, listening, reading tables
- `trial_templates` content — `region_slug` updated to world slug

---

## Migration summary

Migration: `supabase/migrations/20260622120000_jworld_five_world_regions.sql`

1. Add `units.act_index`
2. Insert `n5` region; move units from `foothills`, `forest-trail`, `mount-n5` into `n5` with `act_index` 1/2/3; renumber `order_index`
3. Rename `mount-n4` → `n4`, `mount-n3` → `n3`, `mount-n2` → `n2`, `mount-n1` → `n1` (slug + display name)
4. Merge `master-summit` units into `n1`; archive legacy region rows
5. Update `trial_templates.region_slug`, `learning_branches.region_id`, `collectible_definitions.region_slug`
6. Remap `profiles.current_region_slug` via legacy alias table
7. Default new profiles to `n5`

---

## Code

| Module | Change |
|--------|--------|
| `lib/design-system/worlds.ts` | Canonical world slugs, N5 acts, `normalizeRegionSlug()` |
| `lib/design-system/regions.ts` | `REGION_SLUGS` = five worlds; legacy alias export |
| `lib/learning/region-unlock.ts` | Prerequisites keyed on `n4`, `n3`, … |
| `lib/learning/region-jlpt.ts` | World slug ≡ JLPT level |
| Onboarding / launch | Start at `n5`, completion = world not foothills |

---

## Learner experience

- Journey HUD shows **world name** + optional **Act** (N5 only for MVP)
- No learner-facing “Foothills” or “Forest Trail”
- Admin may show `act_index` on units for CMS sorting

---

## Related

- [08-target-structure.md](./08-target-structure.md)
- [legacy-slugs.md](./legacy-slugs.md) — migration map (historical)
