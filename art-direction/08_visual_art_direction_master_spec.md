# 08 - Visual Art Direction Master Spec

**Status:** BINDING — SINGLE SOURCE OF TRUTH  
**Authority:** Overrides conflicting visual guidance in other docs unless explicitly revoked by founder.  
**Supersedes:** Color values and generation rules in `00_global_visual_system.md` where they conflict.

---

## Core Vision

Noboru is not a language learning app.

Noboru is a **fantasy adventure game that teaches Japanese**.

Every visual decision must reinforce:

- Exploration
- Discovery
- Wonder
- Progression
- Companion bond

The user is not completing lessons. The user is **climbing the sacred Noboru mountain together with a magical kitsune companion**.

---

## Generation Rules (Non-Negotiable)

These rules apply to **every asset generation request** in chat and in pipeline scripts.

1. **Generate only what is asked.** Do not add extra elements, alternate styles, or creative deviations unless explicitly requested.
2. **Never deviate from the asked style.** If output looks like Duolingo, Canva, Figma templates, stock illustration, SaaS, or generic mobile apps — regenerate.
3. **Icons and UI glyphs MUST use a transparent background.** No exceptions. No baked-in backgrounds, gradients, or scene context in icon files.
4. **Every generated asset requires two versions:**
   - **Light mode** — morning exploration palette (see Light Mode below)
   - **Dark mode** — night exploration palette (see Dark Mode below)
   - Same design and silhouette. **Only colors change** — not layout, not detail level, not composition.
5. **Naming:** append `_light` and `_dark` before version suffix, e.g. `icon_nav_journey_mountain_light_v1.png`, `icon_nav_journey_mountain_dark_v1.png`.
6. **Save location:** every new generated art file must be saved to **`Art Library/`** at repo root (`D:\NOBORU\Art Library`). Mirror category subfolders (`Art Library/icons/`, `Art Library/characters/kitsune/`, etc.). Production ingest into `assets/` or `public/` is a separate pipeline step — the Art Library is the authoritative staging archive for all new art.
7. **True transparency:** image generators output RGB with fake backgrounds. Post-process with `strip-icon-backgrounds.mjs` (rembg), then `audit-transparency.mjs`. Character sprites live in `Art Library/characters/kitsune/` — see `process-kitsune-companion.mjs`.

---

## Visual Positioning

### What Noboru IS

- Premium fantasy adventure
- Japanese mythology inspired
- Stylized realism
- AAA game concept art quality
- Companion-driven experience
- Living world
- Atmospheric
- Magical

**References:** Genshin Impact, Wuthering Waves, Ghost of Tsushima, Ori and the Will of the Wisps, Studio Ghibli environments, Princess Mononoke, Okami

### What Noboru is NOT — Forbidden Styles

- Cartoon
- Chibi
- Kawaii
- Duolingo
- Anime faces
- Generic mobile app illustrations
- Corporate vector art
- Flat design
- Material Design illustrations
- Modern SaaS dashboards
- Productivity app aesthetics
- Luxury coaching app aesthetics
- Crypto app aesthetics
- Stock illustration style
- Emoji style

---

## World Design

### World Theme

The world is a **magical version of Japan** — not historical Japan, not realistic Japan, not anime Japan. A mythological dreamlike Japan.

### Environmental Pillars

| Region | Motifs |
| --- | --- |
| **Lantern Forest** | Giant cedar trees, floating lantern spirits, warm orange glow, mist, hidden paths |
| **Bamboo Valley** | Massive bamboo, light shafts, ancient shrines, moss-covered stone |
| **River Bridge** | Waterfalls, koi fish, ancient wooden bridges, sakura leaves, mist |
| **Shrine** | Sacred fox statues, spirit gates, floating particles, white fog |
| **Sky Temple** | Above clouds, ancient architecture, celestial atmosphere |

---

## Kitsune Companion

### Core Rule

The kitsune is **NOT a mascot**. The kitsune is a **companion**. Every screen should feel like the kitsune lives in the world.

(In code and legacy assets the companion may still be referenced as Yama — treat as the same character.)

### Appearance — Required

- Stylized realism
- White-orange fur
- Magical markings
- Intelligent eyes
- Slightly oversized tail volume
- Soft fantasy glow

### Appearance — Forbidden

- Cartoon fox
- Cute mascot fox
- Real fox photograph
- Disney-style face
- Chibi proportions
- Humanized fox

### Personality

**Should appear:** Curious, Adventurous, Playful, Loyal, Intelligent

**Never:** Silly, Clownish, Hyperactive, Childish

### Animation Direction

Looking at shrines, sleeping near campfire, watching user progress, reacting to achievements, following trail, discovering secrets.

---

## UI Style

### Overall Feeling

The UI should feel like **AAA fantasy game interface** — not a mobile productivity application.

### Surfaces

**Use:** Stone, Parchment, Wood, Dark lacquer, Fabric, Brass

**Avoid:** Pure white cards, generic rounded rectangles, Material Design cards

### Depth

**Required:** Layering, Shadows, Volumetric lighting, Atmospheric depth, Soft glows

**Avoid:** Flat UI, Flat icons, Minimalist SaaS layouts

---

## Color System

**Theme name:** Noboru — Sacred Mountain Fantasy

### Light Mode

**Purpose:** Morning exploration, discovery, hope, progress. Warm parchment maps, handcrafted adventure journal. Never pure white. Never modern SaaS. Think: ancient map + watercolor painting + Japanese travel journal.

