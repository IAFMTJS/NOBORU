# Journey Mockup Contract

Version: 1.0  
Status: Implementation reference for mockup alignment  
Canonical refs: `docs/mockup-reference-style.md`, `art-direction/02_journey_trails_and_world_map.md`

## Purpose

Measurable UI contract derived from the canonical Journey mockup. Engineering and art use this to evaluate parity without pixel-copying.

## Layout Tokens

| Token | Target | Notes |
|-------|--------|-------|
| `hudHeight` | 52–56px | Glass bar, full width minus 12px inset |
| `hudTopInset` | 12px | Safe from status bar |
| `nodeSizeCurrent` | 68px | Largest ring on path |
| `nodeSizeDefault` | 52px | Standard lesson node |
| `nodeSizeLocked` | 44px | Dimmed, grayscale |
| `scrollRailWidth` | 4px | Right-edge progress rail |
| `scrollRailDot` | 6px | Region/section markers |
| `bottomNavClearance` | 5.5rem + safe-area | Journey content padding |
| `glassBorder` | white/10–15% | HUD and cards |
| `glassBg` | black/40–55% + blur | Over illustrated art |

## Color & Glow

| Role | Token | Usage |
|------|-------|-------|
| Active path | `--trail-glow` warm amber | Completed + current segments only |
| Primary CTA | Mountain Red `--primary` | One per overlay |
| Success | `--success` | Completed nodes |
| Boss | red-orange local atmosphere | Trial nodes only |
| Event | pink/sakura accent | Event branch only |
| Nav active (Journey) | amber/gold | Not cool blue |

**Glow rule:** functional only on active trail, current node, selected nav tab.

## HUD Composition

```
[Avatar]  [Region ▼]  [Lv N4] [🔥 streak] [💎 gems]
```

- Avatar: circular, links to profile
- Region: serif uppercase title, opens region overview
- Level: caption, de-emphasized
- Streak/gem chips: compact pills, icon + number

## Path Visual Language

1. **Stone trail first** — painted path in scroll art; synthetic spine only when art absent
2. **Nodes on path** — center anchor at spine coordinate, no floating offset
3. **Current node** — largest scale, warm halo, optional companion offset
4. **Completed** — green check or warm filled stone, continuous lit chain behind
5. **Locked** — desaturated, fog overlay, lock icon, requirement copy on tap

## State Matrix

| State | Path | Node | Overlay | Acceptance |
|-------|------|------|---------|------------|
| `default` | Warm stones, active segment glow | Current largest | HUD + scroll rail | User sees "I am here" without text |
| `selected` | Same | Selected ring + scale | Lesson detail sheet | Scene preview, XP, duration, red CTA |
| `locked` | Dim + fog upslope | Lock icon, reduced opacity | Unlock checklist sheet | Requirements listed with checkmarks |
| `event` | Pink branch accent | Sakura node | Countdown + progress card | Distinct from main trail |
| `boss` | Red ember atmosphere | Large boss seal | Lock requirement card | Dominates local viewport |
| `regionTransition` | Torii framing | Minimal nodes | Cinematic overlay | Fog peel → gate reveal → continue |
| `scrollDiscover` | Full region height | Many nodes visible | Right rail + map FAB | World continues beyond viewport |

## Screenshot Checklist

- [ ] HUD readable over brightest art regions
- [ ] Current node centered or dominant in viewport on load
- [ ] Path reads bottom-to-top ascent
- [ ] Locked future visibly dimmed but still discoverable
- [ ] Event branch visually distinct (pink/sakura)
- [ ] Boss node larger and red-themed
- [ ] Bottom nav Journey tab warm amber, fox overlaps active tab
- [ ] Lesson detail: rewards row + red Start Lesson
- [ ] Region unlock: torii/gate cinematic, minimal chrome
- [ ] No flat gray-only screen without illustrated world

## Implementation Map

| Contract area | Primary files |
|---------------|---------------|
| HUD | `journey-hud.tsx`, `journey-mockup.constants.ts` |
| Scroll rail | `journey-scroll-indicator.tsx`, `journey-world-scroll.tsx` |
| Path | `journey-path-spine.tsx`, `journey-region-section.tsx` |
| Nodes | `world-lesson-node.tsx`, `journey-path-node.tsx` |
| Overlays | `lesson-node-detail-sheet.tsx`, `region-unlock-overlay.tsx` |
| Event | `journey-event-banner.tsx`, `event-trail-branch.tsx` |
| Nav | `immersive-nav.constants.ts` |
