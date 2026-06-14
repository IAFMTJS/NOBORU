# Visual Acceptance Checklist

Binding reference: [mockup-reference-style.md](./mockup-reference-style.md)

Use this checklist for Art Director sign-off before marking any route **mockup-complete**.

## Per-asset checks

- [ ] PNG/WebP has clean alpha (no white or grey halos on stickers)
- [ ] Asset registered in `lib/assets/registry.ts` with correct path
- [ ] `metadata.json` present under `assets/{category}/{id}/`
- [ ] Listed in `docs/asset-registry.md` when new category or ID added

## Per-route checks (Tier A)

Compare live screenshot side-by-side with mockup panel.

| Route | Mockup panel | Pass |
|-------|--------------|------|
| `/camp` | Product UX §16 | [ ] |
| `/learn` | Journey core flow | [ ] |
| `/dojo` | Product UX dojo | [ ] |
| `/world` | Product UX world | [ ] |
| `/profile` | Product UX profile | [ ] |
| `/achievements` | Gamification §1 | [ ] |
| Navbar (all tabs) | Navbar concepts | [ ] |

## Per-route checks (Tier B)

| Route | Pass |
|-------|------|
| `/learn/lesson/[id]` | [ ] |
| `/review` | [ ] |

## Global criteria (all Tier A/B)

1. Zero white rectangles on mascot/sticker assets
2. Zero Lucide icons on learner-primary chrome
3. One `PrimaryClimbButton` primary CTA where mockup shows one
4. Section titles use gold serif `StoryTitle` without `normal-case` / `text-white` overrides
5. Dedicated scene art — no region hero reused as stand-in for camp/shrine/shop
6. `prefers-reduced-motion` respected on particles and weather

## Sign-off

| Phase | Routes touched | Art Director | Date |
|-------|----------------|--------------|------|
| P0 | Nav, Journey header | | |
| P1 | Camp, Dojo, Profile, Achievements | | |
| P2 | Lesson, Review | | |
| P3 | World, Shop, Nav skins | | |
| P4 | Content hubs | | |
