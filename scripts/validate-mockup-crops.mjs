#!/usr/bin/env node
/**
 * Warns when expected mockup reference crops are missing from staging.
 *
 * Usage: npm run assets:validate-crops
 */
import { access } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const STAGING_DIR = path.join(ROOT, "assets", "_staging", "mockup-refs");

/** Keep in sync with assets/_staging/mockup-refs/README.md */
const EXPECTED_CROPS = [
  "ref_camp_night_v1",
  "ref_camp_dawn_v1",
  "ref_nav_pill_ember_night_v1",
  "ref_nav_pill_trail_mist_v1",
  "ref_nav_pill_bamboo_grove_v1",
  "ref_nav_pill_moonlit_torii_v1",
  "ref_nav_pill_stone_path_v1",
  "ref_nav_pill_sakura_bloom_v1",
  "ref_nav_pill_winter_summit_v1",
  "ref_nav_pill_lantern_festival_v1",
  "ref_nav_fox_camp_v1",
  "ref_journey_trail_scroll_v1",
  "ref_journey_world_map_v1",
  "ref_journey_status_bar_v1",
  "ref_dojo_hub_v1",
  "ref_review_calm_v1",
  "ref_achievements_shrine_v1",
  "ref_daily_quests_board_v1",
  "ref_inventory_grid_v1",
  "ref_seasonal_event_banner_v1",
];

const EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg"];

async function cropExists(baseName) {
  for (const ext of EXTENSIONS) {
    try {
      await access(path.join(STAGING_DIR, `${baseName}${ext}`));
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

const missing = [];

for (const crop of EXPECTED_CROPS) {
  if (!(await cropExists(crop))) {
    missing.push(crop);
  }
}

if (missing.length > 0) {
  console.warn(`Mockup crop validation: ${missing.length}/${EXPECTED_CROPS.length} expected crops missing:\n`);
  for (const crop of missing) {
    console.warn(`  - ${crop}.png (drop in assets/_staging/mockup-refs/)`);
  }
  console.warn("\nSee assets/_staging/mockup-refs/README.md for panel mapping.");
} else {
  console.log(`Mockup crop validation passed (${EXPECTED_CROPS.length} crops present).`);
}
