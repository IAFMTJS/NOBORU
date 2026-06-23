# JWorld Changelog

Append an entry at the top for every brainstorm session.

---

## 2026-06-24 — Full audit implementation (Phase 0–5)

**Trigger:** [Noboru Full Audit plan](../performance-audit.md) — shop/collections DB, N5 spine ~300 slots, performance, social finish.

**Shipped:**

- Economy: `shop_items` + wallet from EP; collections museum from collectibles DB
- N5 spine: blueprint **300** slots; pedagogy script fixed (293 path lessons on `/tree`)
- Grammar: `は`/`です` dedupe migration; Base Camp duplicate draft; `act_index` on Sentence Foundations
- Comprehension SRS: expanded story/listening slug maps + unit test
- Perf: cross-request `unstable_cache` for elevation/quests/review/progress; camp quest dedupe; league cache invalidation on EP
- Rate limits on mutation routes; JWT claims backfill migration
- Social: league opt-out, friends follow/unfollow API, community friends tab, camp → leaderboard link
- Visual: Lantern Gold `--primary`, NavTabItem in bottom nav, N5 canvas reduced-motion scroll, jlpt pills immersion fix

**Blocked (founder):** Manual N5 playthrough sign-off → N4 + [16-post-n5-backlog.md](./16-post-n5-backlog.md).

---

## 2026-06-23 — Full remediation (June audit)

**Trigger:** June 2026 performance + learning audit remediation plan.

**Shipped:**

- CI: journey test types, nav `/tree` → N5 canvas, pedagogy inventory script + CI step
- Cleanup: dead dashboard module, ESLint 9 flat config, legacy slug inventory, Yama/Kitsune alias docs
- Social: placeholder data hidden; opt-in `leagueService` wired to `/community` and `/leaderboard`
- Content: `は`/`です` N5 trail migration; comprehension SRS enqueue for story/listening key vocab
- Visual: act sensory overlays on N5 backdrop; primary nav label **Journey**
- Perf: cached league leaderboard (45s), API rate limits on review/sync/games, Lighthouse lesson fixture
- Docs: [15-n5-playthrough-checklist.md](./15-n5-playthrough-checklist.md), [16-post-n5-backlog.md](./16-post-n5-backlog.md)

**Remaining:** Founder manual N5 playthrough sign-off → N4 unblocked.

---

## 2026-06-22 — Session 10: N5 art sprint kickoff

**Trigger:** Founder — node placement good; time to make art.

**Decisions:**

- Greybox spine **signed off** — 74 slots (65 visible, 9 reserved), dynamic scroll height locked
- Art generation proceeds **one slice at a time** per [12](./12-n5-art-and-node-placement.md) pipeline
- Stacked 3 act slices + realm silhouette + 9 landmark icons + portal matte (unchanged minimum from [11](./11-n5-complete-spec.md))

**Artifacts:**

- Fresh greybox export: `Art Library/staging/n5-greybox.{png,svg,json}`
- [14-n5-art-generation-briefs.md](./14-n5-art-generation-briefs.md) — copy-paste prompts, sizes, naming, acceptance

**Next:** Composite check on skeleton → founder visual review → manual playthrough.

**Art generated (Session 10 continued):** 10 backgrounds + 18 landmark icons → `Art Library/backgrounds/n5/`, `Art Library/icons/landmarks/n5/` → published WebP → `n5-world-art.constants.ts` wired.

---

## 2026-06-22 — Session 8: N5 implementation sprint (founder sign-off)

**Trigger:** Founder signed [11-n5-complete-spec.md](./11-n5-complete-spec.md) — full execute.

**Shipped (code):**

- `features/worlds/` — N5 canvas, HUD, spine, backdrop, nodes, portal transition
- `/tree` — Realm of First Light scroll (480vh greybox + spine nodes)
- `journey-path-contracts.json` — canonical `n5` key + landmark/checkpoint slots
- `scripts/art-direction/n5-world-layout.json` — greybox act bands
- `20260622140000_n5_landmarks_and_trial_copy.sql` — CMS landmarks + trial display names
- Trial title remap in journey path builder; N5 landmark fallbacks when CMS empty
- World map copy → five realms

