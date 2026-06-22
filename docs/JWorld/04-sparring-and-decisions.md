# Sparring points & open decisions

## Sparring — push back on these

### 1. Kill tree vocabulary entirely?

Code stubs still use Roots, Trunk, Canopy, Crown (`features/worlds/worlds/n*/n*-world.constants.ts`). If art is gone, **rename zones** or learners feel the disconnect.

**Proposal:** Realm names only in learner-facing copy. Internal codenames may stay until refactor.

### 2. Is N5 too big?

N5 bundles Foothills + Forest Trail + Mount N5 (three legacy regions). Narratively correct (“whole beginning”) but heavy for canvas scale.

**Counter-proposal:** N5 is the longest scroll — it *should* feel big. Origin story.

### 3. Master Summit — world or epilogue?

See [02-five-worlds.md](./02-five-worlds.md#master-summit). Session 1 lean: **Option A** (inside N1); Option B for endgame fantasy.

### 4. Horizontal variety vs pure vertical?

Pure bottom-to-top can feel samey. One lateral signature per world — see [05-sensory-guardians.md](./05-sensory-guardians.md#lateral-mechanics-per-world).

### 5. World select vs forced journey?

See [03-connectivity.md](./03-connectivity.md#navigation-modes).

---

## Open decisions (founder)

| # | Question | Options | Status |
|---|----------|---------|--------|
| 1 | **Unifying metaphor** | Mountain bands / linked realms / pilgrimage / trials | **Open** — Session 1 lean: mountain + linked realms |
| 2 | **Pre-JLPT** | Fold into N5 Script Sanctum / visible Chapter 0 / prologue only | **Leaning settled** — Act I “Awakening” inside N5 ([06-n5-deep-dive.md](./06-n5-deep-dive.md)); confirm label UX |
| 3 | **Overview UI** | Stacked panorama / compass map / other | **Open** |
| 4 | **Tree language** | Full purge from copy / internal codenames only | **Open** |
| 5 | **World names** | Japanese + English subtitles / English-only with JP landmarks | **Open** |
| 6 | **Curriculum rewrite** | Reskin vs remigrate | **Settled** — reuse lessons, **new five-world structure** ([07-content-reuse.md](./07-content-reuse.md), [08-target-structure.md](./08-target-structure.md)) |
| 7 | **CMS shape** | Five `region` rows vs `world_id` on units | **Decided — Option A** ([09-cms-decision.md](./09-cms-decision.md)) |

---

## Next steps (founder-directed)

**N5 only until validated** — see [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md).

1. **Review & sign off** [11-n5-complete-spec.md](./11-n5-complete-spec.md) (unit spine, trials, HUD, art minimum)
2. **Greybox spine** per [12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md) — then art v1
3. **N5 implementation sprint** — journey canvas, landmarks, act HUD, portal
3. **Playtest** → template approval
4. **Then** N4 complete spec (not before step 3)

Open globally: overview UI (#3), unifying metaphor (#1), tree language purge (#4).
