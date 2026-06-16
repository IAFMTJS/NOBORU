#!/usr/bin/env node
/** Sync *_light_v1.png and *_dark_v1.png from Cursor assets cache to Art Library */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(process.env.USERPROFILE ?? "", ".cursor", "projects", "d-NOBORU", "assets");

function destDir(base) {
  if (base.startsWith("item_")) return join(ROOT, "Art Library/props");
  if (base.startsWith("reward_") || base.startsWith("achievement_")) return join(ROOT, "Art Library/achievements");
  return join(ROOT, "Art Library/icons");
}

function baseFrom(name) {
  return name.replace(/_(light|dark)_v1\.png$/, "");
}

let n = 0;
if (!existsSync(SRC)) {
  console.error("Source not found:", SRC);
  process.exit(1);
}
for (const file of readdirSync(SRC)) {
  if (!/_(light|dark)_v1\.png$/.test(file)) continue;
  const base = baseFrom(file);
  const dir = destDir(base);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(SRC, file), join(dir, file));
  n += 1;
}
console.log(`Synced ${n} files to Art Library`);
