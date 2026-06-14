# Sign-Off Report

Generated: 2026-06-14T20:18:29.548Z

## Summary

| Metric | Value |
|--------|-------|
| Tier A routes configured | 8 |
| Live screenshots present | 0/8 |
| Routes 7/7 DoD pass | 0/8 |

## DoD criteria

- 1. Painterly full-bleed environment (not flat or photo wallpaper)
- 2. Content on glass overlays composited in the world
- 3. Section titles use gold serif StoryTitle
- 4. One red PrimaryClimbButton where mockup shows one
- 5. Clean sticker alpha — no white halos
- 6. No Lucide on learner-primary chrome
- 7. Composition + atmosphere match mockup panel

## Route status

| Priority | Route | Screenshot | Composite | DoD | Mockup panel |
|----------|-------|------------|-----------|-----|--------------|
| 1 | `camp` | **missing** | — | pending AD | home_learn_flow HOME / Product UX §16 |
| 2 | `learn-foothills` | **missing** | — | pending AD | journey_core §1 Short Trail |
| 3 | `learn-forest-trail` | **missing** | — | pending AD | journey_core §3 Forest Trail |
| 4 | `navbar-camp` | **missing** | — | pending AD | navbar_concepts §1 ember_night |
| 5 | `world` | **missing** | — | pending AD | journey_core §8 World Map |
| 6 | `profile` | **missing** | — | pending AD | Product UX profile / lantern path |
| 7 | `achievements` | **missing** | — | pending AD | gamification §1 Achievement Shrine |
| 8 | `dojo` | **missing** | — | pending AD | Product UX dojo hub |

## Per-route DoD detail

### camp (`/camp`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### learn-foothills (`/learn?region=foothills`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### learn-forest-trail (`/learn?region=forest-trail`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### navbar-camp (`/camp`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### world (`/world`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### profile (`/profile`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### achievements (`/achievements`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

### dojo (`/dojo`)

_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._

## Next steps

1. Capture missing screenshots at 390×844 → `assets/_staging/signoff/{slug}.png`
1. Run `npm run qa:signoff:composite` for side-by-side panels
1. AD fills `signoff-results.json` after reviewing composites
1. Re-run `npm run qa:signoff:report` and update `docs/visual-acceptance-checklist.md`
