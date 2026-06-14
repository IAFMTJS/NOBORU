#!/usr/bin/env node
/**
 * Crop reference panels from canonical mockups into assets/_staging/mockup-refs/.
 *
 * Usage: npm run assets:crop-mockups
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "_staging", "mockup-refs");

const MARKETING = path.join(ROOT, "assets", "marketing");

/** @type {Record<string, string>} */
const SOURCES = {
  full_product: path.join(MARKETING, "mockup_full_product_ux_v1.png"),
  home_learn: path.join(MARKETING, "mockup_home_learn_flow_dark_v1.png"),
  navbar: path.join(MARKETING, "mockup_navbar_concepts_v1.png"),
  journey: path.join(MARKETING, "mockup_journey_core_flow_v1.png"),
  gamification: path.join(MARKETING, "mockup_gamification_screens_v1.png"),
};

/**
 * Crop definitions — tuned to 1536×1024 mockup grids.
 * @type {Array<{ id: string, source: keyof typeof SOURCES, region: { left: number, top: number, width: number, height: number } }>}
 */
const CROPS = [
  // home_learn_flow — 5 phone columns
  { id: "ref_camp_dawn_v1", source: "home_learn", region: { left: 6, top: 36, width: 298, height: 858 } },
  { id: "ref_camp_night_v1", source: "gamification", region: { left: 312, top: 44, width: 298, height: 458 } },

  // gamification — 5×2 grid (307×512 cells)
  { id: "ref_daily_quests_board_v1", source: "gamification", region: { left: 348, top: 118, width: 228, height: 210 } },
  { id: "ref_achievements_shrine_v1", source: "gamification", region: { left: 8, top: 44, width: 298, height: 458 } },
  { id: "ref_inventory_grid_v1", source: "gamification", region: { left: 312, top: 556, width: 298, height: 458 } },
  { id: "ref_seasonal_event_banner_v1", source: "gamification", region: { left: 1230, top: 556, width: 298, height: 458 } },

  // journey — 6×3 grid; panel 8 = world map (col 1 row 1)
  { id: "ref_journey_trail_scroll_v1", source: "gamification", region: { left: 928, top: 556, width: 248, height: 458 } },
  { id: "ref_journey_world_map_v1", source: "journey", region: { left: 262, top: 378, width: 248, height: 318 } },
  { id: "ref_journey_status_bar_v1", source: "home_learn", region: { left: 318, top: 36, width: 298, height: 72 } },

  // navbar — 2×5 grid (768×205 cells)
  { id: "ref_nav_pill_ember_night_v1", source: "navbar", region: { left: 8, top: 158, width: 752, height: 44 } },
  { id: "ref_nav_pill_trail_mist_v1", source: "navbar", region: { left: 776, top: 158, width: 752, height: 44 } },
  { id: "ref_nav_pill_bamboo_grove_v1", source: "navbar", region: { left: 776, top: 363, width: 752, height: 44 } },
  { id: "ref_nav_pill_moonlit_torii_v1", source: "navbar", region: { left: 8, top: 568, width: 752, height: 44 } },
  { id: "ref_nav_pill_stone_path_v1", source: "navbar", region: { left: 776, top: 773, width: 752, height: 44 } },
  { id: "ref_nav_pill_sakura_bloom_v1", source: "navbar", region: { left: 8, top: 568, width: 752, height: 44 } },
  { id: "ref_nav_pill_winter_summit_v1", source: "navbar", region: { left: 776, top: 773, width: 752, height: 44 } },
  { id: "ref_nav_pill_lantern_festival_v1", source: "navbar", region: { left: 8, top: 773, width: 752, height: 44 } },
  { id: "ref_nav_fox_camp_v1", source: "navbar", region: { left: 8, top: 48, width: 200, height: 108 } },

  // full_product — 3×6 section grid (sections 11–27)
  { id: "ref_dojo_hub_v1", source: "full_product", region: { left: 524, top: 44, width: 485, height: 310 } },
  { id: "ref_review_calm_v1", source: "full_product", region: { left: 40, top: 378, width: 485, height: 310 } },
];

async function cropPanel({ id, source, region }) {
  const input = SOURCES[source];
  const outPath = path.join(OUT_DIR, `${id}.png`);

  await sharp(input)
    .extract(region)
    .png()
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  return { id, outPath, width: meta.width, height: meta.height };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Cropping ${CROPS.length} mockup reference panels…\n`);

  const results = [];
  for (const crop of CROPS) {
    const result = await cropPanel(crop);
    results.push(result);
    console.log(`  ✓ ${result.id} (${result.width}×${result.height})`);
  }

  await writeFile(
    path.join(OUT_DIR, "crop-manifest.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), crops: results }, null, 2),
  );

  console.log(`\nDone — ${results.length} crops in assets/_staging/mockup-refs/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
