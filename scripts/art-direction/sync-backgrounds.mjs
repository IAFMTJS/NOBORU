#!/usr/bin/env node
/** Copy bg_* from Cursor assets cache into Art Library/backgrounds subfolders. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts/art-direction/background-manifest.json"), "utf8"),
);
const SRC = join(process.env.USERPROFILE ?? "", ".cursor", "projects", "d-NOBORU", "assets");
const sceneFolder = Object.fromEntries(manifest.scenes.map((s) => [s.id, s.folder]));

function fileName(scene, flavor, theme) {
  const mid = flavor ? `_${flavor}` : "";
  return `bg_${scene}${mid}_${theme}_v1.png`;
}

let n = 0;
for (const file of readdirSync(SRC)) {
  const m = file.match(/^bg_(.+)_(light|dark)_v1\.png$/);
  if (!m) continue;
  const body = m[1];
  const theme = m[2];
  let scene = null;
  let flavor = "";
  for (const s of manifest.scenes) {
    if (body === s.id) {
      scene = s.id;
      break;
    }
    for (const f of Object.keys(manifest.flavors)) {
      if (!f) continue;
      if (body === `${s.id}_${f}`) {
        scene = s.id;
        flavor = f;
        break;
      }
    }
    if (scene) break;
  }
  if (!scene) continue;
  const dir = join(ROOT, manifest.folder, sceneFolder[scene]);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(SRC, file), join(dir, file));
  n += 1;
}
console.log(`Synced ${n} backgrounds to Art Library`);
