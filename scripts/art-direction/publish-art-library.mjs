#!/usr/bin/env node
/**
 * Regenerate public/art-library/*.webp from Art Library/ PNG masters.
 * Masters stay in Art Library/ for archival quality; the site serves WebP only.
 * Usage: node scripts/art-direction/publish-art-library.mjs [--if-needed]
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library");
const DEST = join(ROOT, "public/art-library");
const ifNeeded = process.argv.includes("--if-needed");
const RASTER_EXT = /\.(png|jpe?g)$/i;

const WEBP_OPTIONS = {
  quality: 88,
  effort: 4,
  alphaQuality: 100,
};

function publishedWebpPath(sourcePath) {
  const rel = relative(SRC, sourcePath).replace(/\\/g, "/");
  return join(DEST, rel.replace(RASTER_EXT, ".webp"));
}

async function publishRaster(sourcePath) {
  const destPath = publishedWebpPath(sourcePath);
  mkdirSync(dirname(destPath), { recursive: true });
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
}

function walkRasterFiles(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "_rejected" || entry.name === "_source") continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRasterFiles(fullPath, results);
      continue;
    }
    if (RASTER_EXT.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function newestMtime(dir) {
  let newest = 0;
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const stat = statSync(current, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isFile()) {
      newest = Math.max(newest, stat.mtimeMs);
      continue;
    }
    if (!stat.isDirectory()) continue;
    for (const entry of readdirSync(current)) {
      if (entry === "_rejected") continue;
      stack.push(join(current, entry));
    }
  }
  return newest;
}

function shouldSkipPublish() {
  if (!ifNeeded || !existsSync(DEST)) return false;
  if (!existsSync(SRC)) return false;
  const destMarker = join(DEST, "icons");
  if (!existsSync(destMarker)) return false;
  return newestMtime(DEST) >= newestMtime(SRC);
}

async function publishArtLibrary() {
  if (!existsSync(SRC)) {
    console.warn("Art Library folder not found — skipping publish.");
    return;
  }

  if (shouldSkipPublish()) {
    console.log("Art Library publish skipped (public/art-library is up to date).");
    return;
  }

  rmSync(DEST, { recursive: true, force: true });

  const rasterFiles = walkRasterFiles(SRC);
  let converted = 0;
  for (const sourcePath of rasterFiles) {
    await publishRaster(sourcePath);
    converted += 1;
  }

  console.log(`Published ${converted} Art Library assets → public/art-library (*.webp)`);
}

publishArtLibrary().catch((error) => {
  console.error(error);
  process.exit(1);
});
