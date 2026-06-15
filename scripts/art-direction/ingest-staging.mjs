#!/usr/bin/env node
/**
 * Moves PNGs from assets/art/_staging/ into assets/art/_source/ by filename.
 * Filename must match asset id, e.g. bg-trail-scroll-foothills.png
 * Optional subpath prefix in name: backgrounds-trail-bg-trail-scroll-foothills.png
 */
import { copyFile, mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const STAGING = path.join(ROOT, "assets", "art", "_staging");
const SOURCE = path.join(ROOT, "assets", "art", "_source");

/** Known category prefixes for asset ids */
const CATEGORY_BY_PREFIX = [
  ["bg-trail-scroll-", "backgrounds/trail"],
  ["bg-trail-", "backgrounds/trail"],
  ["bg-camp-", "backgrounds/camp"],
  ["bg-shrine-", "backgrounds/shrine"],
  ["bg-event-", "backgrounds/events"],
  ["bg-weather-", "backgrounds/weather"],
  ["bg-time-", "backgrounds/weather"],
  ["bg-shop-", "backgrounds/utility"],
  ["bg-memory-", "backgrounds/utility"],
  ["bg-settings-", "backgrounds/utility"],
  ["bg-social-", "backgrounds/utility"],
  ["bg-avatar-", "backgrounds/utility"],
  ["char-noboru-reaction-", "characters/noboru/reactions"],
  ["char-noboru-weather-", "characters/noboru/weather"],
  ["char-noboru-cosmetic-", "characters/noboru/cosmetics"],
  ["char-noboru-", "characters/noboru/base"],
  ["nav-", "ui/navbars"],
  ["icon-app-", "brand"],
  ["icon-nav-", "ui/icons/nav"],
  ["icon-node-", "ui/icons/nodes"],
  ["icon-ui-", "ui/icons/ui"],
  ["reward-", "rewards"],
  ["brand-", "brand"],
];

function resolveCategory(id) {
  for (const [prefix, category] of CATEGORY_BY_PREFIX) {
    if (id.startsWith(prefix)) return category;
  }
  return null;
}

async function main() {
  try {
    await stat(STAGING);
  } catch {
    console.log("Create assets/art/_staging/ and drop PNGs named by asset id.");
    return;
  }

  const files = (await readdir(STAGING)).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
  if (files.length === 0) {
    console.log("No PNGs in _staging.");
    return;
  }

  for (const file of files) {
    const id = path.parse(file).name;
    if (!/^(bg-|char-|nav-|icon-|brand-|reward-)/.test(id)) {
      continue;
    }
    const category = resolveCategory(id);
    if (!category) {
      console.warn(`  skip (unknown category): ${file}`);
      continue;
    }
    const destDir = path.join(SOURCE, category);
    await mkdir(destDir, { recursive: true });
    const dest = path.join(destDir, `${id}.png`);
    await copyFile(path.join(STAGING, file), dest);
    console.log(`  ${id} → ${category}/`);
  }
  console.log("Done. Run: npm run assets:publish-source");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
