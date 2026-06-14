# Mockup Art Workflow

Controlled generation from canonical mockup crops.

## Purpose

Bridge mockup panels to production assets without pixel-copying entire screens. Crops in `assets/_staging/mockup-refs/` are **reference only** — never served from `public/`.

## Canonical mockups

See [mockup-reference-style.md](./mockup-reference-style.md) and `assets/marketing/mockup_*_v1.png`.

## Staging folder

```
assets/_staging/mockup-refs/
```

Drop cropped panels here with names like `ref_nav_pill_ember_night_v1.png`. Add `.gitkeep` only; do not commit large binaries unless founder-approved.

## Generation scripts

| Script | Output |
|--------|--------|
| `scripts/generate-nav-fox-art.mjs` | Nav icons v2, nav fox stickers, trail companion |
| `scripts/generate-icon-families.mjs` | Dojo/world icons, hub hero scenes |
| `scripts/generate-scene-art.mjs` | Tier A backgrounds, nav pill skins |
| `scripts/process-sticker-assets.mjs` | PNG → transparent WebP (skips pre-composited nav fox) |

Run after generation:

```bash
node scripts/generate-nav-fox-art.mjs
node scripts/generate-icon-families.mjs
node scripts/generate-scene-art.mjs
npm run assets:stickers
```

## Review checklist

1. Open relevant canonical mockup panel.
2. Compare atmosphere, stroke weight, and glow usage — not pixel position.
3. Register approved assets in [asset-registry.md](./asset-registry.md).
4. Wire paths through `lib/assets/registry.ts` helpers only.

## Nav fox note

Light-fur nav fox PNGs are pre-composited with alpha. The sticker pipeline skips corner background sampling for `yama_nav_*` and `yama_trail_companion_*` to preserve fur edges.
