#!/usr/bin/env node
/**
 * Publish JLPT band PNG masters → public/art-library/world-tree/jlpt-bands/*.webp
 * Use when world-tree art vanishes from public/ but masters remain in Art Library/.
 */
import { existsSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library/world-tree/jlpt-bands");
const DEST = join(ROOT, "public/art-library/world-tree/jlpt-bands");
const BANDS = ["n5", "n4", "n3", "n2", "n1"];
const THEMES = ["light", "dark"];

/** Per-band published hero version — bump when new masters ship. */
const BAND_VERSIONS = {
  n5: 1,
  n4: 2,
  n3: 1,
  n2: 1,
  n1: 1,
};

const WEBP_OPTIONS = { quality: 88, effort: 4, alphaQuality: 100 };

async function publishBand(band, theme, version) {
  const sourcePath = join(SRC, band, `wt_jlpt_${band}_${theme}_v${version}.png`);
  if (!existsSync(sourcePath)) {
    console.warn(`  skip (missing): ${sourcePath}`);
    return false;
  }

  const destPath = join(DEST, band, `wt_jlpt_${band}_${theme}_v${version}.webp`);
  mkdirSync(dirname(destPath), { recursive: true });
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
  console.log(`  → ${destPath}`);
  return true;
}

async function main() {
  let count = 0;
  for (const band of BANDS) {
    const version = BAND_VERSIONS[band] ?? 1;
    for (const theme of THEMES) {
      if (await publishBand(band, theme, version)) count += 1;
    }
  }
  console.log(`Published ${count} JLPT band WebP assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
