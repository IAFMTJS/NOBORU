#!/usr/bin/env node
/**
 * Copy duplicate icon pairs that reuse another base asset.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const copies = [
  ["Art Library/icons", "icon_hub_vocabulary", "icon_node_vocabulary"],
  ["Art Library/icons", "icon_hub_kanji", "icon_node_kanji"],
  ["Art Library/icons", "icon_hub_listening", "icon_node_listening"],
  ["Art Library/icons", "icon_game_memory_dungeon", "icon_node_boss_mask"],
];

let n = 0;
for (const [folder, target, source] of copies) {
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  for (const theme of ["light", "dark"]) {
    const src = join(dir, `${source}_${theme}_v1.png`);
    const dst = join(dir, `${target}_${theme}_v1.png`);
    if (existsSync(src)) {
      copyFileSync(src, dst);
      n += 1;
    }
  }
}
console.log(`Copied ${n} duplicate icon files`);
