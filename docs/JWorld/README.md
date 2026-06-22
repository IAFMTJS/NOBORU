# JWorld — JLPT Five Worlds Concept Hub

**Status:** Living brainstorm (not authoritative implementation spec)  
**Purpose:** Capture the reimagining of Noboru's progression from a single World Tree into **five separate JLPT worlds** (N5 → N1), each feeling like its own ascent.

This folder is the single source of truth for **world concept brainstorming**. Implementation docs (`jlpt-content-architecture.md`, `features/worlds/`, art direction) remain separate until concepts are promoted.

**Content reuse:** Lesson content is **kept**; the old 8-region map is **not**. Five JLPT worlds are the new setup — [08-target-structure.md](./08-target-structure.md), [07-content-reuse.md](./07-content-reuse.md).

---

## What changed

The old **World Tree** metaphor (roots → trunk → canopy → celestial crown) and its art are being retired. In their place: **five self-contained realms**, one per JLPT level, connected by torii portals and unified by the climb metaphor — without botanical tree UI language.

---

## Document index

| File | Contents |
|------|----------|
| [CHANGELOG.md](./CHANGELOG.md) | Dated brainstorm sessions — append every session |
| [01-direction.md](./01-direction.md) | Core design question, metaphor options, pre-JLPT strategy |
| [02-five-worlds.md](./02-five-worlds.md) | N5–N1 realm concepts (places, arcs, palettes, Yama beats) |
| [03-connectivity.md](./03-connectivity.md) | Internal world structure, portals, overview UI, mind map |
| [04-sparring-and-decisions.md](./04-sparring-and-decisions.md) | Debate points, open decisions, next brainstorm round |
| [05-sensory-guardians.md](./05-sensory-guardians.md) | Sensory progression, trial/guardian names, lateral mechanics |
| [06-n5-deep-dive.md](./06-n5-deep-dive.md) | N5 acts, landmarks, portal script, art mood board |
| [07-content-reuse.md](./07-content-reuse.md) | Lesson content reuse vs structure replacement |
| [08-target-structure.md](./08-target-structure.md) | Canonical five-world model (acts, zones, units) |
| [09-cms-decision.md](./09-cms-decision.md) | Option A locked — five region rows, `act_index`, migration |
| [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md) | **N5 first** — validate before N4–N1 |
| [11-n5-complete-spec.md](./11-n5-complete-spec.md) | **N5 ship spec** — units, trials, HUD, implementation DOD |
| [12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md) | **N5 layout ↔ art** — spine, coordinates, pipeline, acceptance |
| [13-n5-implementation-audit.md](./13-n5-implementation-audit.md) | **N5 implementation audit** — checklist vs code |
| [legacy-slugs.md](./legacy-slugs.md) | Old `foothills` etc. — engineers only |
| [legacy-context.md](./legacy-context.md) | Deprecated tree / eight-region model |

---

## Maintenance protocol

**Every JWorld brainstorm session must:**

1. Append a dated entry to [CHANGELOG.md](./CHANGELOG.md) summarizing what was discussed and decided.
2. Update the relevant concept files — do not leave decisions only in chat.
3. Move resolved items from **Open decisions** in `04-sparring-and-decisions.md` into the appropriate concept file.
4. Mark superseded ideas explicitly (strikethrough or `> **Superseded:**` block) rather than deleting history.

**Promotion rule:** When a concept is approved for implementation, note it in CHANGELOG and link to the target doc (e.g. art brief, `features/worlds/`, `jlpt-content-architecture.md`). Do not silently overwrite authoritative docs.

---

## Related (outside JWorld)

| Resource | Relationship |
|----------|----------------|
| `docs/Skeleton world tree.md` | Legacy tree anatomy — being replaced |
| `docs/World tree bible.md` | Legacy — reference only |
| `lib/design-system/worlds.ts` | Five-world slugs + legacy normalization |
| `art-direction/02_journey_trails_and_world_map.md` | Trail UX patterns — still valid |
| `art-direction/08_visual_art_direction_master_spec.md` | Visual law — worlds must conform |
