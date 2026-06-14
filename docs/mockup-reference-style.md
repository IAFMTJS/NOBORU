# Noboru Mockup Reference Style

Version: 1.0

Status: **BINDING — AUTHORITATIVE**

Effective: June 2026

Revocation: Only by explicit founder instruction. Until revoked, this document and its mockup assets override conflicting visual guidance in other docs, agents, or ad-hoc design decisions.

**Supersedes for visual execution:** prior mockup collections, informal design notes, and agent improvisation when they conflict with the four canonical mockups below.

**Related:** [art-direction.md](./art-direction.md), [design-system.md](./design-system.md), [.cursor/rules/visual-reference.mdc](../.cursor/rules/visual-reference.mdc), [.cursor/rules/uiux.mdc](../.cursor/rules/uiux.mdc)

---

## Purpose

These four mockups define Noboru's **canonical visual target**. Every screen, asset, illustration, icon, and UI component must converge toward this style until the founder explicitly replaces this reference set.

The goal is not pixel-perfect reproduction — it is **atmosphere, hierarchy, material language, and world coherence**.

**Brand test:** A screen or asset should be recognizable as Noboru without the logo. It should feel like the same mystical Japanese mountain journey shown in the mockups.

---

## Canonical Mockup Assets

All live in `assets/marketing/`. Design reference only — not served in production UI.

| ID | File | Coverage |
|----|------|----------|
| `mockup_navbar_concepts_v1` | `mockup_navbar_concepts_v1.png` | Bottom nav structure, pill shape, mascot integration, 10 themed skin variants, active glow states |
| `mockup_journey_core_flow_v1` | `mockup_journey_core_flow_v1.png` | Trail map, region transitions, weather/time variants, world map, lesson nodes, fog of war, status bar |
| `mockup_full_product_ux_v1` | `mockup_full_product_ux_v1.png` | Lessons, review, camp hub, feedback states, shop, social, streaks, settings, loading/empty/error |
| `mockup_gamification_screens_v1` | `mockup_gamification_screens_v1.png` | Achievements shrine, daily quests, region overview, checkpoints, inventory, memory book, seasonal events |

**Legacy mockups** (`mockup_product_*`, `mockup_supplementary_*`, `mockup_home_learn_flow_*`) remain useful for token-level layout but are **secondary** to the four canonical mockups above when they conflict.

---

## Core Visual Identity

### Theme: Mystical Japanese Mountain Journey

Noboru is a **dark, atmospheric, painterly adventure** — not a flat SaaS dashboard, not a cartoon language app, not a gacha game.

- **Setting:** Night forest, mountain trails, shrines, torii gates, stone lanterns, campfires, cherry blossoms, cloud seas, summits.
- **Art quality:** Soft illustrated concept-art backgrounds on primary screens. Premium, moody, immersive.
- **Metaphor:** Vertical ascent. Scrolling up = climbing. The glowing trail is the spine of the product.

### Emotional Target

Progress, wonder, calm focus, adventure, achievement — never stress, guilt, urgency, or corporate flatness.

---

## Color System

### Backgrounds (Dark Mode Primary)

| Role | Target | Notes |
|------|--------|-------|
| Deep base | `#0F1115` – near-black charcoal | Mountain Night foundation |
| Surface | `#171A21` | Nav shells, elevated panels |
| Card / overlay | `#1E232D` at 80–92% opacity | Glass panels over illustrated backgrounds |
| Midnight accent | Deep blue-green forest tones | Region atmospheres, night sky |

Design **dark mode first**. Light mode adapts the same atmosphere — do not invert into a generic white app.

### Functional Accent Colors

| Role | Color | Usage |
|------|-------|-------|
| **Trail glow / active progress** | Warm amber, gold, lantern orange | Active path, current node, interactive highlights, XP rewards |
| **Primary action** | Mountain Red `#D64045` | One primary CTA per screen — Continue, Start Lesson, Continue Climbing |
| **Success / mastery** | `#2FBF71` forest green | Completed nodes, progress bars, checkmarks |
| **Reward currency** | Purple/violet gems | Secondary economy — never primary actions |
| **Headings on dark** | Gold or warm orange, often all-caps | Section titles over illustrated backgrounds |
| **Body text** | White primary, light gray secondary | High contrast on dark overlays |

