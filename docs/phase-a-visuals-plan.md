# Phase A — Visuals Plan

Version: 1.0

Status: IN PROGRESS (June 2026 — core deliverables implemented)

This document consolidates the visual audit (June 2026), mockup coverage review, and prioritized execution plan to close the gap between Noboru's **documented vision** and **current UI implementation**.

**Related documents:** [vision.md](./vision.md), [art-direction.md](./art-direction.md), [design-system.md](./design-system.md), [mvp-roadmap.md](./mvp-roadmap.md) (Phase 17), [asset-registry.md](./asset-registry.md), [.cursor/rules/uiux.mdc](../.cursor/rules/uiux.mdc)

---

## Purpose

Phase A brings Noboru from **token-level visual consistency** to **recognizable adventure identity** — the point where screens feel like a mountain expedition through Japan, not a generic learning PWA.

Phase A focuses on **art direction execution** and **mockup parity** for core learner surfaces. It does not replace learning-system or content work; it layers visual identity on top of existing architecture.

**Brand test:** Assets and screens should be recognizable as Noboru without the logo.

---

## Executive Summary

| Dimension | Vision target | Current state | Score |
|-----------|---------------|---------------|-------|
| Brand identity | Recognizable adventure world | Art + tokens wired to core screens | **7/10** |
| Mountain metaphor | Visual ascent, regions, landmarks | Trail map, region heroes, accent tokens | **7/10** |
| Premium calm UX | Apple polish, breathable | Consistent, calm, mobile-first | **7/10** |
| Yama companion | Painterly mascot, sparing use | Expressions on home empty, unlock, celebrations | **7/10** |
| Learning surfaces | Focused drills, ruby text, JLPT | Noto Sans JP, kanji rows, hub banners | **8/10** |
| Gamification visuals | Earned badges, elevation ascent | Illustrated badges + circular progress | **7/10** |
| Motion & delight | Purposeful, premium | Trail, lesson steps, achievement unlock | **7/10** |
| Screen completeness | Full nav product | 5-tab Explore hub; Games/Community linked | **8/10** |

**Overall visual alignment: ~75%**

**Foundation is sound.** Tokens, components, layout discipline, and Yama copy tone serve the vision. **Art direction execution** — region atmospheres, illustrated trails, achievement art, Japanese typography, custom iconography — is largely unbuilt.

---

## Vision Anchors (Non-Negotiable)

From [vision.md](./vision.md), [art-direction.md](./art-direction.md), and [uiux.mdc](../.cursor/rules/uiux.mdc):

- Noboru is a **journey of ascent**, not a lesson checklist or streak machine.
- Users should feel **"I am getting better"** — not guilt, FOMO, or chore completion.
- **Visual pillars:** Clarity, focus (one primary action), visible progress, restrained delight, consistency.
- **Dark mode first** — Mountain Night (`#0F1115` bg, `#171A21` surface, `#1E232D` cards).
- **Mountain Red** `#D64045` — primary actions, progress, elevation only.
- **Yama** climbs alongside — encourages, never nags. Appears at milestones, loading, onboarding — not every screen.
- **Forbidden emotions:** stress, pressure, urgency, guilt, corporate seriousness.
- **Educational progress is authoritative** — gamification visuals read learning data, never the reverse.

---

## Current State

### What aligns well

| Area | Evidence |
|------|----------|
| Design tokens | `app/globals.css` — Mountain Dawn/Night, semantic colors, motion tokens, light elevation shadows |
| Dark mode first | `ThemeProvider` defaults dark; surfaces match spec |
| Calm copy tone | Yama messages, quests, review feedback — steady ascent, no streak anxiety |
| Mobile shell | `max-w-lg`, bottom nav, safe-area padding, thumb-reachable CTAs |
| Yama asset | `assets/mascots/yama_main_*_v1.webp` — painterly, on-brand kitsune |
| Home structure | `ExpeditionHero` — region, trail, elevation, quests, continue CTA, Yama |
| Onboarding narrative | 7-step wizard with Yama, selection cards, Foothills reveal |
| Component system | ShadCN/Radix in `components/ui/`, consistent `PageContainer → ScreenHeader → Card` |
| Accessibility baseline | Ruby + `lang="ja"`, reduced-motion on Yama animations, focus rings |

