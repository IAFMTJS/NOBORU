# Content reuse — lessons yes, region model no

**Status:** Updated session 4 (2026-06-22)

---

## Two different things (don’t conflate)

| | Reuse | New setup |
|---|--------|-----------|
| **Lesson content** | Yes — exercises, word lists, grammar points, audio, trial questions | Same `lesson` bodies |
| **Region / world structure** | No — `foothills`, `forest-trail`, 8-region tree | **Five JLPT worlds** — [08-target-structure.md](./08-target-structure.md) |
| **Progress** | Yes — tied to `lesson_id` | Survives regrouping under `n5` |

**Founder intent:** Keep the **curriculum data** you already built. Replace the **journey structure and naming** with JWorld.

---

## What stays the same

| Layer | Notes |
|-------|-------|
| **Lesson records** | Types, ordering within units, XP, exercise mix |
| **Vocabulary / kanji / grammar / listening / reading** | All master content tables |
| **Trials** | Question sets and pass logic (slugs may rename — [legacy-slugs.md](./legacy-slugs.md)) |
| **Pedagogy** | `lib/learning/`, Learning Architecture Bible, golden content rule |
| **User progress** | Per-lesson completion and SRS |

---

## What the new setup replaces

- Eight CMS regions as the learner journey map
- World Tree zones and skeleton constants as concept model
- Learner-facing “Foothills”, “Forest Trail”, “Mount N5” as **separate places**
- Code paths that default new users to `foothills` slug in the UI

Target model: [08-target-structure.md](./08-target-structure.md).

---

## CMS aliases (pedagogy — still valid)

| Concept | Maps to |
|---------|---------|
| Thematic branch | `unit` |
| Mini chapter | `lesson` |
| Checkpoint | `practice_lesson` |
| Boss examination | `trial` |

**World** = JLPT level (`n5` … `n1`). **Act** = chapter inside a world (UI + unit grouping). The old rule “region = JLPT level” was already wrong for N5 (three regions for one JLPT level).

---

## Migration note (implementation later)

Lessons currently reference legacy `region_id` values. Implementation will:

1. Create or designate five world regions (`n5` … `n1`)
2. Re-assign `units` (and thus lessons) into the correct world
3. Map acts to unit ranges for layout and HUD
4. Keep `lesson_id` stable for progress

Details: [legacy-slugs.md](./legacy-slugs.md).

---

## Anti-patterns

- Using `foothills` in JWorld brainstorm docs (use acts/zones instead)
- Deleting migrations or re-authoring vocabulary because worlds are new
- Assuming “content reuse” means “keep the 8-region map”
- Hardcoding lesson text into world layout components

---

## Related

- [08-target-structure.md](./08-target-structure.md) — canonical five-world model
- [06-n5-deep-dive.md](./06-n5-deep-dive.md) — N5 acts and landmarks
- [legacy-slugs.md](./legacy-slugs.md) — old slug → new world table for engineers