| Token | Hex | Use |
| --- | --- | --- |
| Main Background | `#F4EFE3` | Page backdrop |
| Secondary Background | `#E9E1D0` | Sections |
| Surface | `#F8F3E8` | Panels |
| Raised Surface | `#FFF9EF` | Elevated panels |
| Forest Green (Primary) | `#5E7357` | Primary brand |
| Mountain Sage (Secondary) | `#8A9B78` | Secondary UI |
| Text Primary | `#2B2A26` | Body |
| Text Secondary | `#5C574F` | Muted body |
| Text Disabled | `#9A9387` | Disabled |
| Lantern Gold | `#D6A85F` | Primary action, nav active, rewards |
| Fox Orange | `#C96B3D` | Companion, fox bond |
| Spirit Blue | `#7AA8C6` | Discovery, lore, shrines |
| Sakura Pink | `#D9A3A3` | Seasonal accent |
| Shrine Red | `#A94D3F` | Warnings, alerts |
| Moss Green | `#7B8D5A` | Progress, success, XP |

**Grading:** Warmer, more parchment, more watercolor, more sunlight, soft shadows, natural atmosphere.

### Dark Mode

**Purpose:** Night exploration, mystery, magic, spirit world, lantern forests, sacred shrines. Canonical Noboru experience. Think: Ghost of Tsushima night exploration. Not cyberpunk. Not black OLED theme.

| Token | Hex | Use |
| --- | --- | --- |
| Main Background | `#0D1320` | Page backdrop |
| Secondary Background | `#131D2D` | Sections |
| Surface | `#1A2434` | Panels |
| Raised Surface | `#243043` | Elevated panels |
| Lantern Gold (Primary) | `#D6A85F` | Primary brand / CTA |
| Moonlit Sage (Secondary) | `#8EAA8B` | Secondary UI |
| Text Primary | `#F4EEDF` | Body |
| Text Secondary | `#C9C0AF` | Muted body |
| Text Disabled | `#6C7482` | Disabled |
| Lantern Gold | `#D6A85F` | Primary action |
| Fox Orange | `#D17A47` | Companion |
| Spirit Blue | `#73A7D6` | Magic, discovery |
| Spirit Violet | `#8A78C7` | Epic / legendary rewards |
| Sakura Pink | `#C993A8` | Seasonal accent |
| Sacred Red | `#B05A4A` | Warnings, alerts |

**Grading:** More mist, more moonlight, more lantern glow, volumetric lighting, atmospheric depth.

### Accent Mapping

| Role | Color | Light Hex | Dark Hex |
| --- | --- | --- | --- |
| Progress / XP / success | Moss Green | `#7B8D5A` | `#7B8D5A` |
| Primary action / CTA | Lantern Gold | `#D6A85F` | `#D6A85F` |
| Companion / fox bond | Fox Orange | `#C96B3D` | `#D17A47` |
| Magic / discovery | Spirit Blue | `#7AA8C6` | `#73A7D6` |
| Rare / legendary | Spirit Violet | — | `#8A78C7` |
| Warning / danger | Shrine Red | `#A94D3F` | `#B05A4A` |

### Icon Color Rules

| State | Hex |
| --- | --- |
| Inactive | `#8A857A` |
| Hover | `#D6A85F` |
| Active | `#D6A85F` |
| Completed | `#7B8D5A` |
| Magic | `#73A7D6` |
| Legendary | `#8A78C7` |
| Danger | `#A94D3F` |

### Absolute Forbidden Colors

Never use in generated or implemented assets:

- `#00FFFF`
- `#FF00FF`
- `#0066FF`
- `#00FF00`
- `#FF0000`

These create modern SaaS, gaming RGB, crypto, or cyberpunk aesthetics that break Noboru's visual identity.

---

## Icon Style

### Required

Icons must look like **fantasy game UI** — hand-crafted symbols, shrine carvings, ancient map markers.

**References:** RPG inventory icons, quest markers, adventure game HUD

### Rendering

**Use:** Detailed silhouettes, slight depth, soft highlights, premium fantasy finish

**Avoid:** Flat SVG look, Material Icons, iOS SF Symbols style, outline-only icons, generic app icon packs

### Transparency

All icon files: **transparent background only**. Color variants are separate `_light` / `_dark` files, not separate background layers.

---

## Navigation Style

Navigation should feel like **adventure equipment** — scroll, lantern, shrine, backpack, compass, fox emblem — not application tabs.

---

## Lesson Art

Lessons are adventures.

**Never show:** Question 1 of 10

**Use instead:** Lantern Trial, Shrine Challenge, Scroll Discovery, Spirit Test, Mountain Trial

---

## Art Quality Requirements

All generated artwork must be:

- Cinematic
- High detail
- Stylized realism
- Premium game quality
- Consistent lighting
- Consistent color grading
- Consistent kitsune design

Every asset must look as if it belongs to the same AAA fantasy game universe.

If an asset looks like it belongs in Duolingo, Canva, Figma templates, stock illustration libraries, SaaS products, or generic mobile apps, it is **automatically incorrect** and must be regenerated.

---

## Supplementary References

When this spec does not define a screen layout detail, consult (in order):

1. This document (`08_visual_art_direction_master_spec.md`)
2. Canonical mockups in `assets/marketing/` and `docs/mockup-reference-style.md`
3. Legacy art bible sections in `00_global_visual_system.md` through `07_icon_catalog.md`

**On conflict:** This master spec wins.

---

## Related Documents

- [05_cursor_generation_brief.md](./05_cursor_generation_brief.md) — actionable generation checklist
- [07_icon_catalog.md](./07_icon_catalog.md) — icon inventory and naming
- [06_asset_inventory_and_naming.md](./06_asset_inventory_and_naming.md) — production asset checklist
- `.cursor/rules/visual-reference.mdc` — Cursor rule binding this spec
- `.cursor/rules/assets.mdc` — naming, metadata, dual-theme requirements
