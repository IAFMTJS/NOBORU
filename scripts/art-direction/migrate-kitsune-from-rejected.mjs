#!/usr/bin/env node
/** Copy quarantined yama PNGs into kitsune folders with new naming (light only; dark derived later). */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts/art-direction/kitsune-companion-manifest.json"), "utf8"),
);
const rejected = join(ROOT, "Art Library/_rejected/no_transparency");
const outRoot = join(ROOT, manifest.folder);

let n = 0;
for (const [oldBase, [subfolder, newId]] of Object.entries(manifest.migrateFromRejected)) {
  const src = join(rejected, `${oldBase}_light_v1.png`);
  if (!existsSync(src)) {
    console.warn("missing", src);
    continue;
  }
  const dir = join(outRoot, subfolder);
  mkdirSync(dir, { recursive: true });
  const dst = join(dir, `kitsune_${newId}_light_v1.png`);
  copyFileSync(src, dst);
  console.log("migrated", dst.replace(ROOT + "\\", ""));
  n += 1;
}
console.log(`Migrated ${n} light sprites from rejected folder`);
