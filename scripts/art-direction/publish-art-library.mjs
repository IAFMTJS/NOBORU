#!/usr/bin/env node
/**
 * Copy Art Library assets into public/art-library/ for static deployment.
 * Usage: node scripts/art-direction/publish-art-library.mjs [--if-needed]
 */
import { cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "Art Library");
const DEST = join(ROOT, "public/art-library");
const ifNeeded = process.argv.includes("--if-needed");

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

function publishArtLibrary() {
  if (!existsSync(SRC)) {
    console.error("Art Library folder not found:", SRC);
    process.exit(1);
  }

  if (shouldSkipPublish()) {
    console.log("Art Library publish skipped (public/art-library is up to date).");
    return;
  }

  rmSync(DEST, { recursive: true, force: true });
  cpSync(SRC, DEST, {
    recursive: true,
    filter: (source) => !source.split(/[/\\]/).includes("_rejected"),
  });

  console.log(`Published Art Library → public/art-library`);
}

publishArtLibrary();
