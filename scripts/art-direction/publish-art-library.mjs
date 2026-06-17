#!/usr/bin/env node
/**
 * Copy Art Library assets into public/art-library/ for static CDN serving.
 * Skips quietly when only LFS pointer files are present (Vercel without Git LFS).
 * Usage: node scripts/art-direction/publish-art-library.mjs [--if-needed]
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library");
const DEST = join(ROOT, "public/art-library");
const ifNeeded = process.argv.includes("--if-needed");
const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";

const SAMPLE_FILES = [
  join(SRC, "icons", "icon_nav_journey_mountain_dark_v1.png"),
  join(SRC, "backgrounds", "trail", "bg_trail_dark_v1.png"),
  join(SRC, "characters", "kitsune", "base", "kitsune_standing_traveler_dark_v1.png"),
];

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

function publishArtLibrary() {
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
      "Art Library contains Git LFS pointers — skipping publish to public/art-library.",
    );
    console.warn(
      "Enable Git LFS in Vercel: Project Settings → Git → Git Large File Storage, then redeploy.",
    );
    return;
  }

  rmSync(DEST, { recursive: true, force: true });
  cpSync(SRC, DEST, {
    recursive: true,
    filter: (source) => !source.split(/[/\\]/).includes("_rejected"),
  });

  console.log("Published Art Library → public/art-library");
}

publishArtLibrary();
