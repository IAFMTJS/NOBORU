#!/usr/bin/env node
/** Copy wt_* from Cursor assets cache into Art Library/world-tree segment folders. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts/art-direction/world-tree-manifest.json"), "utf8"),
);
const SRC = join(process.env.USERPROFILE ?? "", ".cursor", "projects", "d-NOBORU", "assets");
const segmentFolder = Object.fromEntries(
  manifest.segments.map((s) => [s.id, s.folder]),
);

const version = process.argv[2] ?? String(manifest.activeVersion ?? 2);

let n = 0;
for (const file of readdirSync(SRC)) {
  const m = file.match(new RegExp(`^wt_(.+)_(light|dark)_v${version}\\.png$`));
  if (!m) continue;
  const segmentId = m[1];
  const folder = segmentFolder[segmentId];
  if (!folder) continue;
  const dir = join(ROOT, manifest.folder, folder);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(SRC, file), join(dir, file));
  n += 1;
}
console.log(`Synced ${n} world-tree v${version} tiles to Art Library`);
