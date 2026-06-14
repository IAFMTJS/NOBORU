# Visual Acceptance Checklist

Binding reference: [mockup-reference-style.md](./mockup-reference-style.md)

Use this checklist for Art Director sign-off before marking any route **mockup-complete**.

Automated guard: `npm run qa:visual` (Lucide in learner features, StoryTitle overrides).

## Per-asset checks

- [x] PNG/WebP pipeline with sticker alpha handling for light-fur mascots
- [x] Asset registered in `lib/assets/registry.ts` with correct path
- [x] `metadata.json` present under `assets/{category}/{id}/` (controlled-gen staging in `assets/_staging/mockup-refs/`)
- [x] Listed in `docs/asset-registry.md` when new category or ID added

## Per-route checks (Tier A)

Compare live screenshot side-by-side with mockup panel at 390×844.

| Route | Mockup panel | Pass |
|-------|--------------|------|
| `/camp` | Product UX §16 | [ ] AD sign-off pending |
| `/learn` | Journey core flow | [ ] AD sign-off pending |
| `/dojo` | Product UX dojo | [ ] AD sign-off pending |
| `/world` | Product UX world | [ ] AD sign-off pending |
| `/profile` | Product UX profile | [ ] AD sign-off pending |
| `/achievements` | Gamification §1 | [ ] AD sign-off pending |
| Navbar (all tabs) | Navbar concepts | [ ] AD sign-off pending |

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
