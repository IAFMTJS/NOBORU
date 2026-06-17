# Noboru World Tree — Art Library

Modular vertical segments for the sacred World Tree journey canvas.

**Art only** — lesson nodes are placed in code on the trunk corridor. No UI, no panels, no text baked into art.

## Puzzle piece principle (critical)

Every World Tree asset is a **puzzle piece**, not a background panel.

| Rule | Meaning |
|------|---------|
| **Transparent background** | PNG with alpha. Only the tree/part is painted. Everything else is empty. |
| **No full-bleed fill** | No sky, no ground plane, no rectangular wallpaper. The canvas background must be see-through. |
| **Interchangeable** | Any compatible segment stacks on any other. Shuffle and repeat without visible seams. |
| **Socket alignment** | Top and bottom edges align — trunk width, center X, and silhouette continue across pieces. |
| **Separate layers** | Overlays, depth, foreground, and effects are independent pieces — never baked into trunk segments. |

Think: **cut-out tree parts on a transparent sheet**, stacked vertically to build one giant living World Tree from underground roots to the celestial crown.

> **POC note:** Batch 1 files (`01_roots`, `02_foothills_01` etc.) were early full-bleed experiments. They must be **regenerated as transparent puzzle pieces** before production use.

## Authoritative references

| Document | Purpose |
|----------|---------|
| `docs/World tree bible.md` | Visual direction, segment categories, overlays, effects |
| `docs/Skeleton world tree.md` | Zone structure (N5 roots → N1 crown) |
| `scripts/art-direction/world-tree-manifest.json` | Tile canvas, anchors, seam overlap, batch order |
| `features/journey/constants/world-tree-skeleton.constants.ts` | Zone → `artSegmentIds` mapping |
| `lib/assets/art-library-paths.ts` | Segment ID → Art Library path |
| `ASSET_CHECKLIST.md` | Full production checklist with status |

## Architecture

The World Tree is **not** a single background image. It is a modular system:

1. **Stack** vertical trunk/root/canopy/celestial segments with seam overlap
2. **Attach** decorative overlays, depth, foreground, and effects as separate layers
3. **Puzzle** segments in any compatible order to build an infinite vertical tree

Five segment families (JLPT ascent):

| Family | JLPT | Segments | Purpose |
|--------|------|----------|---------|
| **Roots** | N5 | `roots_a` – `roots_e` | Underground root network, moss, fungi |
| **Trunk** | N4 / N3 | `trunk_a` – `trunk_h` | Main vertical body, bark, carvings |
| **Transitions** | biome edges | 4 connectors | Seamless biome shifts |
| **Canopy** | N2 | `canopy_a` – `canopy_e` | Branches, leaves, floating islands |
| **Celestial** | N1 | `celestial_a` – `celestial_d` | Golden crown, divine light |

Plus independent overlay families: nature, mythology, magical, depth, foreground, effects.

## Naming convention

### Segment IDs (code + manifest)

Lowercase snake_case: `roots_a`, `trunk_b`, `transition_root_to_trunk`, `canopy_c`, `celestial_d`

### File names

```
wt_{segment_id}_{theme}_v{version}.png
```

Examples:

```
wt_roots_a_light_v2.png
wt_roots_a_dark_v2.png
wt_trunk_b_light_v2.png
wt_transition_root_to_trunk_dark_v2.png
wt_canopy_c_light_v2.png
wt_celestial_a_dark_v2.png
```

### Overlay / effect files (bible naming)

```
wt_overlay_moss_01_light_v1.png
wt_overlay_torii_remnant_01_dark_v1.png
wt_effect_mist_light_light_v1.png
wt_depth_distant_mountains_light_v1.png
wt_foreground_leaves_01_dark_v1.png
```

### Target folder layout

