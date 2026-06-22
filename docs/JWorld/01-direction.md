# Direction — Unifying metaphor & pre-JLPT

## The core design question

**What is the unifying metaphor if not a tree?**

| Direction | One-liner | Strength | Risk |
|-----------|-----------|----------|------|
| **A. One sacred mountain, five altitude bands** | Same peak, different elevations | Clear ascent; matches “Noboru” | Can feel like one world with skins |
| **B. Five linked realms** | Distinct places joined by spirit gates | Strong identity per JLPT | Needs glue so it doesn’t feel like five apps |
| **C. The Kitsune’s pilgrimage** | Yama leads you through mythological Japan | Companion-driven, emotional | Can get narrative-heavy |
| **D. Five trials of mastery** | Each level is a proving ground for a skill layer | Pedagogy-aligned | Less “explore a world,” more “exam dungeon” |

### Session 1 recommendation (pending founder approval)

**A + B hybrid** — one mythological Japan, five **distinct realms** at increasing altitude, connected by **torii portals** (not tree branches). Ascent is geographic *and* spiritual.

---

## What we're leaving behind

- Single World Tree scroll (roots / trunk / canopy / crown anatomy)
- Botanical zone names in learner-facing copy (Deep Roots, Trunk Ring, Canopy, etc.)
- Tree hero band art (`wt_jlpt_n5` … `wt_jlpt_n1` composition as one vertical tree)

Trail UX patterns from art direction (lantern paths, fog on locked content, landmark nodes, boss gates) **remain valid** — only the macro metaphor changes.

---

## Pre-JLPT content (Foothills, Forest Trail, hiragana/katakana)

Legacy architecture placed script learning *before* Mount N5. With one world per JLPT level:

| Option | Description | Session 1 lean |
|--------|-------------|----------------|
| **1. Fold into N5** | Script Sanctum → surface village → first slope. Hiragana/katakana = threshold, not separate world | **Preferred** |
| **2. Prologue only** | Short onboarding realm, then N5 proper. Not a sixth world | Viable for onboarding UX |
| **3. Script Sanctum inside N5** | Mini-realm / tutorial dungeon within N5 | Compatible with option 1 |

**Rationale for fold-into-N5:** N5 should feel like *beginning the climb*, not “the easy world you rush through.” Script mastery = lighting the first lanterns on the path.

---

## Ascent inside each world (not just between worlds)

Each JLPT world needs its **own vertical journey** — otherwise it’s a flat menu.

### Internal structure template (repeat per world)

```
Entry Gate (portal from previous world)
    ↓
Threshold Zone — “you’ve arrived”
    ↓
Trail Ring 1 — core curriculum
    ↓
Landmark (shrine / village / overlook)
    ↓
Trail Ring 2 — deeper content
    ↓
Side paths — review caves, events, optional depth
    ↓
Trial Gate — boss / JLPT trial
    ↓
Summit of this world — portal to next realm
```

**Between-world feeling:** You don’t finish N5 and “go to N4.” You **summit N5’s realm** and step through a gate into a **higher, stranger** place.
