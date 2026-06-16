# Noboru Art Direction Reference Pack

This folder documents Noboru's visual identity and mockup boards so Cursor can generate UI art, backgrounds, icons, states, and screen layouts with consistent AAA fantasy adventure language.

## Single Source of Truth

**[08_visual_art_direction_master_spec.md](./08_visual_art_direction_master_spec.md)** — binding for:

- Visual positioning and forbidden styles
- Light/dark color system
- Generation rules (scope, transparent icons, dual theme variants)
- Kitsune companion rules
- Icon and UI style
- Art quality bar

Cursor rule: `.cursor/rules/visual-reference.mdc`

## Source Mockups (Supplementary)

**In repo (`assets/marketing/`):**

| File | Board |
|------|--------|
| `mockup_navbar_concepts_v1.png` | Bottom navigation — 10 style variants |
| `mockup_journey_core_flow_v1.png` | Journey trail map — progression, weather, day/night, locks, regions |
| `mockup_full_product_ux_v1.png` | Lessons, companion, rewards, camp, review, shop, social, settings, states |
| `mockup_gamification_screens_v1.png` | Achievement shrine, daily quests, inventory, memory book, seasonal events |

Legacy supplementary boards: `mockup_product_*`, `mockup_supplementary_dark_v1`, `mockup_home_learn_flow_dark_v1`.

**Do not** crop or ingest these mockups as production backgrounds. Use them as reference only; produce separate illustrated assets per [06_asset_inventory_and_naming.md](./06_asset_inventory_and_naming.md).

AI-generated style batches (not production building blocks) belong in `assets/marketing/generated-examples/` — never in `public/art/`.

## Document Map

- [08_visual_art_direction_master_spec.md](./08_visual_art_direction_master_spec.md) - **MASTER SPEC** — colors, generation rules, forbidden styles, companion, icons, quality bar.
- [00_global_visual_system.md](./00_global_visual_system.md) - legacy art bible: lighting, materials, screen detail (supplementary).
- [01_bottom_navigation.md](./01_bottom_navigation.md) - navbar concepts from Mockup 1.
- [02_journey_trails_and_world_map.md](./02_journey_trails_and_world_map.md) - trail paths, regions, nodes, weather.
- [03_learning_companion_rewards_states.md](./03_learning_companion_rewards_states.md) - lesson cards, companion emotions, rewards, states.
- [04_camp_inventory_memory_events.md](./04_camp_inventory_memory_events.md) - camp, shrine, inventory, memory book, events.
- [05_cursor_generation_brief.md](./05_cursor_generation_brief.md) - generation checklist, prompt prefix, acceptance criteria.
- [06_asset_inventory_and_naming.md](./06_asset_inventory_and_naming.md) - production checklist and file naming.
- [07_icon_catalog.md](./07_icon_catalog.md) - every icon: asset name, function, visual description.

## Global Non-Negotiables

1. Noboru is a **fantasy adventure game that teaches Japanese** — AAA stylized realism, not flat productivity SaaS.
2. **Generate only what is asked.** Never deviate from requested style.
3. **Icons: transparent background mandatory.** Light + dark variant mandatory for every generated asset.
4. Kitsune is a **companion**, not a cartoon mascot — stylized realism, intelligent, never chibi/clownish.
5. UI surfaces: stone, parchment, wood, dark lacquer, brass — layered depth, volumetric light.
6. Icons: fantasy game UI (shrine carvings, RPG inventory, quest markers) — not Material Icons or thin outline packs.
7. Forbidden styles: cartoon, chibi, kawaii, Duolingo, anime faces, flat design, SaaS dashboards, stock illustration.
8. Empty, loading, error, locked states still get full art.
9. **All new generated art saved to `Art Library/`** (`D:\NOBORU\Art Library`) — category subfolders required.
