/**
 * Installs flat PNG staging files into the Noboru asset pipeline structure,
 * writes metadata.json, and optionally processes to WebP.
 *
 * Usage: node scripts/install-minigame-art.mjs [--from <stagingDir>]
 */
import { copyFile, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const defaultStaging = path.join(
  process.env.USERPROFILE ?? "",
  ".cursor",
  "projects",
  "d-NOBORU",
  "assets",
);

const ASSETS = [
  {
    id: "game_memory_dungeon_v1",
    category: "games",
    name: "Game Memory Dungeon",
    tags: ["game", "mini-game", "memory-dungeon"],
    usage: ["explore", "games-hub", "memory-dungeon-player"],
  },
  {
    id: "game_reading_challenge_v1",
    category: "games",
    name: "Game Reading Challenge",
    tags: ["game", "mini-game", "reading-challenge", "coming-soon"],
    usage: ["explore", "games-hub"],
  },
  {
    id: "game_word_match_v1",
    category: "games",
    name: "Game Word Match",
    tags: ["game", "mini-game", "word-match"],
    usage: ["explore", "games-hub"],
  },
  {
    id: "game_vocabulary_rush_v1",
    category: "games",
    name: "Game Vocabulary Rush",
    tags: ["game", "mini-game", "vocabulary-rush"],
    usage: ["explore", "games-hub"],
  },
  {
    id: "game_kanji_hunter_v1",
    category: "games",
    name: "Game Kanji Hunter",
    tags: ["game", "mini-game", "kanji-hunter"],
    usage: ["explore", "games-hub"],
  },
  {
    id: "achievement_memory_master_v1",
    category: "achievements",
    name: "Achievement Memory Master",
    tags: ["achievement", "rare", "memory-dungeon"],
    usage: ["achievements", "profile"],
  },
  {
    id: "achievement_game_champion_v1",
    category: "achievements",
    name: "Achievement Game Champion",
    tags: ["achievement", "epic", "games"],
    usage: ["achievements", "profile"],
  },
  {
    id: "achievement_perfect_recall_v1",
    category: "achievements",
    name: "Achievement Perfect Recall",
    tags: ["achievement", "legendary", "games"],
    usage: ["achievements", "profile"],
  },
  {
    id: "achievement_dungeon_delver_v1",
    category: "achievements",
    name: "Achievement Dungeon Delver",
    tags: ["achievement", "uncommon", "memory-dungeon"],
    usage: ["achievements", "profile"],
  },
  {
    id: "yama_victorious_light_v1",
    category: "mascots",
    name: "Yama Victorious Light",
    tags: ["mascot", "yama", "victorious", "light-mode"],
    usage: ["game-complete", "celebrations"],
  },
  {
    id: "yama_victorious_dark_v1",
    category: "mascots",
    name: "Yama Victorious Dark",
    tags: ["mascot", "yama", "victorious", "dark-mode"],
    usage: ["game-complete", "celebrations"],
  },
  {
    id: "yama_confused_light_v1",
    category: "mascots",
    name: "Yama Confused Light",
    tags: ["mascot", "yama", "confused", "light-mode"],
    usage: ["drill-feedback", "incorrect-answers"],
  },
  {
    id: "yama_confused_dark_v1",
    category: "mascots",
    name: "Yama Confused Dark",
    tags: ["mascot", "yama", "confused", "dark-mode"],
    usage: ["drill-feedback", "incorrect-answers"],
  },
];

function metadata(asset) {
  return {
    id: asset.id,
    name: asset.name,
    version: "v1",
    category: asset.category,
    owner_agent: "Art Director Agent",
    created_at: "2026-06-12",
    updated_at: "2026-06-12",
    status: "approved",
    tags: asset.tags,
    usage_locations: asset.usage,
    files: [`${asset.id}.png`],
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

  console.log(`Staging: ${stagingDir}`);

  let installed = 0;
  let missing = 0;

  for (const asset of ASSETS) {
    const src = path.join(stagingDir, `${asset.id}.png`);
    if (!(await fileExists(src))) {
      console.warn(`Missing staging file: ${path.relative(root, src)}`);
      missing += 1;
      continue;
    }

    const dir = path.join(root, "assets", asset.category, asset.id);
    await mkdir(dir, { recursive: true });

    const dest = path.join(dir, `${asset.id}.png`);
    await copyFile(src, dest);
    await writeFile(path.join(dir, "metadata.json"), JSON.stringify(metadata(asset), null, 2));

    console.log(`Installed ${asset.category}/${asset.id}`);
    installed += 1;
  }

  console.log(`Done. ${installed} installed, ${missing} missing.`);
  if (installed > 0) {
    console.log("Next: npm run assets:stickers && npm run assets:webp");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
