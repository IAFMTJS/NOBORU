# Screenshot Sign-Off Workflow

Use with [visual-acceptance-checklist.md](./visual-acceptance-checklist.md) for Art Director mockup parity sign-off.

## Quick start

```bash
npm run dev
# Capture PNGs → assets/_staging/signoff/{slug}.png (see signoff-routes.json)
npm run qa:signoff              # composites + report
```

Route config: [assets/_staging/signoff/signoff-routes.json](../assets/_staging/signoff/signoff-routes.json)

## Capture (390×844)

1. Run dev server: `npm run dev`
2. Open route at **390×844** (Chrome DevTools → iPhone 14 Pro)
3. Capture full viewport screenshot (no browser chrome)
4. Save to `assets/_staging/signoff/{slug}.png`

Configured slugs: `camp`, `learn-foothills`, `learn-forest-trail`, `navbar-camp`, `world`, `profile`, `achievements`, `dojo`

## Compare (automated)

```bash
npm run qa:signoff:composite
```

Outputs `assets/_staging/signoff/composites/{slug}_compare.png` — mockup ref (left) | live (right), each normalized to 390×844.

## Score (7 DoD criteria)

1. Painterly full-bleed environment
2. Glass overlays composited in the world
3. Gold serif `StoryTitle` section titles
4. One red `PrimaryClimbButton` primary CTA
5. Clean sticker alpha — no white halos
6. No Lucide on learner-primary chrome
7. Composition + atmosphere match mockup panel

Copy `signoff-results.template.json` → `signoff-results.json` and mark each criterion pass/fail per route.

## Report

```bash
npm run qa:signoff:report
```

Writes `assets/_staging/signoff/signoff-report.md` with screenshot presence, composite status, and DoD table.

## Pre-checks (automated)

```bash
npm run qa:visual
npm run assets:alpha-qa
npm run assets:sync-version-manifest
```

## Log AD sign-off

When a route passes all 7 criteria:

1. Update `signoff-results.json`
2. Re-run `npm run qa:signoff:report`
3. Mark route in [visual-acceptance-checklist.md](./visual-acceptance-checklist.md) with AD initials + date

## Rule

A route is **mockup-complete** only when AD marks all 7 criteria pass — not when code uses `SceneImage`/`GlassPanel` alone.