**Remaining:** Manual playthrough QA, founder N5 validation → N4 spec.

---

## 2026-06-22 — Session 9: N5 completion + implementation audit

**Trigger:** Finish remaining work + audit against spec.

**Fixed migrations:** `n5-sentinel` steps idempotency, `world_tree_placeholder` PL/pgSQL ambiguity, landmark trigger SQL.

**Shipped:** Art pack wiring (interim library assets), five-realm world map, enhanced `n5_world` launch check, static audit test + [13-n5-implementation-audit.md](./13-n5-implementation-audit.md), legacy learner copy purge, remote `db push` complete.

---

## 2026-06-22 — Session 7: N5 art ↔ node placement workflow

**Trigger:** Founder — how node placement combines with art, and how art gets created.

**Added:**

- [12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md) — three coordinate spaces, greybox-first workflow, landmark `path_position` map, World Tree composition replacement (`n5-world-layout.json`), art pipeline steps, acceptance criteria

**Decided:**

- **Layout before final art** — greybox spine + act bands, then environment slices painted to fit
- **Nodes on UI layer** — stepping stones/rings not baked into background PNGs
- **Stacked act slices** (3) preferred over single 5120px master for v1 iteration
- **CMS `path_position`** overrides generic `landmarkSlots` for N5’s 8+ landmarks
- Rebate `journey-path-contracts` from legacy `mount-n5` key to canonical `n5`

**Updated:** [11-n5-complete-spec.md](./11-n5-complete-spec.md), [README.md](./README.md)

**Next:** Founder sign-off on [11](./11-n5-complete-spec.md) + greybox spine review → skeleton canvas → art sprint.

---

## 2026-06-22 — Session 6: N5-first rollout + complete spec

**Trigger:** Founder — full N5 first; implement; if good, replicate to other N levels.

**Added:**

- [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md) — concept → implement → validate → replicate pipeline; N4–N1 blocked until N5 passes
- [11-n5-complete-spec.md](./11-n5-complete-spec.md) — unit spine per act (from CMS seeds), landmark pins, trial rename table, HUD copy, art minimum, implementation DOD, sign-off table

**Resolved (pending founder sign-off on 11):** act labels, entry at Ember Threshold, side paths v1 = spine first, placement skip at Forest Torii.

**Updated:** [06-n5-deep-dive.md](./06-n5-deep-dive.md), [04-sparring-and-decisions.md](./04-sparring-and-decisions.md), [README.md](./README.md)

**Next:** Founder review [11-n5-complete-spec.md](./11-n5-complete-spec.md) → N5 implementation sprint (no N4 work).

---

## 2026-06-22 — Session 5: Option A implementation

**Trigger:** Founder approved five `regions` rows (Option A).

**Decided:** [09-cms-decision.md](./09-cms-decision.md) — `n5`…`n1` region slugs, `units.act_index` for N5 acts.

**Shipped (code + migration):**

- `supabase/migrations/20260622120000_jworld_five_world_regions.sql`
- `lib/design-system/worlds.ts` — canonical slugs + `normalizeRegionSlug()`
- `lib/design-system/regions.ts` — five worlds
- Region unlock, JLPT mapping, narrative arcs, launch criteria, blueprint, onboarding
- Legacy slug merge in `augmentRegionsWithBlueprint`

**Lessons:** Content rows unchanged; units re-homed under world regions at migration.

**Next:** Run migration on environments; unit → landmark mapping; N4 deep-dive.

---

## 2026-06-22 — Session 4: Clarify new setup vs legacy slugs

**Trigger:** Founder — why talk about foothills/forest trail? New setup, not old region names.

**Clarified:**

- `foothills`, `forest-trail`, `mount-n5` are **hardcoded today** (DB migrations, `regions.ts`, blueprint, launch criteria) — **legacy**, not JWorld vocabulary
- **Reuse = lesson content**, not the 8-region journey map
- **Target = 5 worlds** (`n5`…`n1`), acts/zones inside each world

