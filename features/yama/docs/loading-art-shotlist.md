# Loading Art Shot List (Phase 2)

Purpose: final mockup-aligned loading backgrounds and supporting micro-assets.

## Directory

- Source masters: `assets/art/_source/loading/`
- Staging: `assets/art/_staging/loading/`
- Production WebP: `public/art/backgrounds/loading/`

## Hero and alternate scenes

| Asset ID | Shot | Composition notes | Replace profile |
| --- | --- | --- | --- |
| `bg-loading-camp-moment-v1` | Camp moment | Noboru seated by campfire, tent frame left, torii/path depth center, warm ember pool foreground | `default`, `home`, `review` |
| `bg-loading-trail-moment-v1` | Trail moment | Stone path + lanterns receding to torii, cooler night sky, no UI clutter | `learn`, `lesson` |
| `bg-loading-study-moment-v1` | Study moment | Lantern-lit study nook / cherry blossom study path, softer contrast | `learn` (study variant) |
| `bg-loading-region-leave-v1` | Region leave | Dark foothill silhouette, mist at base, departure mood | `region-transition` (outbound) |
| `bg-loading-region-enter-v1` | Region enter | Forest trail opening, brighter lantern line, arrival mood | `region-transition` (inbound) |

## Supporting micro-assets

| Asset ID | Category | Notes |
| --- | --- | --- |
| `particle-loading-ember-v1` | `props/particles` | Small ember sprite sheet or 3 variants |
| `particle-loading-firefly-v1` | `props/particles` | Cool/warm firefly specks for ambient drift |
| `prop-loading-lantern-glow-v1` | `props/camp` | Soft radial glow mask for lantern pools |
| `ui-progress-loading-frame-v1` | `ui/progress` | Thin amber frame optional overlay for progress bar |

## Registry wiring (after art lands)

1. Publish WebP files to `public/art/backgrounds/loading/`.
2. IDs are already declared in [`lib/assets/art-mappings.ts`](../../../lib/assets/art-mappings.ts) as `LOADING_BACKGROUND_ASSETS`.
3. Point `LOADING_SCENE_PROFILE_ASSETS` entries to the new loading IDs.
4. Update `assets/art/manifest.json` and run the art pipeline validation script.

## Art direction checklist

- Palette: deep blue-black sky, amber lantern pools, restrained sakura accents.
- Focal hierarchy: companion + fire foreground, path/torii mid-ground, stars/sky background.
- Avoid hardcoded text inside illustrations.
- Deliver 1x and 2x widths; keep hero background under practical mobile payload targets.
- Maintain painterly Noboru RPG style from `art-direction/00_global_visual_system.md`.

## Immediate phase-1 stand-ins (current)

| Profile | Current asset |
| --- | --- |
| `default`, `home` | `bg-camp-loading` |
| `learn` | `bg-trail-forest-current-night` |
| `lesson` | `bg-trail-foot-hills-night` |
| `review` | `bg-camp-offline` |
| `region-transition` | `bg-shrine-region-transition-torii` |
