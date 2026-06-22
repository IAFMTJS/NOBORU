# N5 complete spec — Realm of First Light

**Status:** **Founder signed off** — implementation sprint in progress (2026-06-22)  
**World slug:** `n5`  
**Display name:** Realm of First Light · 始まりの境

---

## Resolved decisions (Session 6)

| Question | Decision |
|----------|----------|
| Act labels in UI | **Yes** — `Act I · Awakening`, etc. |
| World names | **English realm + JP subtitle** on landmarks and portal cards |
| Absolute beginner entry | **Ember Threshold** (first node), not world picker |
| Placement skip | May unlock from **Forest Torii** (Act III entry); Acts I–II stay replayable |
| Side paths v1 | **Spine only** for ship; one optional quarter (Food Stall Row) if time allows |
| N4+ work | **Blocked** until this spec is signed off and N5 validated |

---

## World anatomy

| Act | `act_index` | Scroll share | Altitude | Emotional beat |
|-----|-------------|--------------|----------|----------------|
| **I — Awakening** | `1` | ~25% (~120vh) | Below village, enclosed glow | “I can read symbols” |
| **II — First steps** | `2` | ~35% (~170vh) | Valley floor, widest | “Japanese is usable” |
| **III — The climb begins** | `3` | ~40% (~190vh) | Slope + sky, steepest | “I’m on the mountain” |

**Total canvas target:** ~480vh minimum (largest world).

---

## Landmarks ↔ CMS spine

Landmarks pin to **unit order** after migration (all units under `region.slug = n5`). Trial nodes are separate boss kinds on the path.

| Landmark | Act | After unit (anchor) | Notes |
|----------|-----|---------------------|-------|
| **Ember Threshold** 灯の境 | I | *Start* / Base Camp | Onboarding + first hiragana |
| **Script Sanctum** 文字の社 | I | Hiragana Part I | Tablet wall environment |
| *(checkpoint)* | I | Hiragana Trail Camp 1 | Optional rest shrine — not a named landmark |
| **Kana Bridge** かな橋 | I→II | Hiragana Practice | Act I capstone; katakana begins next |
| **Act I trial** | I | — | `foothills-guardian` → **Script Keeper** (display rename) |
| **Lantern Hamlet** 灯里 | II | Katakana Part I | First vocab grammar neighborhood |
| **Market Bend** 曲がり市 | II | Numbers / early vocab unit* | Shopping, counters |
| *(checkpoint)* | II | Katakana Practice | — |
| **Act II trial** | II | — | `forest-spirit` → **Kana Warden** |
| **Forest Torii** 森の鳥居 | II→III | Last katakana / first N5 grammar unit | Particle gate |
| **Kanji Grove** 漢字の林 | III | Kanji Part I | First kanji pillars |
| **First Slope Shrine** 初坂の祠 | III | Mid listening/reading cluster | Comprehension beat |
| **Proving Ground** | III | — | `mount-n5-proving-ground` → **Trail Warden** |
| **Sentinel** | III | — | `n5-sentinel` (boss) |
| **Gate of Ascent** 登り門 | III | — | `n5-final-trial` → **Guardian of First Light** → N4 portal |

\*Exact unit name varies by seed order; pin at first unit with `Numbers`, `Greetings`, or `Family & Body` after katakana block — finalize at implementation by querying `units` where `act_index = 2` ordered by `order_index`.

### Act I — unit spine (act_index = 1)

| Order | Unit (CMS name) | Content |
|-------|-----------------|--------|
| 0 | Base Camp | Starter / orientation |
| 1 | Hiragana Part I | Vowels – S row |
| 2 | Hiragana Trail Camp 1 | Application |
| 3 | Hiragana Part II | T – W row |
| 4 | Hiragana Trail Camp 2 | Application |
| 5 | Hiragana Advanced | Dakuten, combos |
| 6 | Hiragana Trail Camp 3 | Application (if seeded) |
| 7 | Hiragana Reading | Short passages |
| 8 | Hiragana Practice | Mixed review |

### Act II — unit spine (act_index = 2)

| Order | Unit (CMS name) | Content |
|-------|-----------------|--------|
| 1+ | Katakana Part I – III | Script completion |
| — | Katakana Trail Camps | Application (if seeded) |
| — | Katakana Reading / Practice | Script capstone |
| — | Greetings, Numbers, Family, Food, Places… | Early N5 vocabulary waves |
| — | Foundations Review, Questions & Negation… | First grammar patterns |

*Act II is the densest band — hamlet side paths branch off Lantern Hamlet ↔ Market Bend only.*