### Glow Rule

**Glow is functional, not decorative.**

Use warm orange/gold glow for: active trail segment, current lesson node, selected nav tab, milestone rewards, lantern/fire motifs. Do not sprinkle glow on inactive UI.

---

## Typography

| Role | Style | Usage |
|------|-------|-------|
| **Titles / story moments** | Elegant serif (storybook/traditional feel) | Region names, achievement titles, checkpoint announcements |
| **UI chrome & body** | Clean modern sans-serif (Inter) | Labels, buttons, lists, settings |
| **Japanese content** | Dedicated Japanese typeface (Noto Sans JP) | Kanji, kana, furigana — never Inter for Japanese glyphs |

Headings on illustrated screens: often uppercase, increased letter-spacing, gold or orange tint.

---

## Layout & Material Language

### Illustrated Backgrounds

Every **primary learner screen** should sit on a painterly environment — camp, trail, shrine, forest, summit — not a flat solid fill.

UI content floats on **dark semi-transparent glass panels** with:

- Rounded corners (16px cards, 12px buttons)
- Thin subtle borders (low-luminance white or gold at ~8–12% opacity)
- Soft inner depth — not heavy drop shadows in dark mode

### Information Hierarchy

1. Illustrated world (full bleed behind content)
2. Dark glass overlay / card for readable content
3. One primary action anchored to bottom safe area
4. Secondary stats and metadata de-emphasized (smaller, gray)

### Density

Breathable. Whitespace is intentional. One primary action per screen. Avoid card stacks that feel like a productivity app.

---

## Navigation (Binding)

Reference: `mockup_navbar_concepts_v1.png`

### Structure

- **5 tabs:** Camp, Journey, Dojo, World, Profile
- **Shape:** Pill-shaped floating bottom bar with high corner radius
- **Mascot:** Yama (white fox) overlaps the left edge of the bar — not a tiny icon, a character moment
- **Icons:** Minimalist thin-line — tent (Camp), mountains (Journey), torii (Dojo), pagoda/compass (World), fox/profile silhouette (Profile)
- **Active state:** Icon + label glow in theme accent color (orange default); optional dot/line indicator under label

### Theming

The nav bar is **skinable** — background texture, mascot pose, and accent glow change per context (ember night, sakura, bamboo, winter, etc.) while structure stays fixed. See mockup for 10 approved skin directions.

---

## Trail & Journey (Binding)

Reference: `mockup_journey_core_flow_v1.png`

### The Path

- Winding **stone staircase or trail** rendered as an illustrated spine
- **Active segment glows** warm orange/gold; completed segments stay lit; locked segments dim
- **Vertical scroll = climbing** — upward motion is the primary journey metaphor

### Lesson Nodes

- Circular nodes placed **on** the path (not a separate list)
- States: locked (dim + lock), available, in-progress (brighter + optional Yama), completed (green check or filled icon)
- Current node: largest glow, fox companion may appear beside it

### World Structure

- **Fog of war:** Future locked regions obscured by dark clouds/mist
- **Region transitions:** Cinematic full-screen illustrations (e.g., passing through torii gate)
- **Weather & time:** Same painterly style with shifted color temperature — sunny, rainy, night, snow, morning/evening
- **World map:** Zoomed-out mountain peaks — each peak = region/chapter

### Status Bar (Top)

- Circular avatar, display name, level
- Streak flame + gem/currency icons
- Sits over illustrated background with minimal chrome

---

## Camp & Hub Screens

Reference: `mockup_full_product_ux_v1.png` (section 16), `mockup_gamification_screens_v1.png`

### Camp (Home)

- Large **base camp illustration** — tent, campfire, torii leading to mountains
- Today's plan checklist, level progress bar, continue-learning card
- Quest board aesthetic for daily goals (wooden board in gamification mockup)

---

## Lesson & Study Surfaces

Reference: `mockup_full_product_ux_v1.png` (sections 12, 17)

- Focused single-objective layouts over dark glass
- Large Japanese characters for kanji/vocabulary
- Furigana/romaji secondary
- Review: Again / Hard / Good / Easy (or equivalent SRS) as distinct bottom actions
- Stroke order, listening, sentence order, conversation modes share the same dark glass + illustration backdrop language

---

