# World Tree — Asset Production Checklist

Version: 1.1  
Status: Living document — update status as assets are produced  
Authority: `docs/World tree bible.md`, `docs/Skeleton world tree.md`

## Puzzle piece principle (read first)

**Every single asset in this checklist is a puzzle piece.** Not a background. Not a panel. Not a wallpaper.

What that means in practice:

1. **Transparent PNG** — alpha channel everywhere except the painted tree/part
2. **Only the piece is drawn** — roots, bark, branches, moss, mist wisps, etc.
3. **Empty canvas elsewhere** — no sky, no ground fill, no rectangular backdrop
4. **Fits onto any compatible piece** — stack vertically; top/bottom edges align (trunk center, width, silhouette)
5. **Shuffle and repeat** — the same segment can appear multiple times; combinations must look seamless
6. **Overlays are separate** — moss, torii, lanterns, effects are their own pieces, placed on top

```
┌─────────────┐
│  (empty)    │  ← transparent
│   ╔═══╗     │  ← painted trunk segment
│   ║   ║     │
│   ╚═══╝     │  ← soft mist at edge for seam blend
│  (empty)    │  ← transparent
└─────────────┘
      ↓ stacks onto next piece
```

Status legend: `[ ]` not started · `[~]` POC/wrong format · `[x]` production-ready puzzle piece

## How to use

- Each row is one **unique asset** requiring **light + dark** PNG masters
- All assets are **transparent puzzle pieces** — verify alpha before marking `[x]`
- Overlays/effects are **never baked** into trunk segments — always separate files
- Target resolution: **2048×2048** preferred, **1024×1024** minimum (segments may use 1536×1024 per manifest)

---

## 1. Root segments (N5)

Underground root network. Moss, ancient bark, fungi, soil.

| Status | ID | Target folder | Target filename | Skeleton zone | Notes |
|--------|----|--------------|-----------------|---------------|-------|
| [x] | `roots_a` | `segments/roots_a/` | `wt_roots_a_{theme}_v2.png` | n5_roots | BOTTOM tile — earth at bottom |
| [x] | `roots_b` | `segments/roots_b/` | `wt_roots_b_{theme}_v2.png` | n5_roots | Thicker root arch — regen v2 puzzle piece |
| [x] | `roots_c` | `segments/roots_c/` | `wt_roots_c_{theme}_v2.png` | n5_roots | Glowing fungi cluster — regen v2 puzzle piece |
| [x] | `roots_d` | `segments/roots_d/` | `wt_roots_d_{theme}_v2.png` | n5_roots | Underground spring — regen v2 puzzle piece |
| [x] | `roots_e` | `segments/roots_e/` | `wt_roots_e_{theme}_v2.png` | n5_roots | Crystal root chamber |

**Batch total:** 5 segments × 2 themes = **10 files**

---

## 2. Trunk segments (N4 / N3)

Main vertical tree body. Normal bark, golden veins, carvings, hollow sections.

| Status | ID | Target folder | Target filename | Skeleton zone | Notes |
|--------|----|--------------|-----------------|---------------|-------|
| [x] | `trunk_a` | `segments/trunk_a/` | `wt_trunk_a_{theme}_v2.png` | n4_foothills | v2 puzzle piece — light+dark in Art Library |
| [x] | `trunk_b` | `segments/trunk_b/` | `wt_trunk_b_{theme}_v2.png` | n4_foothills | v2 puzzle piece — sakura edge hint |
| [x] | `trunk_c` | `segments/trunk_c/` | `wt_trunk_c_{theme}_v2.png` | n4_foothills | v2 puzzle piece — regen dense edge foliage |
| [x] | `trunk_d` | `segments/trunk_d/` | `wt_trunk_d_{theme}_v2.png` | n3_trunk_1 | Ancient carvings on bark |
| [x] | `trunk_e` | `segments/trunk_e/` | `wt_trunk_e_{theme}_v2.png` | n3_trunk_1 | Empty niche carved in bark — regen v2 puzzle piece |
| [x] | `trunk_f` | `segments/trunk_f/` | `wt_trunk_f_{theme}_v2.png` | n3_trunk_2 | Golden vein pattern — regen v2 puzzle piece |
| [x] | `trunk_g` | `segments/trunk_g/` | `wt_trunk_g_{theme}_v2.png` | n3_trunk_2 | Hollow section inner glow — regen v2 puzzle piece |
| [x] | `trunk_h` | `segments/trunk_h/` | `wt_trunk_h_{theme}_v2.png` | n3_trunk_3 | Runes carved in bark (strict) |

