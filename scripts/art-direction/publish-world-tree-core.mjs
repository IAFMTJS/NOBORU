#!/usr/bin/env node
/** Publish world-tree segments, jlpt-bands, and transitions to public/art-library. */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library/world-tree");
const DEST = join(ROOT, "public/art-library/world-tree");
const WEBP = { quality: 88, effort: 4, alphaQuality: 100 };
const ALLOWED = new Set(["segments", "jlpt-bands", "transitions", "depth"]);

function walk(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.startsWith("sheet-")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
      continue;
    }
    if (/\.(png|jpe?g)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function publishWorldTree() {
  const files = walk(SRC).filter((filePath) => {
    const rel = filePath.slice(SRC.length + 1).replace(/\\/g, "/");
    const top = rel.split("/")[0];
    return ALLOWED.has(top);
  });

  let converted = 0;
  for (const sourcePath of files) {
    const rel = sourcePath.slice(SRC.length + 1).replace(/\\/g, "/");
    const destPath = join(DEST, rel.replace(/\.(png|jpe?g)$/i, ".webp"));
    mkdirSync(dirname(destPath), { recursive: true });
    await sharp(sourcePath).webp(WEBP).toFile(destPath);
    converted += 1;
  }

  console.log(`Published ${converted} world-tree assets → public/art-library/world-tree`);
}

publishWorldTree().catch((error) => {
  console.error(error);
  process.exit(1);
});
