#!/usr/bin/env node
/**
 * Publish JLPT band PNG masters → public/art-library/world-tree/jlpt-bands/*.webp
 * Use when world-tree art vanishes from public/ but masters remain in Art Library/.
 */
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library/world-tree/jlpt-bands");
const DEST = join(ROOT, "public/art-library/world-tree/jlpt-bands");
const BANDS = ["n5", "n4", "n3", "n2", "n1"];
const THEMES = ["light", "dark"];

const WEBP_OPTIONS = { quality: 88, effort: 4, alphaQuality: 100 };

async function main() {
  let count = 0;
  for (const band of BANDS) {
    for (const theme of THEMES) {
      const sourcePath = join(SRC, band, `wt_jlpt_${band}_${theme}_v1.png`);
      const destPath = join(DEST, band, `wt_jlpt_${band}_${theme}_v1.webp`);
      mkdirSync(dirname(destPath), { recursive: true });
      await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
      count += 1;
      console.log(`  → ${destPath}`);
    }
  }
  console.log(`Published ${count} JLPT band WebP assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
