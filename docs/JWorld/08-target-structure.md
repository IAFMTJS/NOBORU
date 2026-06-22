# Target structure — five worlds (new setup)

**Status:** Session 4 direction (2026-06-22)  
**Supersedes:** Treating `foothills` / `forest-trail` / `mount-n5` as the **conceptual** model for JWorld.

JWorld brainstorm docs use **world-native language only**. Legacy slugs are implementation debt — documented in [legacy-slugs.md](./legacy-slugs.md), not repeated in concept work.

---

## The new model

```
Noboru ascent
└── World (JLPT level)     ← 5 total: n5, n4, n3, n2, n1
    └── Act / zone         ← vertical chapters inside a world (e.g. N5 Act I–III)
        └── Unit / branch  ← thematic curriculum branch (greetings, numbers, hiragana block…)
            └── Lesson     ← mini chapter (reused content)
                └── Trial  ← boss gate (world exit trial at peak)
```

| Layer | Learner sees | Example (N5) |
|-------|--------------|----------------|
| **World** | Realm name | Realm of First Light · N5 |
| **Act** | Chapter on HUD | Act II · First steps |
| **Zone / landmark** | Place on trail | Lantern Hamlet, Market Bend |
| **Unit** | Topic branch (optional label) | Greetings, Hiragana I |
| **Lesson** | Node on path | Lesson 14 · Counters |

**One world per JLPT level.** No separate “Foothills world” or “Forest Trail world.”

---

## Five worlds (canonical)

| World ID | Realm name (working) | Curriculum scope |
|----------|----------------------|------------------|
| `n5` | Realm of First Light | Scripts + full N5 |
| `n4` | Realm of the Green Ascent | N4 |
| `n3` | Realm of the Cloudline | N3 |
| `n2` | Realm of the Sky Temple | N2 |
| `n1` | Realm of the Celestial Summit | N1 + mastery epilogue (TBD) |

Routes (target): `/worlds/n5`, `/worlds/n4`, … — not `/learn/foothills`.

---

## N5 internal structure (no legacy region names)

| Act | Zones on trail | Curriculum focus |
|-----|----------------|------------------|
| **I — Awakening** | Ember Threshold → Script Sanctum → Kana Bridge | Hiragana, katakana |
| **II — First steps** | Lantern Hamlet → Market Bend → (hamlet side paths) | Survival vocab, daily life, first grammar |
| **III — The climb begins** | Forest Torii → Kanji Grove → First Slope Shrine → Gate of Ascent | Kanji, listening, reading, N5 trial |

Acts are **vertical chapters** inside the N5 canvas — not separate CMS “regions” in the new model.

---

## What we reuse vs replace

| Reuse (keep) | Replace (new setup) |
|--------------|---------------------|
| Lesson records (types, exercises, order within topic) | 8-region map (`foothills` … `master-summit`) |
| Vocabulary, kanji, grammar, listening, reading rows | World Tree zones (`deep_roots`, `n5_roots`, …) |
| Trial **content** and pass logic | Learner-facing “Foothills” / “Forest Trail” naming |
| User progress keyed by `lesson_id` | Narrative 4-arc model tied to old region slugs |
| Pedagogy rules in `lib/learning/` | `/tree` as primary progression metaphor |

**Migration (implementation, later):** re-home lessons under `world_id = n5` (or single `regions.slug = n5`) with units = acts/branches. Lesson IDs stable; `region_id` / grouping fields updated. See [legacy-slugs.md](./legacy-slugs.md).

---

## CMS shape (target — brainstorm level)

Two viable implementation paths:

### Option A — Five region rows (simplest DB fit)

- `regions.slug` ∈ `n5`, `n4`, `n3`, `n2`, `n1`
- Units = thematic branches inside each world
- Acts = UI grouping over unit ranges (or `act_index` on units)

### Option B — `world` column + flexible grouping

- Add `jlpt_world` / `world_id` on `units` or `regions`
- Collapse display to five worlds while migration runs

**JWorld does not pick A vs B yet** — both satisfy “five worlds, new setup.” Founder picks at implementation time.

> **Update (Session 5):** **Option A decided.** See [09-cms-decision.md](./09-cms-decision.md). Migration + code landed.

---

## JWorld doc rule (going forward)

- **Do** name acts, zones, landmarks, realms.
- **Do** say “reuse lesson content.”
- **Don’t** use `foothills`, `forest-trail`, `mount-n5` in concept docs except [legacy-slugs.md](./legacy-slugs.md).
- **Don’t** imply the old 8-region journey is the target UX.