**Batch total:** 8 segments × 2 themes = **16 files** (3 POC, 5 remaining)

---

## 3. Transition segments (biome connectors)

Seamless shifts between root → trunk → ancient → canopy → celestial.

| Status | ID | Target folder | Target filename | Connects | Notes |
|--------|----|--------------|-----------------|----------|-------|
| [ ] | `transition_root_to_trunk` | `transitions/root_to_trunk/` | `wt_transition_root_to_trunk_{theme}_v2.png` | N5 → N4 | Earth gives way to lower trunk |
| [ ] | `transition_trunk_to_ancient` | `transitions/trunk_to_ancient/` | `wt_transition_trunk_to_ancient_{theme}_v2.png` | N4 → N3 | Bark darkens, carvings appear |
| [x] | `transition_ancient_to_canopy` | `transitions/ancient_to_canopy/` | `wt_transition_ancient_to_canopy_{theme}_v2.png` | N3 → N2 | Single trunk Y-fork into branches (strict) |
| [ ] | `transition_canopy_to_celestial` | `transitions/canopy_to_celestial/` | `wt_transition_canopy_to_celestial_{theme}_v2.png` | N2 → N1 | Leaves become golden, sky opens |

**Batch total:** 4 segments × 2 themes = **8 files**

---

## 4. Canopy segments (N2)

Upper tree. Branch systems, leaves, sunlight shafts, floating islands.

| Status | ID | Target folder | Target filename | Skeleton zone | Notes |
|--------|----|--------------|-----------------|---------------|-------|
| [ ] | `canopy_a` | `segments/canopy_a/` | `wt_canopy_a_{theme}_v2.png` | n2_canopy | Wide branch hub |
| [ ] | `canopy_b` | `segments/canopy_b/` | `wt_canopy_b_{theme}_v2.png` | n2_canopy | Sakura branch cluster |
| [ ] | `canopy_c` | `segments/canopy_c/` | `wt_canopy_c_{theme}_v2.png` | n2_canopy | Floating island platform |
| [ ] | `canopy_d` | `segments/canopy_d/` | `wt_canopy_d_{theme}_v2.png` | n2_canopy | Dense leaf canopy with light shafts |
| [ ] | `canopy_e` | `segments/canopy_e/` | `wt_canopy_e_{theme}_v2.png` | n2_canopy | Cloud-edge transition |

**Batch total:** 5 segments × 2 themes = **10 files**

---

## 5. Celestial segments (N1)

Crown of the tree. Golden bark, divine light, cosmic energy.

| Status | ID | Target folder | Target filename | Skeleton zone | Notes |
|--------|----|--------------|-----------------|---------------|-------|
| [ ] | `celestial_a` | `segments/celestial_a/` | `wt_celestial_a_{theme}_v2.png` | n1_celestial | Golden crown base |
| [ ] | `celestial_b` | `segments/celestial_b/` | `wt_celestial_b_{theme}_v2.png` | n1_celestial | Celestial architecture |
| [ ] | `celestial_c` | `segments/celestial_c/` | `wt_celestial_c_{theme}_v2.png` | n1_celestial | Divine energy streams |
| [ ] | `celestial_d` | `segments/celestial_d/` | `wt_celestial_d_{theme}_v2.png` | n1_celestial | Starlight crown apex |

**Batch total:** 4 segments × 2 themes = **8 files**

---

## Segment summary

| Family | Count | POC | Remaining |
|--------|-------|-----|-----------|
| Roots | 5 | 5 | 0 |
| Trunk | 8 | 3 | 5 |
| Transitions | 4 | 0 | 4 |
| Canopy | 5 | 0 | 5 |
| Celestial | 4 | 0 | 4 |
| **Total segments** | **26** | **4** | **22 unique sets** |

**Total segment files at completion:** 26 × 2 themes = **52 PNG masters**

---

## 6. Decorative overlays — Nature

Independent assets. Never baked into segments.

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `overlay_moss_01` | `overlays/nature/wt_overlay_moss_01_{theme}_v1.png` |
| [ ] | `overlay_moss_02` | `overlays/nature/wt_overlay_moss_02_{theme}_v1.png` |
| [ ] | `overlay_moss_03` | `overlays/nature/wt_overlay_moss_03_{theme}_v1.png` |
| [ ] | `overlay_vine_01` | `overlays/nature/wt_overlay_vine_01_{theme}_v1.png` |
| [ ] | `overlay_vine_02` | `overlays/nature/wt_overlay_vine_02_{theme}_v1.png` |
| [ ] | `overlay_vine_03` | `overlays/nature/wt_overlay_vine_03_{theme}_v1.png` |
| [ ] | `overlay_mushroom_01` | `overlays/nature/wt_overlay_mushroom_01_{theme}_v1.png` |
| [ ] | `overlay_mushroom_02` | `overlays/nature/wt_overlay_mushroom_02_{theme}_v1.png` |
| [ ] | `overlay_mushroom_03` | `overlays/nature/wt_overlay_mushroom_03_{theme}_v1.png` |

