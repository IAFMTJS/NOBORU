/**
 * Installs mascot expansion PNGs from staging into the Noboru asset pipeline.
 *
 * Usage:
 *   node scripts/install-mascot-expansion-art.mjs [--from <stagingDir>] [--pack phase1]
 *
 * After install:
 *   npm run assets:stickers
 */
import { copyFile, mkdir, writeFile, access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const defaultStaging = path.join(root, "assets", "mascots", "_staging");

/** Phase 1 canonical assets — one flagship pose per new expression pack. */
const PHASE1_ASSETS = [
  {
    id: "yama_teaching_pointing_board_dark_v1",
    packId: "teaching",
    variant: "pointing_board",
    theme: "dark",
    expression: "teaching",
    name: "Yama Teaching Pointing Board Dark",
    tags: ["yama", "mascot", "teaching", "dark-mode", "expansion"],
    usage: ["lesson-intro", "tutorials", "checkpoint-instructions"],
  },
  {
    id: "yama_teaching_pointing_board_light_v1",
    packId: "teaching",
    variant: "pointing_board",
    theme: "light",
    expression: "teaching",
    name: "Yama Teaching Pointing Board Light",
    tags: ["yama", "mascot", "teaching", "light-mode", "expansion"],
    usage: ["lesson-intro", "tutorials", "checkpoint-instructions"],
  },
  {
    id: "yama_surprised_wide_eyes_dark_v1",
    packId: "surprised",
    variant: "wide_eyes",
    theme: "dark",
    expression: "surprised",
    name: "Yama Surprised Wide Eyes Dark",
    tags: ["yama", "mascot", "surprised", "dark-mode", "expansion"],
    usage: ["rare-achievements", "easter-eggs", "unexpected-events"],
  },
  {
    id: "yama_surprised_wide_eyes_light_v1",
    packId: "surprised",
    variant: "wide_eyes",
    theme: "light",
    expression: "surprised",
    name: "Yama Surprised Wide Eyes Light",
    tags: ["yama", "mascot", "surprised", "light-mode", "expansion"],
    usage: ["rare-achievements", "easter-eggs", "unexpected-events"],
  },
  {
    id: "yama_concerned_supportive_concern_dark_v1",
    packId: "concerned",
    variant: "supportive_concern",
    theme: "dark",
    expression: "concerned",
    name: "Yama Concerned Supportive Dark",
    tags: ["yama", "mascot", "concerned", "dark-mode", "expansion"],
    usage: ["inactivity", "repeated-mistakes", "streak-support"],
  },
  {
    id: "yama_concerned_supportive_concern_light_v1",
    packId: "concerned",
    variant: "supportive_concern",
    theme: "light",
    expression: "concerned",
    name: "Yama Concerned Supportive Light",
    tags: ["yama", "mascot", "concerned", "light-mode", "expansion"],
    usage: ["inactivity", "repeated-mistakes", "streak-support"],
  },
  {
    id: "yama_determined_ready_stance_dark_v1",
    packId: "determined",
    variant: "ready_stance",
    theme: "dark",
    expression: "determined",
    name: "Yama Determined Ready Stance Dark",
    tags: ["yama", "mascot", "determined", "dark-mode", "expansion"],
    usage: ["boss-challenges", "exams", "regional-trials"],
  },
  {
    id: "yama_determined_ready_stance_light_v1",
    packId: "determined",
    variant: "ready_stance",
    theme: "light",
    expression: "determined",
    name: "Yama Determined Ready Stance Light",
    tags: ["yama", "mascot", "determined", "light-mode", "expansion"],
    usage: ["boss-challenges", "exams", "regional-trials"],
  },
  {
    id: "yama_sleeping_resting_dark_v1",
    packId: "sleeping",
    variant: "resting",
    theme: "dark",
    expression: "sleeping",
    name: "Yama Sleeping Resting Dark",
    tags: ["yama", "mascot", "sleeping", "dark-mode", "expansion"],
    usage: ["offline", "idle", "night-events"],
  },
  {
    id: "yama_sleeping_resting_light_v1",
    packId: "sleeping",
    variant: "resting",
    theme: "light",
    expression: "sleeping",
    name: "Yama Sleeping Resting Light",
    tags: ["yama", "mascot", "sleeping", "light-mode", "expansion"],
    usage: ["offline", "idle", "night-events"],
  },
  {
    id: "yama_sad_supportive_disappointed_dark_v1",
    packId: "sad",
    variant: "supportive_disappointed",
    theme: "dark",
    expression: "sad",
    name: "Yama Sad Supportive Dark",
    tags: ["yama", "mascot", "sad", "dark-mode", "expansion"],
    usage: ["lost-streaks", "failed-challenges"],
  },
  {
    id: "yama_sad_supportive_disappointed_light_v1",
    packId: "sad",
    variant: "supportive_disappointed",
    theme: "light",
    expression: "sad",
    name: "Yama Sad Supportive Light",
    tags: ["yama", "mascot", "sad", "light-mode", "expansion"],
    usage: ["lost-streaks", "failed-challenges"],
  },
  {
    id: "yama_adventure_hiking_dark_v1",
    packId: "adventure",
    variant: "hiking",
    theme: "dark",
    expression: "adventure",
    name: "Yama Adventure Hiking Dark",
    tags: ["yama", "mascot", "adventure", "dark-mode", "expansion"],
    usage: ["journey", "explore", "trail-progress"],
  },
  {
    id: "yama_adventure_hiking_light_v1",
    packId: "adventure",
    variant: "hiking",
    theme: "light",
    expression: "adventure",
    name: "Yama Adventure Hiking Light",
    tags: ["yama", "mascot", "adventure", "light-mode", "expansion"],
    usage: ["journey", "explore", "trail-progress"],
  },
  {
    id: "yama_training_demo_stance_dark_v1",
    packId: "training",
    variant: "demo_stance",
    theme: "dark",
    expression: "training",
    name: "Yama Training Demo Stance Dark",
    tags: ["yama", "mascot", "training", "dark-mode", "expansion"],
    usage: ["training-grounds", "kana-dojo", "vocabulary-hall"],
  },
  {
    id: "yama_training_demo_stance_light_v1",
    packId: "training",
    variant: "demo_stance",
    theme: "light",
    expression: "training",
    name: "Yama Training Demo Stance Light",
    tags: ["yama", "mascot", "training", "light-mode", "expansion"],
    usage: ["training-grounds", "kana-dojo", "vocabulary-hall"],
  },
  {
    id: "yama_seasonal_cherry_blossom_dark_v1",
    packId: "seasonal",
    variant: "cherry_blossom",
    theme: "dark",
    expression: "seasonal",
    name: "Yama Seasonal Cherry Blossom Dark",
    tags: ["yama", "mascot", "seasonal", "spring", "dark-mode", "expansion"],
    usage: ["seasonal-events", "spring"],
  },
  {
    id: "yama_seasonal_cherry_blossom_light_v1",
    packId: "seasonal",
    variant: "cherry_blossom",
    theme: "light",
    expression: "seasonal",
    name: "Yama Seasonal Cherry Blossom Light",
    tags: ["yama", "mascot", "seasonal", "spring", "light-mode", "expansion"],
    usage: ["seasonal-events", "spring"],
  },
  {
    id: "yama_reward_presenting_badge_dark_v1",
    packId: "reward",
    variant: "presenting_badge",
    theme: "dark",
    expression: "reward",
    name: "Yama Reward Presenting Badge Dark",
    tags: ["yama", "mascot", "reward", "dark-mode", "expansion"],
    usage: ["achievements", "chests", "xp-rewards"],
  },
  {
    id: "yama_reward_presenting_badge_light_v1",
    packId: "reward",
    variant: "presenting_badge",
    theme: "light",
    expression: "reward",
    name: "Yama Reward Presenting Badge Light",
    tags: ["yama", "mascot", "reward", "light-mode", "expansion"],
    usage: ["achievements", "chests", "xp-rewards"],
  },
];

function metadata(asset) {
  const today = "2026-06-14";
  return {
    id: asset.id,
    name: asset.name,
    version: "v1",
    category: "mascots",
    pack_id: asset.packId,
    variant: asset.variant,
    theme: asset.theme,
    expression: asset.expression,
    owner_agent: "Mascot Agent",
    created_at: today,
    updated_at: today,
    status: "approved",
    tags: asset.tags,
    usage_locations: asset.usage,
    design_notes:
      "Mascot expansion Phase 1. Same canonical proportions, colors, scarf, and markings as yama_main. Transparent sticker via assets:stickers pipeline.",
    files: [`${asset.id}.png`, `${asset.id}.webp`],
  };
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const fromArg = process.argv.indexOf("--from");
  const stagingDir =
    fromArg >= 0 && process.argv[fromArg + 1]
      ? path.resolve(process.argv[fromArg + 1])
      : defaultStaging;

  await mkdir(stagingDir, { recursive: true });

  console.log(`Staging: ${stagingDir}`);
  console.log(`Installing ${PHASE1_ASSETS.length} Phase 1 mascot assets…`);

  let installed = 0;
  let missing = 0;
  const missingIds = [];

  for (const asset of PHASE1_ASSETS) {
    const src = path.join(stagingDir, `${asset.id}.png`);
    if (!(await fileExists(src))) {
      missing += 1;
      missingIds.push(asset.id);
      continue;
    }

    const dir = path.join(root, "assets", "mascots", asset.id);
    await mkdir(dir, { recursive: true });

    const dest = path.join(dir, `${asset.id}.png`);
    await copyFile(src, dest);
    await writeFile(
      path.join(dir, "metadata.json"),
      `${JSON.stringify(metadata(asset), null, 2)}\n`,
    );

    console.log(`Installed mascots/${asset.id}`);
    installed += 1;
  }

  console.log(`Done. ${installed} installed, ${missing} missing.`);
  if (missingIds.length > 0) {
    console.log("Missing staging files:");
    for (const id of missingIds) {
      console.log(`  - ${id}.png`);
    }
  }
  if (installed > 0) {
    console.log("Next: npm run assets:stickers");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