### Act III — unit spine (act_index = 3)

| Order | Unit (CMS name) | Content |
|-------|-----------------|--------|
| — | Kanji Part I – IV, Kanji Practice | Kanji academy |
| — | Grammar Patterns I–IV + expansions | Full N5 grammar |
| — | Vocabulary waves 1–8 | JLPT N5 coverage |
| — | Listening / reading units | Comprehension |
| — | Trial nodes | Proving Ground → Sentinel → Final |

---

## Trial chain (content slugs unchanged)

| Order | Slug (CMS) | Display name | Act | Gate |
|-------|------------|--------------|-----|------|
| 1 | `foothills-guardian` | Script Keeper | I | Hiragana mastery |
| 2 | `forest-spirit` | Kana Warden | II | Katakana mastery |
| 3 | `mount-n5-proving-ground` | Trail Warden | III | Mixed recall |
| 4 | `n5-sentinel` | N5 Sentinel | III | Boss |
| 5 | `n5-final-trial` | Guardian of First Light | III | **World exit** → N4 |

All `region_slug` → `n5` after migration. Learner copy uses display names only.

---

## HUD & copy

| Surface | Copy |
|---------|------|
| World title | **Realm of First Light** |
| World subtitle | N5 · 始まりの境 |
| Act chip | `Act {I\|II\|III} · {Awakening\|First steps\|The climb begins}` |
| Progress | `{completed}/{total} lessons` (world-scoped, not legacy region) |
| Locked ahead | “The path continues upward” + requirement count |
| Overview (minimal v1) | N5 glows; N4–N1 misted with lock |

---

## Sensory defaults (N5 only)

| Act | Time | Weather | Dominant audio |
|-----|------|---------|----------------|
| I | Dawn | Soft mist | Stream, single bell |
| II | Morning | Clear / light mist | Village ambience, distant stream |
| III | Late morning | Sky visible, wind on slope | Wind, shrine wood |

Dark mode canonical; light = morning variant per master spec.

---

## Art — minimum shippable set

From [06-n5-deep-dive.md](./06-n5-deep-dive.md) priority list:

1. N5 realm silhouette (overview + backdrop)
2. Act I environment slice (Script Sanctum)
3. Act II slice (Lantern Hamlet + Market Bend)
4. Act III slice (First Slope + Gate of Ascent)
5. Nine landmark icons (8 + gate)
6. Portal matte N5 → N4

**Not required for N5 v1:** all three hamlet quarter backgrounds.

---

## Implementation checklist

### Data (mostly done)

- [x] Option A migration (`20260622120000_jworld_five_world_regions.sql`)
- [x] Migration applied on remote (`supabase db push` — 2026-06-22)
- [x] `units.act_index` migration + backfill (`20260622150000`)
- [x] N5 landmarks migration (`20260622140000_n5_landmarks_and_trial_copy.sql`)
- [x] Landmark triggers synced from unit spine (`20260622150000`)

### Journey / UI — complete

### Art

- [x] N5 art pack v1 constants + backdrop (interim Art Library assets)
- [x] Published WebP paths under `public/art-library/`
- [x] Greybox spine signed off — node placement locked (2026-06-22)
- [x] Generation briefs ready — [14-n5-art-generation-briefs.md](./14-n5-art-generation-briefs.md)
- [x] Bespoke act slices generated (`bg_n5_act1` … `act3` + realm silhouette)
- [x] Nine landmark icons + portal matte
- [x] Ingest → `n5-world-art.constants.ts` wired to bespoke paths

### Validation

- [x] Static implementation audit — [13-n5-implementation-audit.md](./13-n5-implementation-audit.md)
- [x] Launch criterion `n5_world` enhanced (`n5-world-launch-check.ts`)
- [ ] Full manual playthrough Act I → Final trial
- [ ] Founder N5 validated → unlock N4 spec

---

## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Founder | Siebe | 2026-06-22 | Concept approved → implementation sprint |
| Founder | | | N5 validated → start N4 |

---

## Art & node placement

Spine geometry, act bands, landmark `path_position` targets, art pipeline order, and acceptance checks: **[12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md)**.

Greybox spine signed off 2026-06-22 — **art sprint active**. Reference: `Art Library/staging/n5-greybox.png`, briefs: [14-n5-art-generation-briefs.md](./14-n5-art-generation-briefs.md).

---

## Related

- [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md)
- [06-n5-deep-dive.md](./06-n5-deep-dive.md)
- [14-n5-art-generation-briefs.md](./14-n5-art-generation-briefs.md) — copy-paste generation prompts (art sprint)
