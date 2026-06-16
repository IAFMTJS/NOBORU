# Noboru World Tree — Art Library

Modular vertical tiles for the sacred world tree journey canvas. **Art only** — lesson nodes are placed later in code.

## Active version: v2

Batch 1 regenerated with strict stitch rules (BOTTOM vs MID tile types). v1 kept for comparison.

Preview stacks: `_previews/batch1_light_stack_raw_v2.jpg`

## Batch 1 (POC)

| Segment | Type | Files |
|---------|------|-------|
| `roots` | BOTTOM | `wt_roots_*_v2.png` |
| `foothills_01–03` | MID | `wt_foothills_0*_*_v2.png` |

## Canvas

- **1536 × 1024 px** per tile (generator output; stack many for height)
- Trunk center ~50% width — calm corridor for future lesson nodes
- Top/bottom **128 px seam zone** — mist/foliage for invisible stitch

## Rules

- NO UI, NO text, NO mock lesson cards
- Full bleed atmospheric art (not transparent)
- Light + dark pairs — same composition, palette only
- Stylized realism AAA fantasy Japan (doc 08)

## Stack order

```
foothills_03  ← top (scroll up)
foothills_02
foothills_01
roots         ← bottom (journey start)
```

Manifest: `scripts/art-direction/world-tree-manifest.json`
