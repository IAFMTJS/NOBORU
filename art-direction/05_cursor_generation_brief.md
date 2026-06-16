# 05 - Cursor Generation Brief

Use this file as the direct generation and implementation brief for Cursor. It condenses the art bible into actionable instructions and acceptance checks.

**Binding authority:** [08_visual_art_direction_master_spec.md](./08_visual_art_direction_master_spec.md) — read first for every generation request.

## One-Sentence Product Art Brief

Noboru is a AAA stylized-realism Japanese fantasy adventure where a magical kitsune companion guides the user through glowing lesson trails, lantern forests, shrine milestones, and tactile parchment/lacquer UI — teaching Japanese through exploration, not chores.

## Non-Negotiable Generation Rules

1. **Generate only what is asked.** No extra props, poses, or style experiments.
2. **Never deviate from the requested style.** Regenerate if output looks like Duolingo, Canva, flat SaaS, chibi, or stock art.
3. **Icons: transparent background only.** PNG/WebP with alpha — no baked backgrounds.
4. **Every asset: light + dark versions.** Same design, colors only change per master spec palettes.
5. **Naming:** `name_light_v1` and `name_dark_v1`.
6. **Save to `Art Library/`** — all new art files go to `D:\NOBORU\Art Library` with category subfolders (e.g. `Art Library/icons/`).
7. **Post-process icons for true alpha:** run `node scripts/art-direction/strip-icon-backgrounds.mjs "Art Library/icons"` — generators fake transparency; rembg produces real RGBA PNGs.

## Universal Prompt Prefix

Use this prefix before generating any Noboru screen, component, or asset:

> Premium AAA fantasy adventure UI for Noboru — stylized realism, mythological dreamlike Japan, NOT cartoon/chibi/kawaii/Duolingo/SaaS. Sacred mountain ascent with magical white-orange kitsune companion. Hand-crafted stone/parchment/wood/lacquer/brass UI with volumetric depth and soft glows. Transparent background for icons. Deliver both light mode (morning parchment palette) and dark mode (lantern forest night palette) versions — same design, colors only.

## Screen Generation Checklist

Every generated screen should answer:

- What is the environment: lantern forest, bamboo valley, river bridge, mist shrine, sky temple, camp, trail, memory book?
- Where is the kitsune companion, and what emotion/pose?
- What is the main light source (lantern, moonlight, campfire, spirit glow)?
- What is the active user action?
- Which UI material: dark lacquer, parchment, wood, stone, brass?
- Are progress, active, locked, complete, and reward states visually distinct?
- Does the screen include foreground, midground, and background depth?
- Are labels readable over the art?
- Does it avoid forbidden styles and forbidden colors from doc 08?

## Global Component Checklist

### Bottom Navigation

- 5 items — adventure equipment feel (scroll, lantern, shrine, backpack, compass, fox emblem).
- Icons above labels — fantasy game UI style, not thin outline app tabs.
- Active tab: Lantern Gold glow; inactive: `#8A857A`.
- Transparent icon assets with `_light` and `_dark` variants.

### Trail Map

- Winding path from bottom to top — glowing stepping stones.
- Current node larger and warmer; locked grey with padlock; completed Moss Green.
- Future path fogged but visible.
- Lesson labels: Lantern Trial, Shrine Challenge — not "Question 1 of 10".

### Lesson Card

- Material-based panel (lacquer/parchment/wood) — not flat white card.
- Title, trial type, topic, XP, duration, CTA.
- Background art visible behind panel.

### Reward Card

- Central reward object; Lantern Gold halo; sparks.
- Legendary items may use Spirit Violet accent.

### Empty/Loading State

- Kitsune illustration + scenic background + one clear action.
- Full art — never plain spinner on blank card.

## Required Asset Families

Each family item needs **light and dark** variants unless background art is theme-specific by nature.

1. Kitsune companion poses (see 08 — companion, not mascot)
2. Region backgrounds (Lantern Forest, Bamboo Valley, River Bridge, Mist Shrine, Sky Temple)
3. UI materials (dark lacquer, parchment, wood, stone, brass frames)
4. Icons (transparent PNG — full catalog in 07)
5. Inventory items, achievement badges, enemy/trial art

## Quality Bar

Cursor output is acceptable only if:

- It matches the **exact request** — no unasked additions.
- It is immediately recognizable as Noboru AAA fantasy — not generic language app.
- Kitsune design is consistent — stylized realism, intelligent, never chibi/clownish.
- Icons have transparent backgrounds and light/dark pairs.
- Active state is obvious before reading text.
- Screen remains readable at mobile size.
- Background art integrates with UI — not pasted behind flat cards.
- Locked and empty states still feel beautiful.
- No forbidden styles or forbidden hex colors from doc 08.

## Supplementary References

- Mockup boards: `assets/marketing/` — layout and screen inventory only
- Icon catalog: [07_icon_catalog.md](./07_icon_catalog.md)
- Asset naming: [06_asset_inventory_and_naming.md](./06_asset_inventory_and_naming.md)
- Master spec: [08_visual_art_direction_master_spec.md](./08_visual_art_direction_master_spec.md)