```
world-tree/
  segments/
    roots_a/          wt_roots_a_{light|dark}_v2.png
    trunk_a/          wt_trunk_a_{light|dark}_v2.png
    ...
  transitions/
    root_to_trunk/    wt_transition_root_to_trunk_{light|dark}_v2.png
    ...
  overlays/
    nature/           wt_overlay_moss_01_{light|dark}_v1.png
    mythology/
    magical/
  depth/              wt_depth_distant_mountains_{light|dark}_v1.png
  foreground/         wt_foreground_leaves_01_{light|dark}_v1.png
  effects/            wt_effect_mist_light_{light|dark}_v1.png
  _previews/          stack review JPEGs
```

## Canvas & stitching

| Property | Value |
|----------|-------|
| Tile size | **1536 × 1024 px** (portrait) |
| Trunk center | 50% width |
| Path corridor | 32% width |
| Seam overlap | **96 px** (9.375% of tile height) |
| Seam zone | Top/bottom 20% — mist/foliage for invisible stitch |

### Tile types

| Type | Used for | Rules |
|------|----------|-------|
| **BOTTOM** | Lowest root segment | Earth at bottom, mist at top. No canopy at top edge. |
| **MID** | Trunk segments | Mist at BOTH top and bottom. No ground, no buildings, no roots. |
| **TOP** | Highest canopy/celestial | Mist at bottom only. |

## Art rules

- **Every asset is a puzzle piece** — transparent PNG, only the painted tree/part visible
- **No full-bleed panels** — no sky gradients, ground planes, or rectangular backgrounds
- **No baked sky, terrain, UI, text, characters, buildings**
- **Light + dark pairs** — identical composition, palette swap only
- **Same trunk silhouette** — trunk center X and width identical across all segments
- **Portrait composition** — tree centered, path corridor visible
- **Semi-realistic fantasy** — Japanese mythology inspired (see doc 08)
- **Forbidden:** cartoon, anime, chibi, pixel art, generic mobile game art

## Skeleton zone → segment mapping

Bottom (journey start) → top (crown):

| Zone | JLPT | Segment IDs |
|------|------|-------------|
| Deep Root Network | deep | *(future)* |
| N5 Roots | n5 | `roots_a` – `roots_e` |
| N4 Foothills | n4 | `trunk_a` – `trunk_c` |
| N3 Trunk · Ring I | n3 | `trunk_d`, `trunk_e` |
| N3 Trunk · Ring II | n3 | `trunk_f`, `trunk_g` |
| N3 Trunk · Ring III | n3 | `trunk_h`, `transition_ancient_to_canopy` |
| N2 Canopy | n2 | `canopy_a` – `canopy_e` |
| N1 Celestial Crown | n1 | `celestial_a` – `celestial_d` |

## Production status

See **`ASSET_CHECKLIST.md`** for the full checklist with per-asset status.

### Batch 1 — POC (regenerated as transparent puzzle pieces)
`roots_a`, `trunk_a`, `trunk_b`, `trunk_c` — all complete

| Segment ID | Tile type | Legacy file | Status |
|------------|-----------|-------------|--------|
| `roots_a` | BOTTOM | `segments/roots_a/wt_roots_a_*_v2.png` | **Done** — transparent puzzle piece |
| `trunk_a` | MID | `segments/trunk_a/wt_trunk_a_*_v2.png` | **Done** — transparent puzzle piece |
| `trunk_b` | MID | `segments/trunk_b/wt_trunk_b_*_v2.png` | **Done** — sakura edge hint |
| `trunk_c` | MID | `segments/trunk_c/wt_trunk_c_*_v2.png` | **Done** — dense edge foliage |

> **Legacy note:** Old folders (`01_roots`, `02_foothills_01` etc.) are deprecated. All Batch 1 segments now live under `segments/`.

### Stack order (POC preview)

```
trunk_c       ← top (scroll up)
trunk_b
trunk_a
roots_a       ← bottom (journey start)
```

Preview: `_previews/batch1_light_stack_raw_v2.jpg`

Generate stack preview:

```bash
node scripts/art-direction/preview-world-tree-stack.mjs 2
```

## Publishing

1. Save masters to `Art Library/world-tree/` (this folder)
2. Register in `docs/asset-registry.md`
3. Update `lib/assets/art-library-paths.ts` segment → path mapping
4. Publish to `public/art-library/` (WebP conversion via asset pipeline)
