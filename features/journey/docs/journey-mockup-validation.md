# Journey Mockup Validation & Rollout

Version: 1.0  
Contract: `features/journey/docs/journey-mockup-contract.md`

## Visual Regression Set

Capture one screenshot per state before merge:

| ID | State | Trigger |
|----|-------|---------|
| `journey-default` | Current node centered | Open `/learn` as user mid-trail |
| `journey-selected` | Node detail sheet | Tap current lesson node |
| `journey-locked` | Locked node detail | Tap locked node ahead |
| `journey-event` | Event banner + branch FAB | Active seasonal event |
| `journey-boss` | Trial node atmosphere | Scroll to regional trial |
| `journey-transition` | Region unlock overlay | `?unlock=forest` query |
| `journey-scroll-rail` | Right progress indicator | Multi-region journey |
| `journey-nav` | Bottom nav Journey active | `/learn` with warm amber tab |

## Interaction Checks

- [ ] HUD region selector opens region overview sheet
- [ ] Map FAB opens region overview
- [ ] Node tap opens detail sheet; Start Lesson navigates correctly
- [ ] Locked node shows unlock checklist with check/lock icons
- [ ] Event banner links to `/world/events`
- [ ] Scroll rail thumb moves with scroll position
- [ ] Region unlock overlay dismisses on Continue
- [ ] Fox companion visible on current region only

## Accessibility

- [ ] HUD chips have `aria-label` with values
- [ ] Node buttons have descriptive `aria-label` (state + kind + title)
- [ ] Focus rings visible on interactive nodes and nav
- [ ] `prefers-reduced-motion`: no pulse animations on nodes/particles
- [ ] Text contrast on glass panels ≥ WCAG AA on darkest scrim regions

## Performance Guardrails

Targets from architecture rule:

| Metric | Target | Mitigation |
|--------|--------|------------|
| Initial load | < 2s | `artPriority` on current region only |
| Route change | < 300ms | No blocking art on locked regions beyond tier limit |
| Scroll | 60fps | `visualTier` degrades particles, parallax, celebration FX |
| Lighthouse | > 90 | WebP art, lazy load via `maxLoadedArtSections` |

Visual tier behavior: `features/journey/constants/journey-visual.constants.ts`

## Two-PR Rollout

### PR1 — Structure + tokens + temporary assets (this implementation)

- Mockup contract + art brief + validation docs
- HUD with streak/gem chips
- Scroll indicator rail
- Path spine stone styling
- Node scale hierarchy + current pin label
- Lesson detail locked checklist + next lesson preview
- Region transition overlay polish
- Event banner + branch glow
- Journey nav warm amber tokens

### PR2 — Final art swaps + polish

- Replace temp scroll art per region/state from art brief
- Refreshed node icon family (consistent painterly seals)
- Optional HUD ornament assets
- Nav texture variant tuned for amber active state
- Visual regression baseline committed
- Performance pass on low-tier devices

## Sign-off Checklist

Before marking mockup alignment complete:

- [ ] All 8 visual regression captures match contract acceptance matrix
- [ ] Art Director approves temp→final swap list
- [ ] No cool-blue Journey nav active state regression
- [ ] Path readable without reading lesson titles
- [ ] Locked/event/boss states distinguishable at a glance