**Subtotal:** 9 × 2 = **18 files**

---

## 7. Decorative overlays — Japanese mythology

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `overlay_torii_remnant_01` | `overlays/mythology/wt_overlay_torii_remnant_01_{theme}_v1.png` |
| [ ] | `overlay_torii_remnant_02` | `overlays/mythology/wt_overlay_torii_remnant_02_{theme}_v1.png` |
| [ ] | `overlay_stone_lantern_01` | `overlays/mythology/wt_overlay_stone_lantern_01_{theme}_v1.png` |
| [ ] | `overlay_stone_lantern_02` | `overlays/mythology/wt_overlay_stone_lantern_02_{theme}_v1.png` |
| [ ] | `overlay_fox_shrine_01` | `overlays/mythology/wt_overlay_fox_shrine_01_{theme}_v1.png` |
| [ ] | `overlay_fox_shrine_02` | `overlays/mythology/wt_overlay_fox_shrine_02_{theme}_v1.png` |
| [ ] | `overlay_sacred_rope_01` | `overlays/mythology/wt_overlay_sacred_rope_01_{theme}_v1.png` |

**Subtotal:** 7 × 2 = **14 files**

---

## 8. Decorative overlays — Magical

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `overlay_spirit_crystal_01` | `overlays/magical/wt_overlay_spirit_crystal_01_{theme}_v1.png` |
| [ ] | `overlay_spirit_crystal_02` | `overlays/magical/wt_overlay_spirit_crystal_02_{theme}_v1.png` |
| [ ] | `overlay_rune_cluster_01` | `overlays/magical/wt_overlay_rune_cluster_01_{theme}_v1.png` |
| [ ] | `overlay_rune_cluster_02` | `overlays/magical/wt_overlay_rune_cluster_02_{theme}_v1.png` |
| [ ] | `overlay_spirit_flame_01` | `overlays/magical/wt_overlay_spirit_flame_01_{theme}_v1.png` |
| [ ] | `overlay_spirit_flame_02` | `overlays/magical/wt_overlay_spirit_flame_02_{theme}_v1.png` |

**Subtotal:** 6 × 2 = **12 files**

---

## 9. Background depth assets

Used behind the main tree for scale. Transparent PNG.

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `depth_distant_mountains` | `depth/wt_depth_distant_mountains_{theme}_v1.png` |
| [ ] | `depth_distant_tree_01` | `depth/wt_depth_distant_tree_01_{theme}_v1.png` |
| [ ] | `depth_distant_tree_02` | `depth/wt_depth_distant_tree_02_{theme}_v1.png` |
| [ ] | `depth_distant_forest` | `depth/wt_depth_distant_forest_{theme}_v1.png` |
| [ ] | `depth_floating_island_01` | `depth/wt_depth_floating_island_01_{theme}_v1.png` |
| [ ] | `depth_floating_island_02` | `depth/wt_depth_floating_island_02_{theme}_v1.png` |
| [ ] | `depth_waterfall_01` | `depth/wt_depth_waterfall_01_{theme}_v1.png` |
| [ ] | `depth_waterfall_02` | `depth/wt_depth_waterfall_02_{theme}_v1.png` |

**Subtotal:** 8 × 2 = **16 files**

---

## 10. Foreground assets (parallax)

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `foreground_leaves_01` | `foreground/wt_foreground_leaves_01_{theme}_v1.png` |
| [ ] | `foreground_leaves_02` | `foreground/wt_foreground_leaves_02_{theme}_v1.png` |
| [ ] | `foreground_branches_01` | `foreground/wt_foreground_branches_01_{theme}_v1.png` |
| [ ] | `foreground_branches_02` | `foreground/wt_foreground_branches_02_{theme}_v1.png` |
| [ ] | `foreground_mist_01` | `foreground/wt_foreground_mist_01_{theme}_v1.png` |
| [ ] | `foreground_mist_02` | `foreground/wt_foreground_mist_02_{theme}_v1.png` |

**Subtotal:** 6 × 2 = **12 files**

---

## 11. Effect assets

