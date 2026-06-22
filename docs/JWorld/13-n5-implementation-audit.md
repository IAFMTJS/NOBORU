# N5 implementation audit

**Date:** 2026-06-22  
**Spec:** [11-n5-complete-spec.md](./11-n5-complete-spec.md)  
**Automated:** `npx vitest run features/worlds/tests/n5-implementation-audit.test.ts`

---

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Journey canvas (`/tree`) | ✅ | `N5WorldScreen` — spine, nodes, HUD, scroll |
| Act bands + HUD chip | ✅ | Backdrop slices + `resolveN5ActLabelFromPathPosition` |
| Landmarks | ✅ | CMS migration + code fallbacks + unit-trigger sync migration |
| Trial display names | ✅ | CMS update + `resolveN5TrialDisplayTitle` |
| Portal N5→N4 | ✅ | `?unlock=n4` + `N5PortalTransition` |
| World map overview | ✅ | Five realms; N4–N1 misted/locked; N5 glow when current |
| Path contract `n5` | ✅ | 8 landmark slots, 3 checkpoint slots |
| Art pack v1 (interim) | ✅ | JLPT N5 band + trail/shrine slices from Art Library |
| Launch check `n5_world` | ✅ | Region + acts + trials + landmarks |
| DB migrations applied | ⚠️ | Requires `supabase db push` on each environment |
| Full playthrough QA | ⚠️ | Manual — Act I → Guardian of First Light |
| Bespoke act environment art | ⏳ | Interim library assets; commission per [12](./12-n5-art-and-node-placement.md) |

---

## Checklist mapping (11-n5-complete-spec)

### Data

| Item | Code / migration | Status |
|------|------------------|--------|
| Option A five regions | `20260622120000_jworld_five_world_regions.sql` | ✅ file |
| `units.act_index` | Same migration + `20260622150000` backfill | ✅ file |
| N5 landmarks CMS | `20260622140000_n5_landmarks_and_trial_copy.sql` | ✅ file |
| Landmark triggers from units | `20260622150000_n5_landmark_triggers_and_act_index.sql` | ✅ file |
| Trial learner copy | `20260622140000` | ✅ file |

### Journey / UI

| Item | Location | Status |
|------|----------|--------|
| N5 canvas route | `app/(app)/tree/page.tsx` | ✅ |
| Act transitions | `n5-world-backdrop.tsx`, `n5-act.utils.ts` | ✅ |
| Landmark nodes | `journey-path.builder` + landmarks | ✅ |
| HUD | `n5-world-hud.tsx` | ✅ |
| Legacy region names purged (learner) | story/listening/dojo → Realm of First Light | ✅ |
| Portal cinematic | `n5-portal-transition.tsx` | ✅ |
| Trial renames in UI | `n5-trial-display.constants.ts` | ✅ |

### Art

| Item | Location | Status |
|------|----------|--------|
| Realm silhouette | `N5_REALM_SILHOUETTE` | ✅ interim |
| Act I–III slices | `N5_ACT_SLICE_ART` | ✅ interim |
| Portal matte | `N5_PORTAL_MATTE` | ✅ interim |
| Landmark icons (9) | `N5_LANDMARK_ICON_BASES` — wired in constants, optional node overlay v1.1 | ⚠️ partial |
| Production ingest | `public/art-library/` existing WebP | ✅ reused |

### Validation

| Item | How | Status |
|------|-----|--------|
| Static audit | `n5-implementation-audit.test.ts` | ✅ automated |
| `n5_world` launch | `lib/release/n5-world-launch-check.ts` | ✅ enhanced |
| Playthrough | Manual QA | ⚠️ pending |
| Founder N5 validated → N4 | Sign-off table in 11 | ⏳ pending |

---

## Known gaps (non-blocking for code-complete)

1. **Landmark icon sprites on canvas** — labels ship; dedicated landmark ring art is v1.1 polish.
2. **Food Stall Row side path** — explicitly out of v1 scope.
3. **Sensory audio beds** — not in this sprint (HUD/visual only).
4. **Remote DB** — run migrations after fixing any blocked historical migration.

---

## Run audit

```bash
npx vitest run features/worlds/tests/n5-implementation-audit.test.ts
npx tsc --noEmit
```

---

## Related

- [12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md)
- [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md)
