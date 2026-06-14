#!/usr/bin/env node
/**
 * Generate production PNGs in assets/_staging/final-art/ from mockup reference crops.
 *
 * Usage: npm run assets:generate-mockup-art
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REFS = path.join(ROOT, "assets", "_staging", "mockup-refs");
const OUT = path.join(ROOT, "assets", "_staging", "final-art");

async function refExists(name) {
  try {
    await access(path.join(REFS, `${name}.png`));
    return true;
  } catch {
    return false;
  }
}

async function loadRef(name) {
  return readFile(path.join(REFS, `${name}.png`));
}

async function writeScene(id, buffer, width, height) {
  const outPath = path.join(OUT, `${id}.png`);
  await sharp(buffer)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${id} → ${width}×${height}`);
  return outPath;
}

async function writeSticker(id, buffer, size) {
  const outPath = path.join(OUT, `${id}.png`);
  await sharp(buffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${id} → ${size}×${size}`);
  return outPath;
}

async function writeTrailScroll(id, buffer, width, height) {
  const outPath = path.join(OUT, `${id}.png`);
  await sharp(buffer)
    .resize(width, height, { fit: "cover", position: "top" })
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${id} → ${width}×${height}`);
  return outPath;
}

/** Extract hero scene from full camp phone crop (strip UI chrome). */
async function main() {
  await mkdir(OUT, { recursive: true });

  console.log("Generating mockup production art from reference crops…\n");

  const tasks = [];

  if (await refExists("ref_camp_dawn_v1")) {
    const phone = await loadRef("ref_camp_dawn_v1");
    const meta = await sharp(phone).metadata();
    const h = meta.height ?? 858;
    const w = meta.width ?? 298;
    const hero = await sharp(phone)
      .extract({
        left: 0,
        top: Math.round(h * 0.1),
        width: w,
        height: Math.round(h * 0.48),
      })
      .toBuffer();
    tasks.push(writeScene("ui_camp_base_night_v2", hero, 800, 600));
    tasks.push(writeScene("ui_camp_base_light_v2", hero, 800, 600));
  }

  if (await refExists("ref_daily_quests_board_v1")) {
    const board = await loadRef("ref_daily_quests_board_v1");
    tasks.push(writeSticker("ui_quest_board_camp_overlay_v1", board, 512));
  }

  if (await refExists("ref_achievements_shrine_v1")) {
    const shrine = await loadRef("ref_achievements_shrine_v1");
    tasks.push(writeScene("ui_shrine_torii_night_v2", shrine, 800, 600));
  }

  if (await refExists("ref_journey_world_map_v1")) {
    const world = await loadRef("ref_journey_world_map_v1");
    tasks.push(writeScene("ui_world_map_peaks_v2", world, 800, 600));
  }

  if (await refExists("ref_dojo_hub_v1")) {
    const dojo = await loadRef("ref_dojo_hub_v1");
    tasks.push(writeScene("ui_dojo_forest_night_v2", dojo, 800, 600));
  }

  if (await refExists("ref_camp_night_v1")) {
    const campNight = await loadRef("ref_camp_night_v1");
    tasks.push(writeScene("ui_profile_lantern_path_v1", campNight, 800, 600));
  }

  if (await refExists("ref_review_calm_v1")) {
    const review = await loadRef("ref_review_calm_v1");
    tasks.push(writeScene("ui_review_atmosphere_v1", review, 800, 600));
    tasks.push(writeScene("ui_study_atmosphere_v1", review, 800, 600));
  }

  if (await refExists("ref_inventory_grid_v1")) {
    const inventory = await loadRef("ref_inventory_grid_v1");
    tasks.push(writeScene("ui_inventory_backpack_v1", inventory, 800, 600));
  }

  if (await refExists("ref_seasonal_event_banner_v1")) {
    const seasonal = await loadRef("ref_seasonal_event_banner_v1");
    tasks.push(writeScene("ui_seasonal_sakura_v1", seasonal, 800, 600));
    tasks.push(writeScene("ui_social_gathering_v1", seasonal, 800, 600));
  }

  if (await refExists("ref_achievements_shrine_v1")) {
    const memory = await loadRef("ref_achievements_shrine_v1");
    tasks.push(writeScene("ui_memory_book_journal_v1", memory, 800, 600));
  }

  if (await refExists("ref_journey_trail_scroll_v1")) {
    const scroll = await loadRef("ref_journey_trail_scroll_v1");
    tasks.push(writeTrailScroll("ui_trail_scroll_foothills_dark_v4", scroll, 1536, 5120));
    tasks.push(writeTrailScroll("ui_trail_scroll_foothills_light_v4", scroll, 1536, 5120));
    tasks.push(writeTrailScroll("ui_trail_scroll_forest-trail_dark_v4", scroll, 1536, 5120));
    tasks.push(writeTrailScroll("ui_trail_scroll_forest-trail_light_v4", scroll, 1536, 5120));
  }

  if (await refExists("ref_nav_fox_camp_v1")) {
    const fox = await loadRef("ref_nav_fox_camp_v1");
    tasks.push(writeSticker("yama_nav_camp_dark_v3", fox, 256));
    tasks.push(writeSticker("yama_nav_camp_light_v3", fox, 256));
    tasks.push(writeSticker("yama_trail_companion_dark_v2", fox, 256));
    tasks.push(writeSticker("yama_trail_companion_light_v2", fox, 256));
  }

  if (await refExists("ref_journey_world_map_v1")) {
    const node = await sharp(await loadRef("ref_journey_world_map_v1"))
      .extract({ left: 60, top: 40, width: 120, height: 120 })
      .toBuffer()
      .catch(() => null);
    if (node) {
      tasks.push(writeSticker("ui_node_lesson_circle_v1", node, 128));
      tasks.push(writeSticker("ui_node_checkpoint_circle_v1", node, 128));
      tasks.push(writeSticker("ui_node_trial_circle_v1", node, 128));
    }
  }

  await Promise.all(tasks);

  const manifest = {
    generated_at: new Date().toISOString(),
    note: "Run npm run assets:ingest-mockup after generation",
  };
  await writeFile(path.join(OUT, "generation-manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("\nDone — final art in assets/_staging/final-art/");
  console.log("Next: npm run assets:ingest-mockup");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
