# Sign-Off Screenshots

Live viewport captures for Art Director mockup parity review.

## Capture (390×844)

1. `npm run dev`
2. Open route in Chrome DevTools → iPhone 14 Pro (390×844)
3. Full viewport screenshot (no browser chrome)
4. Save as `{slug}.png` in this folder (see `signoff-routes.json`)

Example: `camp.png`, `learn-foothills.png`, `navbar-camp.png`

## Automated workflow

```bash
# After dropping PNGs here:
npm run qa:signoff:composite   # mockup | live side-by-side → composites/
npm run qa:signoff:report      # status + DoD checklist → signoff-report.md
npm run qa:signoff             # composite + report
```

Pre-checks before AD review:

```bash
npm run qa:visual
npm run assets:alpha-qa
```

## AD sign-off

Fill `signoff-results.json` (copy from `signoff-results.template.json`) with pass/fail per DoD criterion, then run `npm run qa:signoff:report` to refresh the report.

A route is **mockup-complete** only when all 7 DoD criteria pass.