### Critical gaps

| Gap | Vision | Reality |
|-----|--------|---------|
| Mountain expedition feel | Illustrated trails, shrines, lanterns, region moods | Card stacks + Lucide icons |
| Region identity | Unique visuals per region (Foothills → Master Summit) | Text descriptions only |
| Trail map | Stylized vertical climb / skill-tree path | List-based nodes with Check/Play/Lock |
| Achievement art | Illustrated circular badges, rarity tiers | Text inside colored `Badge` components |
| Japanese typography | Readable kanji at all sizes | Inter only; no `Noto Sans JP` |
| Auth branding | Wordmark, 登る subtitle, atmospheric background | Small Yama thumb + generic centered card |
| Hub differentiation | Distinct vocab/grammar/kanji/reading/listening layouts | Identical progress card + `ListRow` template |
| Dark mode depth | Premium layered surfaces | Elevation shadows disabled; flat cards |
| Motion | Framer Motion for purposeful feedback | CSS transitions + Yama float/celebrate only |
| Nav honesty | 6 tabs with real destinations | Games + Community are placeholders |
| Yama expressions | Distinct painterly sprites per mood | CSS transforms on single image |

### Key implementation files

| Layer | Paths |
|-------|-------|
| Tokens | `app/globals.css`, `tailwind.config.ts`, `lib/design-system/tokens.ts` |
| Layout | `app/(app)/layout.tsx`, `components/layout/bottom-nav.tsx`, `lib/navigation/primary-nav.ts` |
| Core screens | `features/learning/components/home-dashboard.tsx`, `expedition-hero.tsx`, `trail-map.tsx`, `learning-path-screen.tsx`, `lesson-player.tsx` |
| Review | `features/review/components/review-session.tsx` |
| Achievements | `features/achievements/components/achievement-badge.tsx` |
| Yama | `features/yama/components/*`, `components/media/mascot-image.tsx` |
| Onboarding / Auth | `features/onboarding/components/onboarding-wizard.tsx`, `app/(auth)/login/page.tsx` |
| Placeholders | `features/games/components/games-screen.tsx`, `features/community/components/community-screen.tsx` |

---

## Approved Mockup Inventory

All mockups live in `assets/marketing/` (design reference — not served in production).

| File | Coverage |
|------|----------|
| `mockup_product_dark_v1.png` | Home, Path Map, Lesson, Review, Vocabulary, Grammar, Progress, Profile (dark) |
| `mockup_product_light_v1.png` | Same 8 screens (light) |
| `mockup_supplementary_dark_v1.png` | Onboarding welcome, Login, Kanji list, Settings, Admin (dark) |
| `mockup_home_learn_flow_dark_v1.png` | Home base camp, trail-first Learn, node detail, region picker, all regions (dark) |

**Total unique screen types mocked: 18**

Registry: `mockup_product_collection_v1` in [asset-registry.md](./asset-registry.md).

### Mockup sufficiency

**Sufficient for Phase A core work** — color, spacing, card hierarchy, list patterns, Yama scale, CTA placement, and the illustrated path-map target are all drawable from existing art.

