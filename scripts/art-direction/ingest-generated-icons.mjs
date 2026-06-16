#!/usr/bin/env node
/**
 * Copy generated icons from Cursor assets cache to Art Library folders.
 * Usage: node scripts/art-direction/ingest-generated-icons.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = process.env.CURSOR_ASSETS ?? join(process.env.USERPROFILE ?? "", ".cursor", "projects", "d-NOBORU", "assets");
const copies = {
  "Art Library/icons/icon_hub_vocabulary": "icon_node_vocabulary",
  "Art Library/icons/icon_hub_kanji": "icon_node_kanji",
  "Art Library/icons/icon_hub_listening": "icon_node_listening",
  "Art Library/icons/icon_game_memory_dungeon": "icon_node_boss_mask",
};

function folderFor(base) {
  if (base.startsWith("item_")) return "Art Library/props";
  if (base.startsWith("reward_") || base.startsWith("achievement_")) return "Art Library/achievements";
  return "Art Library/icons";
}

function ingestOne(base, theme) {
  const name = `${base}_${theme}_v1.png`;
  const src = join(SRC, name);
  if (!existsSync(src)) return false;
  const dir = resolve(ROOT, folderFor(base));
  mkdirSync(dir, { recursive: true });
  copyFileSync(src, join(dir, name));
  return true;
}

const manifest = JSON.parse(
  await import("node:fs/promises").then((fs) => fs.readFile(join(ROOT, "scripts/art-direction/icon-catalog-remaining.json"), "utf8")),
);

let n = 0;
for (const base of manifest.ids) {
  for (const theme of ["light", "dark"]) {
    if (ingestOne(base, theme)) n += 1;
  }
}

for (const [target, source] of Object.entries(copies)) {
  const targetBase = target.split("/").pop();
  const dir = resolve(ROOT, target.includes("props") ? "Art Library/props" : target.includes("achievements") ? "Art Library/achievements" : "Art Library/icons");
  for (const theme of ["light", "dark"]) {
    const src = join(resolve(ROOT, folderFor(source)), `${source}_${theme}_v1.png`);
    const dst = join(dir, `${targetBase}_${theme}_v1.png`);
    if (existsSync(src)) {
      copyFileSync(src, dst);
      n += 1;
    }
  }
}

console.log(`Ingested/copied ${n} files`);
