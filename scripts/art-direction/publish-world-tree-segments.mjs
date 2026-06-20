#!/usr/bin/env node
/**
 * Publish World Tree segment + transition PNG masters → public/art-library/*.webp
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SEGMENTS_SRC = join(ROOT, "Art Library/world-tree/segments");
const TRANSITIONS_SRC = join(ROOT, "Art Library/world-tree/transitions");
const DEST = join(ROOT, "public/art-library/world-tree");

const WEBP_OPTIONS = { quality: 88, effort: 4, alphaQuality: 100 };

async function publishPng(sourcePath, destPath) {
  mkdirSync(dirname(destPath), { recursive: true });
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(destPath);
}

async function publishFolder(srcRoot, destSubdir) {
  if (!existsSync(srcRoot)) return 0;
  let count = 0;
  for (const folder of readdirSync(srcRoot, { withFileTypes: true })) {
    if (!folder.isDirectory() || folder.name.startsWith("_")) continue;
    const segmentDir = join(srcRoot, folder.name);
    for (const file of readdirSync(segmentDir)) {
      if (!/\.png$/i.test(file)) continue;
      const sourcePath = join(segmentDir, file);
      const destPath = join(DEST, destSubdir, folder.name, file.replace(/\.png$/i, ".webp"));
      await publishPng(sourcePath, destPath);
      count += 1;
    }
  }
  return count;
}

async function main() {
  const segments = await publishFolder(SEGMENTS_SRC, "segments");
  const transitions = await publishFolder(TRANSITIONS_SRC, "transitions");
  console.log(`Published ${segments} segment + ${transitions} transition WebP assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