## Feedback & Companion

Reference: `mockup_full_product_ux_v1.png` (sections 11, 13, 14), `mockup_gamification_screens_v1.png` (section 6)

### Yama Expressions (Required Set)

Teaching, Happy, Proud, Worried, Excited — plus weather variants (Sunny, Rainy, Night, Snowy) where contextually relevant.

### Answer Feedback

- **Correct:** Gold text (+XP), particle glow, fox joyful
- **Wrong:** Muted tone, encouraging copy, fox concerned — never punishing
- **Hearts/lives lost:** Cracked heart icon, calm recovery path

Yama is a **fellow climber**, not a lecturer. Appears at milestones, loading, celebrations — not every tap.

---

## Gamification Surfaces

Reference: `mockup_gamification_screens_v1.png`

| Screen | Visual Language |
|--------|-----------------|
| Achievement Shrine | Torii at night, circular badge grid, milestone counters |
| Daily Quest Camp | Fox by campfire, wooden quest board, streak timeline |
| Region Overview | Bottom sheet over dark map, thumbnails + progress per region |
| Lesson Complete | Glowing trail ahead, +XP, vocabulary learned panel |
| Checkpoint Shrine | Decorated shrine close-up, horizontal reward row (XP, gems, items) |
| Inventory | Tabbed grid — Items, Cosmetics, Trails — traditional motif icons |
| Memory Book | Weathered paper journal for "firsts" log |
| Seasonal Event | Sakura-covered path, countdown, event reward row |

Primary continuation button: deep desaturated red, rounded, full-width — **Continue Climbing**.

---

## Iconography

- **One family:** thin stroke, rounded caps, consistent weight
- **Color:** white or light gray default; gold/orange when active or on trail
- **No mixed packs:** no Lucide beside custom nav icons in production learner UI
- Achievement/badge icons: circular, illustrated, themed to climb motifs (lanterns, peaks, compasses)

---

## Motion & Atmosphere

- Soft particles: embers, sakura petals, fireflies, snow — sparingly, region-appropriate
- Fog, rain overlays, vignette depth on illustrated backgrounds
- Animations communicate state change (path lighting, node complete, level up) — never decorative bounce spam
- Honor `prefers-reduced-motion`: static illustrations + color state changes as fallback

---

## What Not To Do

- Flat gray cards on solid `#0F1115` with no illustrated world behind them on primary screens
- Generic SaaS dashboard layout (stat grids without atmosphere)
- Neon cyberpunk, harsh pure white backgrounds in dark mode, or unrelated anime styles
- Mixed icon libraries in learner navigation
- Streak as hero metric on home (show secondary — vision alignment)
- Chibi, corporate flat, or gacha-game visual language
- New visual directions invented by agents without mockup alignment

---

## Implementation Priority

When building or reviewing UI, compare against mockups in this order:

1. **Atmosphere** — Does it feel like the same mountain night world?
2. **Trail metaphor** — Is progress visualized as ascent/glow on a path?
3. **Material** — Dark glass over illustration, warm functional glow, one red CTA?
4. **Navigation** — Pill nav, mascot overlap, 5 tabs, themed skins?
5. **Typography & icons** — Serif titles, sans UI, thin-line icon family?
6. **Spacing & hierarchy** — Match mockup density, not pixel positions

---

## Agent & Rule Compliance

All visual agents must read this document before producing or approving assets:

- Art Director Agent (parent)
- UI Art, Icon, Mascot, Region Art, Achievement Art agents
- Theme Agent (tokens must support mockup palette and glass surfaces)
- Frontend Agent (when implementing screens)

Governance: [.cursor/rules/visual-reference.mdc](../.cursor/rules/visual-reference.mdc)

---

## Revocation Policy

This reference set remains binding **until the founder explicitly replaces it**. Replacing requires:

1. New canonical mockup set registered in [asset-registry.md](./asset-registry.md)
2. Updated version of this document or a successor doc
3. Explicit revocation statement — silent drift is not allowed

Until then: **when in doubt, match the mockups.**

---

## Noboru Mockup Principle

The mockups show a mountain people want to climb — beautiful enough to explore, clear enough to navigate, memorable enough to return. Every implementation step should move the live product toward that image, not away from it.

END OF mockup-reference-style.md
