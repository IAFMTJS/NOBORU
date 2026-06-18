#!/usr/bin/env node
/**
 * Publish World Tree sheet-remaster WebP assets to public/art-library/.
 * Copies existing WebP masters; converts PNG when WebP is missing.
 *
 * Usage: node scripts/art-direction/publish-world-tree-sheet.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library/world-tree/sheet-remasters");
const DEST = join(ROOT, "public/art-library/world-tree/sheet-remasters");

const WEBP_OPTIONS = { quality: 90, effort: 4, alphaQuality: 100 };

function walkFiles(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, results);
      continue;
    }
    if (/\.(png|webp)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function publishWebp(sourcePath) {
  const rel = relative(SRC, sourcePath).replace(/\\/g, "/");
  const destPath = join(DEST, rel);
  mkdirSync(dirname(destPath), { recursive: true });
  copyFileSync(sourcePath, destPath);
}

async function publishPng(sourcePath) {
  const rel = relative(SRC, sourcePath).replace(/\\/g, "/").replace(/\.png$/i, ".webp");
  const destPath = join(DEST, rel);
  mkdirSync(dirname(destPath), { recursive: true });
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
}

async function main() {
  if (!existsSync(SRC)) {
    console.warn("No sheet-remasters folder found — skipping publish.");
    return;
  }

  const files = walkFiles(SRC);
  const webpFiles = files.filter((file) => file.toLowerCase().endsWith(".webp"));
  const pngFiles = files.filter((file) => file.toLowerCase().endsWith(".png"));

  for (const file of webpFiles) {
    await publishWebp(file);
  }

  for (const file of pngFiles) {
    const webpSibling = file.replace(/\.png$/i, ".webp");
    if (!existsSync(webpSibling)) {
      await publishPng(file);
    }
  }

  console.log(
    `Published ${webpFiles.length} world-tree sheet WebP asset(s) → public/art-library/world-tree/sheet-remasters`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