**Added:** [08-target-structure.md](./08-target-structure.md), [legacy-slugs.md](./legacy-slugs.md)

**Updated:** [07-content-reuse.md](./07-content-reuse.md) (rewritten), [06-n5-deep-dive.md](./06-n5-deep-dive.md), [02-five-worlds.md](./02-five-worlds.md), [legacy-context.md](./legacy-context.md), [README.md](./README.md)

**JWorld doc rule:** No legacy region names in brainstorm docs except `legacy-slugs.md`.

**Next:** Pick CMS Option A vs B; unit → landmark mapping under world `n5` only.

---

## 2026-06-22 — Session 3: Content reuse confirmed

**Input:** Founder kept existing lesson data and curriculum for reuse in JWorld.

**Added:** [07-content-reuse.md](./07-content-reuse.md)

**Principle:** JWorld = presentation/navigation reskin only. CMS regions, units, lessons, vocabulary, kanji, grammar, trials, and migrations **unchanged**. Region slugs remain stable IDs.

**Documented:**

- What stays vs what changes (presentation layer)
- `WORLD_TREE_CMS_ALIASES` mapping
- World → region reuse table
- N5 act → region → landmark overlay (draft anchors to existing units)
- Trial slug reuse vs guardian display names
- Implementation anti-patterns

**Updated:** [06-n5-deep-dive.md](./06-n5-deep-dive.md), [legacy-context.md](./legacy-context.md), [README.md](./README.md)

**Decisions:** **Content reuse is explicit policy** — no curriculum rewrite as part of world reimagining.

**Next:** Unit → landmark mapping workshop (implementation prep) or N4 deep-dive.

---

## 2026-06-22 — Session 2: N5 deep-dive

**Trigger:** Founder approved N5 deep-dive round.

**Added:** [06-n5-deep-dive.md](./06-n5-deep-dive.md)

**Content:**

- Three acts mapping to legacy regions (Awakening / First steps / Climb begins)
- Eight landmarks + Gate of Ascent with lesson-topic mapping
- Hamlet quarter side paths (Greeting, Food, Home)
- Landmark visual signatures for art
- Learner “day in the life” scroll narrative
- N5 → N4 portal cinematic script (6 beats)
- Mood board keywords + prioritized asset list for art agent
- Guardian of First Light trial framing
- N5-specific open questions

**Updated:** [02-five-worlds.md](./02-five-worlds.md) — N5 summary links to deep-dive

**Decisions:** None final.

**Next:** Founder reaction to N5 acts/landmarks; then N4 deep-dive or art pipeline kickoff.

---

## 2026-06-22 — Session 1: Five worlds foundation

**Participants:** Founder + agent (brainstorm / sparring)

**Context:** World Tree art is being deleted by another agent. Pivot to five separate JLPT worlds; N5 is the starting point. No code in this session.

**Discussed:**

- Core fork: one sacred mountain (five altitude bands) vs five linked mythological realms vs pilgrimage vs trial dungeons
- Recommended hybrid: **one mythological Japan, five distinct realms at increasing altitude**, connected by **torii portals** (not tree branches)
- Pre-JLPT (Foothills, Forest Trail, hiragana/katakana): lean toward **folding into N5** as Script Sanctum threshold
- Full concepts drafted for N5–N1 (names, layers, emotional arcs, palettes, Yama beats)
- World connectivity: portal chain, panorama/compass overview replacing vertical tree scroll
- Internal structure template per world: entry → threshold → rings → landmarks → trial → summit portal
- Sparring: kill tree vocabulary, N5 size, Master Summit placement, horizontal variety per world
- Sensory progression table (time, weather, sound per world)
- Guardian/trial rename table (detach from tree naming)

**Decisions:** None final — all proposals for reaction.

**Open:** See [04-sparring-and-decisions.md](./04-sparring-and-decisions.md).

**Next:** Deep-dive N5 (landmarks, learner day-in-life, N5→N4 portal script, mood board keywords).
