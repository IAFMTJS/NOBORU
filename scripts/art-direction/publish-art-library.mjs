#!/usr/bin/env node
/**
 * Regenerate public/art-library/*.webp from Art Library/ PNG masters.
 * Masters stay in Art Library/ for archival quality; the site serves WebP only.
 * Usage: node scripts/art-direction/publish-art-library.mjs [--if-needed]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library");
const DEST = join(ROOT, "public/art-library");
const ifNeeded = process.argv.includes("--if-needed");
const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";
const RASTER_EXT = /\.(png|jpe?g)$/i;

const WEBP_OPTIONS = {
  quality: 88,
  effort: 4,
  alphaQuality: 100,
};

const SAMPLE_FILES = [
  join(SRC, "icons", "icon_nav_journey_mountain_dark_v1.png"),
  join(SRC, "backgrounds", "trail", "bg_trail_dark_v1.png"),
  join(SRC, "characters", "kitsune", "base", "kitsune_standing_traveler_dark_v1.png"),
];

function walkRasterFiles(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "_rejected") continue;
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

function hasPointerFiles() {
  const samples = SAMPLE_FILES.filter((filePath) => existsSync(filePath));
  if (samples.length === 0) return false;
  return samples.some((filePath) => {
    const head = readFileSync(filePath, { encoding: "utf8", flag: "r" }).slice(0, 80);
    return head.startsWith(LFS_POINTER_PREFIX);
  });
}

function publishedWebpPath(sourcePath) {
  const rel = relative(SRC, sourcePath).replace(/\\/g, "/");
  return join(DEST, rel.replace(RASTER_EXT, ".webp"));
}

async function publishRaster(sourcePath) {
  const destPath = publishedWebpPath(sourcePath);
  mkdirSync(dirname(destPath), { recursive: true });
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
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

  if (hasPointerFiles()) {
    console.warn(
      "Art Library contains Git LFS pointers — cannot regenerate public/art-library WebP.",
    );
    console.warn("Run locally with materialized masters, or use committed WebP in public/.");
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
