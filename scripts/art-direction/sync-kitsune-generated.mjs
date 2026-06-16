#!/usr/bin/env node
/** Copy newly generated kitsune_*_light_v1.png from Cursor cache into manifest subfolders. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts/art-direction/kitsune-companion-manifest.json"), "utf8"),
);
const SRC = join(process.env.USERPROFILE ?? "", ".cursor", "projects", "d-NOBORU", "assets");
const outRoot = join(ROOT, manifest.folder);

const idToSub = Object.fromEntries(manifest.toGenerate.map((e) => [e.id, e.subfolder]));
let n = 0;
for (const file of readdirSync(SRC)) {
  const m = file.match(/^kitsune_(.+)_light_v1\.png$/);
  if (!m) continue;
  const id = m[1];
  const sub = idToSub[id];
  if (!sub) continue;
  const dir = join(outRoot, sub);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(SRC, file), join(dir, file));
  n += 1;
}
console.log(`Synced ${n} new kitsune sprites`);