**Not sufficient for full `uiux.mdc` parity** without additional reference (see [Optional Mockups](#optional-mockups-to-add) below).

### Mockup vs implementation — highest-impact diffs

| Screen | Mockup shows | App shows today |
|--------|--------------|-----------------|
| Path Map | Illustrated vertical mountain trail, nodes on path | Trail-first Learn with minimal nodes + detail sheet (`trail-first-learn-screen.tsx`) |
| Home | Base camp greeting, continue card, quests, streak/XP stats | `ExpeditionHero` base camp layout — aligned to `mockup_home_learn_flow_dark_v1` |
| Progress | Circular gauge (64%), streak bar chart | Linear `ProgressBar` only |
| Profile achievements | Circular illustrated badges | Text `AchievementBadge` pills |
| Kanji list | Large kanji left, mastery % with arrow | `ListRow` template (shared with vocab/grammar) |
| Review | 3-button SRS (Again / Good / Easy) | Verify against current rating model |
| Bottom nav | 5 tabs: Home, Learn, Review, Explore, Profile | 6 tabs: Home, Learn, Review, Games, Community, Profile |

### IA decision required (before nav mockups)

Mockups use **5 tabs** with **Explore**. Implementation uses **6 tabs** with **Games** + **Community**.

**Choose one before Phase A nav polish:**

1. **Align app to mockups** — collapse Games/Community into Explore or tuck under Learn/Profile until built.
2. **Update mockups** — add Games + Community screens and revise primary nav art.

Phase A should not polish a 6-tab bar if the target IA is 5 tabs.

### Vision vs mockup drift (resolve explicitly)

Mockups emphasize **streak counters and bar charts** (e.g. 34-day streak on Progress/Profile). [vision.md](./vision.md) states streaks are **secondary** — learning is primary.

**Phase A rule:** Implement streak UI subtly (profile stat, not hero emphasis). Do not replicate mockup streak prominence unless product revises vision.

---

## Screen-by-Screen Audit

| Screen | Mockup? | Vision verdict | Phase A priority |
|--------|---------|----------------|------------------|
| Onboarding welcome | Yes | Good — strongest brand moment; add wordmark asset | P1 |
| Onboarding steps 2–7 | No | Fair — functional, not fully visualized | P2 (mockup) / P1 (polish) |
| Login | Yes | Fair — under-branded vs onboarding | P1 |
| Register / reset | No | Fair — generic | P2 |
| Home | Yes | Good structure, fair atmosphere | P1 |
| Learn / path map | Yes (+ `mockup_home_learn_flow_dark_v1`) | Good — trail-first default, region sheets | P1 (polish) |
| Region detail | No | Fair — text only | P1 |
| Lesson player | Yes | Good — focused drills | P2 (motion polish) |
| Review | Yes | Good — calm SRS | P2 (button styling vs mockup) |
| Vocabulary | Yes | Fair — correct pattern, generic | P2 |
| Grammar | Yes | Fair — same template | P2 |
| Kanji list | Yes | Fair — needs mockup-specific layout | P1 |
| Kanji detail | No | Not assessed | P2 |
| Reading / listening | No | Fair — hub template only | P2 |
| Progress | Yes | Fair — needs circular gauge option | P1 |
| Profile | Yes | Fair — needs illustrated achievements | P1 |
| Achievements showcase | Partial (profile row) | Weak | P1 |
| Trials | No | Fair — functional | P3 |
| Games | No | Placeholder | P3 / IA decision |
| Community | No | Placeholder | P3 / IA decision |
| Settings | Yes | Fair | P2 |
| Admin | Yes | Appropriate density | P3 |
| Celebration / empty / loading | No | Partial — Yama loading exists | P1 |

---

## Phase A Deliverables

Organized by priority. P0 = blocking brand recognition; P1 = high ROI; P2 = premium polish; P3 = defer or IA-dependent.

### P0 — Brand recognition (do first)

#### A1. Illustrated learning path / trail map

**Goal:** Learn and Home trail previews read as a **visual climb**, not a list.

**Reference:** `mockup_product_dark_v1.png` — Path Map panel.

**Work:**

- Redesign `features/learning/components/trail/trail-map.tsx` with vertical path spine, node positioning, connector lines on a subtle mountain silhouette or region atmosphere.
- Support states: locked, available, in-progress, completed (keep existing `TrailNodeState` logic).
- Apply on `/learn`, region screens, and Home trail preview in `ExpeditionHero`.
- Respect `prefers-reduced-motion`; path is static illustration + state color, not continuous animation.

**Definition of done:** User describes the learn screen as a "trail" or "map" without prompting. Path is not a plain stacked list.

---

#### A2. Region visual identity system

**Goal:** Each region has color accent, mood, and optional hero art per [art-direction.md](./art-direction.md).

**Regions:** Foothills, Forest Trail, Mount N5–N1, Master Summit.

**Work:**

- Define region tokens (accent color, gradient, optional background pattern) in `lib/design-system/` or feature constants.
- Apply to region cards on Learn, region detail (`region-units-screen.tsx`), and Home hero.
- Register region assets in [asset-registry.md](./asset-registry.md) as they are created (`assets/regions/`).

**Minimum viable (Phase A):** Per-region accent + gradient atmosphere without full illustration.

**Stretch:** Hero illustration per region.

---

#### A3. Achievement badge artwork

**Goal:** Achievements feel **earned**, not like text labels.

**Reference:** Profile panel in product mockups — circular illustrated badges.

**Work:**

- Create badge art pipeline (even 6–8 starter badges covering common, rare, legendary).
- Replace or augment `achievement-badge.tsx` with image-based badges + rarity ring/glow.
- Profile row and `/achievements` showcase use same component.
- Tiered celebration in `yama-celebration.tsx` for minor / major / legendary unlocks.

---

### P1 — Mockup parity (core surfaces)

#### A4. Japanese typography

**Goal:** Kanji and kana render with appropriate weight and readability.

**Work:**

- Add `Noto Sans JP` (or Source Han Sans) via `next/font` for `lang="ja"` content.
- Apply in `japanese-text.tsx`, kanji list leading characters, lesson teach cards.
- Keep Inter for UI chrome and English.

---

#### A5. Home dashboard visual refresh

**Goal:** Home matches mockup expedition feel — level card, quest accent, one primary CTA.

**Reference:** Dashboard panel in product mockups.

**Work:**

- Refine `ExpeditionHero`: quest card with active red accent border, larger Yama, clearer level/progress hierarchy.
- Ensure home shows: region, trail, progress, daily goals, continue learning, elevation, recent achievements, review queue (per uiux.mdc).
- Reduce competing primary buttons to one per screen.

---

#### A6. Kanji list layout

**Goal:** Kanji screen matches supplementary mockup — large character, readings, mastery indicator.

**Reference:** `mockup_supplementary_dark_v1.png` — Kanji list.

**Work:**

- Dedicated kanji list row component (large kanji left, on/kun + meaning center, mastery % or ring right).
- JLPT filter tabs (`jlpt-tabs.tsx`) prominent at top.
- Do not reuse generic `ListRow` for kanji primary view.

---

#### A7. Progress visualization

**Goal:** Progress feels like watching a climb, not reading stats.

**Reference:** Progress panel — circular overall gauge + domain breakdown.

**Work:**

- Add circular progress component for overall mastery on `progress-dashboard.tsx`.
- Keep linear bars for domain breakdown.
- Streak: show as secondary stat only (vision alignment).

---

#### A8. Auth & onboarding brand pass

**Goal:** Auth continues the expedition begun in onboarding.

**Reference:** Supplementary login + onboarding welcome mockups.

**Work:**

- NOBORU wordmark + 登る subtitle on auth screens (asset needed if not in repo).
- Login: centered Yama, "Welcome back, Climber", card form — match supplementary layout.
- Onboarding step 1: full-body Yama on peak (mockup shows larger illustration than current 128px).
- Subtle Mountain Night background texture on auth layout (`app/(auth)/layout.tsx`).

---

#### A9. Celebration, empty, and loading states

**Goal:** Every state teaches or rewards calmly.

**Work:**

- Yama-forward empty states on review queue, achievements, trails (extend `empty-state.tsx` pattern).
- Lesson complete, achievement unlock, quest complete — use `YamaCelebration` with tier-appropriate treatment.
- Ensure `YamaLoading` used on all core route loading boundaries.

---

#### A10. Dark mode depth

**Goal:** Mountain Night feels premium, not flat.

**Work:**

- Introduce subtle surface layering in dark mode: border luminance, `primary/5` washes, or very soft inner highlights — without reintroducing heavy shadows.
- Cards should separate from background without relying on light-mode-only elevation.

---

### P2 — Premium polish

#### A11. Yama expression sprite set

Replace CSS-only expressions (`yama.constants.ts` scale/rotate) with distinct assets: happy, celebrating, encouraging, thinking, loading. Register in asset pipeline.

#### A12. Framer Motion integration

Per [animations.mdc](../.cursor/rules/animations.mdc): lesson step transitions, trail node completion, achievement unlock. Centralize reduced-motion checks.

#### A13. Hub differentiation

Distinct visual treatment for vocabulary, grammar, reading, listening hubs while sharing components underneath.

#### A14. Content detail screens

Kanji detail (stroke order area), vocabulary detail, grammar detail — layout reference needed (mockups or new art).

#### A15. Settings & supplementary light mode

Settings matches supplementary dark mockup; add light-mode supplementary reference if parity checks are required.

---

### P3 — IA-dependent / post-MVP

#### A16. Navigation resolution

Implement chosen 5- or 6-tab model; hide or merge placeholder tabs until surfaces exist.

#### A17. Games, Community, Trials visuals

Defer until features ship; MVP roadmap explicitly excludes Community and advanced Games.

#### A18. Admin visual pass

Operational clarity sufficient; optional polish pass after learner surfaces.

---

## Optional Mockups to Add

Add these if full `uiux.mdc` drawable reference is required:

| Priority | Screen | Why |
|----------|--------|-----|
| High | Onboarding steps 2–7 | Only welcome is mocked |
| High | Register + password reset | Auth flow incomplete |
| High | Kanji / vocab / grammar detail | Detail layouts unspecified |
| High | Lesson complete / achievement unlock | Celebration moments |
| Medium | Reading + listening (hub + one player) | No reference today |
| Medium | Region detail (e.g. Foothills units) | Between abstract path map and list |
| Medium | Review empty + error states | State design |
| Low | Hiragana / Katakana | Learn sub-routes |
| Low | Trials player | Partially built |
| Low | Games + Community | IA-dependent |
| Low | Light supplementary | Dark-only supplementary today |
| Low | Feedback screen | Beta-only surface |

**Phase A can proceed without these** — existing three mockups plus art-direction docs are enough for P0–P1.

---

## Asset Inventory (Current)

| Asset | Path |
|-------|------|
| Yama dark | `assets/mascots/yama_main_dark_v1/yama_main_dark_v1.webp` |
| Yama light | `assets/mascots/yama_main_light_v1/yama_main_light_v1.webp` |
| Yama expressions (dark) | `assets/mascots/yama_*_dark_v1/` — happy, celebrating, encouraging, thinking, loading |
| Achievement badges (7) | `assets/achievements/achievement_*_v1/` |
| Region heroes (8) | `assets/regions/region_*_v1/` |
| Trail spine UI | `assets/ui/ui_trail_spine_{dark,light}_v1/` |
| Auth atmosphere | `assets/ui/ui_auth_atmosphere_dark_v1/` |
| Wordmark | `assets/brand/brand_wordmark_dark_v1/` |
| App icons | `assets/icons/icon_app_*_v1/` |
| Product mockups | `assets/marketing/mockup_product_*.png`, `mockup_supplementary_dark_v1.png` |

**Registry:** `lib/assets/registry.ts` — `getAchievementArtPath`, `getRegionArtPath`, `getYamaExpressionPath`, `getTrailSpinePath`.

**Completed (June 2026 follow-up):** light Yama expressions, dark v2 expression refresh, light/dark wordmark + auth atmosphere, Noboru SVG nav icon family, WebP optimization (`npm run assets:webp`), transparent sticker processing (`npm run assets:stickers`).

**Asset pipeline:** Sticker assets (achievements, Yama expressions, wordmarks, trail spine) must be processed with `npm run assets:stickers` after adding PNG sources — removes solid letterbox backgrounds to alpha WebP. Hero mascots (`yama_main_*`) and full-scene art (regions, auth atmosphere) keep their backgrounds intentionally.

---

## Alignment Map

```
High strategic importance
│
│  [Region Art]     [Trail Map]     [Achievement Art]
│  [Japanese Font]  [Home Refresh]  [Kanji Layout]
│
│  [Yama Sprites]   [Motion]        [Hub Diff]
│  [Auth Brand]     [Dark Depth]
│
│  [Games/Community]  [Admin polish]
│
└──────────────────────────────────────────►
         Low visual execution    High visual execution
```

---

## Execution Order (Suggested Sprints)

### Sprint 1 — Trail & regions (P0)

1. A1 Illustrated trail map
2. A2 Region accent system (minimum viable)
3. IA decision on nav (A16 — decision only, implement in Sprint 3)

### Sprint 2 — Identity & typography (P0–P1)

4. A3 Achievement badge artwork (starter set)
5. A4 Japanese typography
6. A6 Kanji list layout

### Sprint 3 — Core screen parity (P1)

7. A5 Home dashboard refresh
8. A7 Progress visualization
9. A8 Auth & onboarding brand pass
10. A16 Nav implementation per IA decision

### Sprint 4 — States & atmosphere (P1–P2)

11. A9 Celebration / empty / loading states
12. A10 Dark mode depth
13. A11 Yama expression sprites (if assets ready)

### Sprint 5 — Polish (P2)

14. A12 Framer Motion (scoped to trail, lesson, achievements)
15. A13 Hub differentiation
16. A14 Detail screens (as mockups become available)

---

## Definition of Done (Phase A)

Phase A is complete when:

- [x] Learning path is a **visual trail**, not a list — on Home and Learn
- [x] At least **Foothills + one JLPT region** have distinct visual identity (accent/gradient minimum)
- [x] Achievements render as **illustrated badges**, not text pills, on Profile and Achievements
- [x] Japanese content uses a **dedicated Japanese typeface**
- [x] Kanji list matches supplementary mockup layout pattern
- [x] Home, Login, and Onboarding welcome align with approved mockups at spacing/hierarchy level
- [x] Progress dashboard includes **circular overall mastery** visualization
- [x] Dark mode has intentional **surface depth** without harsh shadows
- [x] Empty, loading, and major celebration states use **Yama** appropriately
- [x] Nav matches **resolved IA** (5-tab Explore; Games/Community via Explore hub)
- [x] Streak UI remains **secondary** per vision (even if mockups show it prominently)
- [x] All new assets registered in [asset-registry.md](./asset-registry.md)
- [x] No hardcoded hex outside design tokens
- [x] `prefers-reduced-motion` honored on new animations

---

## Success Criteria

Users and reviewers should say:

- "This feels like climbing a mountain" — not "this feels like Duolingo" or "generic SaaS."
- Yama and Mountain Red are recognizable brand anchors.
- Screens match approved mockups in **hierarchy and atmosphere** (pixel-perfect not required).
- Core loop (home → learn → lesson → review → progress) is visually cohesive in dark and light mode.

---

## Failure Criteria (Stop and Refactor)

- Trail remains a Lucide-icon list after Phase A
- Achievements still text-only badges
- Six bottom tabs with two empty placeholder destinations
- Streak becomes the hero metric on Home or Progress
- Decorative motion on study screens without feedback purpose
- Region cards indistinguishable from each other
- New assets created outside [art-direction.md](./art-direction.md) or asset pipeline

---

## References

| Resource | Path |
|----------|------|
| Primary dark mockup | `assets/marketing/mockup_product_dark_v1.png` |
| Primary light mockup | `assets/marketing/mockup_product_light_v1.png` |
| Supplementary mockup | `assets/marketing/mockup_supplementary_dark_v1.png` |
| UI/UX authority | `.cursor/rules/uiux.mdc` |
| Art direction | `docs/art-direction.md` |
| Design system | `docs/design-system.md` |
| Related MVP phase | `docs/mvp-roadmap.md` — Phase 17 Immersive Learning & Trail Experience |

---

## Phase A Principle

Every screen is another step upward. Phase A paints the scenery on a trail that already has solid engineering footings — clear, reliable, and worthy of the climb.