| Status | ID | Target file |
|--------|----|-------------|
| [ ] | `effect_mist_light` | `effects/wt_effect_mist_light_{theme}_v1.png` |
| [ ] | `effect_mist_heavy` | `effects/wt_effect_mist_heavy_{theme}_v1.png` |
| [ ] | `effect_floating_leaves` | `effects/wt_effect_floating_leaves_{theme}_v1.png` |
| [ ] | `effect_fireflies` | `effects/wt_effect_fireflies_{theme}_v1.png` |
| [ ] | `effect_spirit_particles` | `effects/wt_effect_spirit_particles_{theme}_v1.png` |
| [ ] | `effect_sakura_petals` | `effects/wt_effect_sakura_petals_{theme}_v1.png` |
| [ ] | `effect_divine_sparks` | `effects/wt_effect_divine_sparks_{theme}_v1.png` |

**Subtotal:** 7 × 2 = **14 files**

---

## Grand total

| Category | Assets | Files (light+dark) |
|----------|--------|-------------------|
| Segments (roots + trunk + transitions + canopy + celestial) | 26 | 52 |
| Overlays (nature + mythology + magical) | 22 | 44 |
| Depth | 8 | 16 |
| Foreground | 6 | 12 |
| Effects | 7 | 14 |
| **Total** | **69** | **138 PNG masters** |

---

## Production batches (recommended order)

### Batch 1 — complete (transparent puzzle pieces)
`roots_a`, `trunk_a`, `trunk_b`, `trunk_c` — all done

### Batch 2 — Complete roots + lower trunk
`roots_b` – `roots_e` — **roots done** · `trunk_d`, `trunk_e`, `transition_root_to_trunk` remaining

### Batch 3 — Ancient trunk (N3)
`trunk_f` – `trunk_h`, `transition_trunk_to_ancient`, `transition_ancient_to_canopy`

### Batch 4 — Canopy (N2)
`canopy_a` – `canopy_e`

### Batch 5 — Celestial crown (N1)
`celestial_a` – `celestial_d`, `transition_canopy_to_celestial`

### Batch 6 — Overlays (nature + mythology)
All `overlay_*` in sections 6–7

### Batch 7 — Overlays (magical) + depth
Sections 8–9

### Batch 8 — Foreground + effects
Sections 10–11

---

## AI prompt template (per segment)

```
Create a modular World Tree PUZZLE PIECE for Noboru.

This is NOT a background image. It is a cut-out tree part on a fully transparent canvas.

Segment ID: {segment_id}
Family: {roots|trunk|transition|canopy|celestial}
JLPT zone: {n5|n4|n3|n2|n1}
Theme: {light|dark}

Requirements:
- FULLY TRANSPARENT background — PNG with alpha channel
- Only paint the tree/part itself — everything else must be empty/transparent
- NO sky, NO ground plane, NO full-bleed fill, NO rectangular backdrop
- This piece must stack onto other pieces like a jigsaw — top/bottom edges align
- Portrait composition, trunk centered at 50% width
- Trunk corridor 32% wide, must remain open and readable
- Soft mist/foliage at top and/or bottom edges for seamless vertical stitch
- Must be interchangeable — any compatible piece fits any other
- Japanese mythology inspired semi-realistic fantasy
- Ancient sacred world tree — impossibly large scale
- No characters, no text, no UI, no buildings
- High detail painterly rendering (Ori, Ghost of Tsushima, Ghibli forests)
- Tile type: {BOTTOM|MID|TOP}

Color palette ({theme}):
{light: #F4EFE3, #E9E1D0, #5E7357, #7B8D5A}
{dark: #0D1320, #131D2D, #D6A85F, #8EAA8B}

Variation focus: {shape|lighting|texture|structural}
```

---

## Quality gate (before marking [x])

- [ ] **Alpha check:** open in image editor — background is 100% transparent, not white/black
- [ ] **Puzzle piece test:** stack on another segment — no visible rectangular edge or color fill
- [ ] **No full-bleed:** no sky gradient, ground plane, or opaque rectangle behind the tree
- [ ] Light + dark pair exists with identical composition
- [ ] Trunk center X matches 50%, width matches 28%
- [ ] Seam zones have compatible mist/foliage for vertical stitch
- [ ] Piece fits any compatible segment above/below without silhouette break
- [ ] File named correctly: `wt_{id}_{theme}_v{n}.png`
- [ ] Saved in correct `Art Library/world-tree/` subfolder
- [ ] Registered in `docs/asset-registry.md`
- [ ] `lib/assets/art-library-paths.ts` updated (remove placeholder alias)
- [ ] Stack preview passes seam review (`preview-world-tree-stack.mjs`)
