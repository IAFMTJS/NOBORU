# Visual Acceptance Checklist

Binding reference: [mockup-reference-style.md](./mockup-reference-style.md)

Use this checklist for Art Director sign-off before marking any route **mockup-complete**.

Automated guards: `npm run qa:visual`, `npm run assets:alpha-qa`

Screenshot workflow: [screenshot-signoff-workflow.md](./screenshot-signoff-workflow.md)

## Per-asset checks

- [x] PNG/WebP pipeline with sticker alpha handling for light-fur mascots
- [x] Asset registered in `lib/assets/registry.ts` with correct path
- [x] `metadata.json` present under `assets/{category}/{id}/` (controlled-gen staging in `assets/_staging/mockup-refs/`)
- [x] Listed in `docs/asset-registry.md` when new category or ID added

## Per-route checks (Tier A)

Compare live screenshot side-by-side with mockup panel at 390×844. Run `npm run qa:signoff` after dropping PNGs in `assets/_staging/signoff/`.

| Route | Slug | Mockup panel | Screenshot | 7/7 DoD | AD |
|-------|------|--------------|------------|---------|-----|
| `/camp` | `camp` | home_learn HOME / UX §16 | [ ] | [ ] | pending |
| `/learn` (Foothills) | `learn-foothills` | journey §1 | [ ] | [ ] | pending |
| `/learn` (Forest Trail) | `learn-forest-trail` | journey §3 | [ ] | [ ] | pending |
| Navbar (Camp tab) | `navbar-camp` | navbar §1 ember_night | [ ] | [ ] | pending |
| `/world` | `world` | journey §8 | [ ] | [ ] | pending |
| `/profile` | `profile` | lantern path | [ ] | [ ] | pending |
| `/achievements` | `achievements` | gamification §1 | [ ] | [ ] | pending |
| `/dojo` | `dojo` | Product UX dojo | [ ] | [ ] | pending |

### DoD criteria (all 7 required)

| # | Criterion |
|---|-----------|
| 1 | Painterly full-bleed environment |
| 2 | Glass overlays composited in world |
| 3 | Gold serif `StoryTitle` section titles |
| 4 | One `PrimaryClimbButton` primary CTA |
| 5 | Clean sticker alpha |
| 6 | No Lucide on learner chrome |
| 7 | Composition matches mockup panel |

## Per-route checks (Tier B)

| Route | Pass |
|-------|------|
| `/learn/lesson/[id]` | [ ] AD sign-off pending |
| `/review` | [ ] AD sign-off pending |
| `/world/social` | [ ] AD sign-off pending |
| `/world/inventory` | [ ] AD sign-off pending |
| `/world/events` | [ ] AD sign-off pending |
| `/profile/memory-book` | [ ] AD sign-off pending |

## Per-route checks (Tier C)

| Route | Pass |
|-------|------|
| Content hubs (vocab/kanji/grammar/reading/listening) | [ ] AD sign-off pending |
| Hiragana / Katakana charts | [ ] AD sign-off pending |

## Global criteria (all Tier A/B)

1. Zero white rectangles on mascot/sticker assets
2. Zero Lucide icons on learner-primary chrome (`npm run qa:visual`)
3. One `PrimaryClimbButton` primary CTA where mockup shows one
4. Section titles use gold serif `StoryTitle` without `normal-case` / `text-white` overrides
5. Dedicated scene art — no region hero reused as stand-in for camp/shrine/shop
6. `prefers-reduced-motion` respected on particles and weather

## Sign-off

| Phase | Routes touched | Art Director | Date |
|-------|----------------|--------------|------|
| P0 | Nav, Journey header | Pending | |
| P1 | Camp, Dojo, Profile, Achievements | Pending | |
| P2 | Lesson, Review | Pending | |
| P3 | World, Shop, Nav skins | Pending | |
| P4 | Content hubs | Pending | |
