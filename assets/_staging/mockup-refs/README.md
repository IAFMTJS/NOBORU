# Mockup Reference Crops

Controlled-generation reference panels cropped from canonical mockups. **Never served from `public/`** — staging only.

See [docs/mockup-art-workflow.md](../../../docs/mockup-art-workflow.md) and [docs/mockup-reference-style.md](../../../docs/mockup-reference-style.md).

## How to crop

1. Open the source mockup at native resolution.
2. Crop the panel listed below (include pill bar / hero / card chrome as shown).
3. Save as `{filename}.png` in this folder.
4. Run `npm run assets:validate-crops` to verify presence.

## Required crop filenames

| Crop filename | Source mockup | Panel / region |
|---------------|---------------|----------------|
| `ref_camp_night_v1` | `mockup_full_product_ux_v1` | Camp hub — greeting, continue card, quest strip |
| `ref_camp_dawn_v1` | `mockup_home_learn_flow_dark_v1` | Base camp expedition hero + stats row |
| `ref_nav_pill_ember_night_v1` | `mockup_navbar_concepts_v1` | Bottom pill — ember_night / Camp active glow |
| `ref_nav_pill_trail_mist_v1` | `mockup_navbar_concepts_v1` | Bottom pill — trail_mist / Journey active glow |
| `ref_nav_pill_bamboo_grove_v1` | `mockup_navbar_concepts_v1` | Bottom pill — bamboo_grove / Dojo active glow |
| `ref_nav_pill_moonlit_torii_v1` | `mockup_navbar_concepts_v1` | Bottom pill — moonlit_torii / World active glow |
| `ref_nav_pill_stone_path_v1` | `mockup_navbar_concepts_v1` | Bottom pill — stone_path / Profile active glow |
| `ref_nav_pill_sakura_bloom_v1` | `mockup_navbar_concepts_v1` | Bottom pill — sakura_bloom seasonal variant |
| `ref_nav_pill_winter_summit_v1` | `mockup_navbar_concepts_v1` | Bottom pill — winter_summit seasonal variant |
| `ref_nav_pill_lantern_festival_v1` | `mockup_navbar_concepts_v1` | Bottom pill — lantern_festival seasonal variant |
| `ref_nav_fox_camp_v1` | `mockup_navbar_concepts_v1` | Yama mascot overlap on left pill edge (Camp pose) |
| `ref_journey_trail_scroll_v1` | `mockup_journey_core_flow_v1` | Vertical trail map with nodes + fog |
| `ref_journey_world_map_v1` | `mockup_journey_core_flow_v1` | World / region picker overlay |
| `ref_journey_status_bar_v1` | `mockup_journey_core_flow_v1` | Weather, time, elevation status strip |
| `ref_dojo_hub_v1` | `mockup_full_product_ux_v1` | Dojo hub — kana / vocab / grammar tiles |
| `ref_review_calm_v1` | `mockup_full_product_ux_v1` | SRS review card — calm feedback state |
| `ref_achievements_shrine_v1` | `mockup_gamification_screens_v1` | Achievement shrine grid + lantern header |
| `ref_daily_quests_board_v1` | `mockup_gamification_screens_v1` | Daily quest board + XP reward chips |
| `ref_inventory_grid_v1` | `mockup_gamification_screens_v1` | Inventory / trail items grid |
| `ref_seasonal_event_banner_v1` | `mockup_gamification_screens_v1` | Seasonal event hero banner |

## Validation

```bash
npm run assets:validate-crops
```

Expected filenames are enforced by `scripts/validate-mockup-crops.mjs`.
