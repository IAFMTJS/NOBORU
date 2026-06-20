# N4 World Art Spec — Full-Canvas Foothills Level

Version: 1.0  
Status: Active — drives `features/worlds/worlds/n4/n4-world-art.constants.ts`  
Authority: `docs/World tree bible.md`, `ASSET_CHECKLIST.md`

## Purpose

N4 is a **self-contained JLPT world** (`/worlds/n4`), not a slice of the old monolithic tree. Art must fill a **380vh scroll canvas** with puzzle pieces + one hero mass, matching the N5 world pattern.

## Visual identity

| Property | Value |
|----------|-------|
| JLPT band | N4 Foothills |
| Accent | `#E8A317` (amber gold) |
| Mood | Lower ascent — roots give way to trunk, torii paths, sakura hints |
| Hero subject | Floating rock foothills + ancient cedar trunk + torii stair paths |
| Seam tint | Pink-purple mist `#9B4A8B` at top/bottom (matches v1 hero fringe) |

## Required assets

### 1. Hero band — `wt_jlpt_n4_{theme}_v2.png`

| Property | Spec |
|----------|------|
| Folder | `Art Library/world-tree/jlpt-bands/n4/` |
| Canvas | Portrait ~1536×2048 (min 1024×1536) |
| Background | **Fully transparent** — only painted tree/rock mass |
| Anchor | Bottom — foothills base sits on World Heart atmosphere |
| Trunk center X | 50% |
| Path corridor | 32% width — keep clear for lesson nodes |
| Bottom 18% | Soft pink-purple mist fade → transparent (N5 portal entry seam) |
| Top 14% | Soft pink-purple mist fade → transparent (N3 portal exit seam) |
| Forbidden | Sky fill, ground plane, black matte, UI, nodes, text |

**v2 changes from v1:** tighter bottom anchor, stronger dual-seam mist, wider playable cliff mass for node pathing, no baked black background.

### 2. Transition — `wt_transition_root_to_trunk_{theme}_v2.png`

| Property | Spec |
|----------|------|
| Folder | `Art Library/world-tree/transitions/root_to_trunk/` |
| Connects | N5 World Heart → N4 foothills base |
| Composition | Gnarled golden roots at bottom morphing into amber bark trunk at top |
| Tile type | MID — mist at both edges |
| Used in | N4 world crown gap (optional portal vignette) + future N5→N4 portal transition |

### 3. Puzzle fill (existing v2 segments)

Already in Art Library — stack beneath hero:

| Segment | Role in N4 canvas |
|---------|-------------------|
| `roots_e` | Crystal root chamber — base left |
| `trunk_a` | Main bark column — center-left |
| `trunk_b` | Sakura edge bark — center-right |
| `trunk_c` | Dense foliage edge — upper fill |

## Code placement map (canvas %)

Derived from v1/v2 hero composition — **node path must avoid painted mass center trunk**.

| Canvas Y | Region | Node X band | Notes |
|----------|--------|-------------|-------|
| 98–80 | Entry foothills | 34–66% spine, branches 12–88% | Torii base camp zone |
| 80–45 | Mid climb | 28–72% serpentine | Stair paths left/right |
| 45–12 | Upper trunk | 26–74% | Narrower toward crown |
| 12–5 | Portal crown | 40–60% | N3 portal anchor |

## Atmosphere layers (CSS — not baked into PNG)

| Layer | Height | Purpose |
|-------|--------|---------|
| `worldHeartBase` | bottom 26% | Amber radial glow — fills void |
| `islandSeamOverlay` | bottom 20% | Warm earth → amber blend |
| `islandFringeOverlay` | bottom 12% | Masks purple PNG underhang |
| `crownSeamOverlay` | top 10% | Masks purple PNG crown fringe |

## Production checklist

- [x] v1 hero exists (`wt_jlpt_n4_*_v1.png`)
- [ ] v2 hero light + dark (this spec)
- [ ] `transition_root_to_trunk` light + dark
- [x] Fill segments trunk_a/b/c, roots_e
- [ ] Publish v2 to `public/art-library/` via `publish-world-tree-jlpt-bands.mjs`
- [x] Layout tuning (`n4-world-layout.utils.ts`)

## AI generation prompt (hero v2)

```
Create a modular World Tree JLPT band hero PUZZLE PIECE for Noboru.

Segment: N4 Foothills hero (full world canvas)
Theme: {light|dark}

NOT a background image. Fully transparent PNG — only the painted tree/rock mass.
Portrait, trunk centered at 50% width, 32% clear path corridor down the middle.

Subject: Ancient Japanese cedar trunk on a floating rocky foothills island. Orange-red
torii gates on wooden stair paths. Small waterfalls on cliff faces. Moss, sakura pink
blossoms, amber (#E8A317) light accents.

Bottom 18%: soft pink-purple mist fading to transparent (seam blend).
Top 14%: soft pink-purple mist fading to transparent (portal seam).

NO sky, NO ground plane, NO black rectangle, NO UI, NO lesson nodes, NO text.
Semi-realistic fantasy Japanese mythology. NOT anime or chibi.
```
