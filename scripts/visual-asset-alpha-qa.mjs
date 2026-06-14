#!/usr/bin/env node
/**
 * Scans public/mascots and public/icons WebP assets for near-white border
 * pixels — a sign of failed alpha / letterbox removal. Fails CI when any
 * asset exceeds 5% near-white border coverage.
 *
 * Usage: npm run assets:alpha-qa
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SCAN_DIRS = [
  path.join(ROOT, "public", "mascots"),
  path.join(ROOT, "public", "icons"),
];

/** RGB channels all at or above this value count as near-white. */
const NEAR_WHITE_MIN = 240;
/** Border pixels with alpha at or above this are evaluated. */
const OPAQUE_ALPHA_MIN = 128;
/** Maximum allowed fraction of border pixels that are near-white. */
const MAX_NEAR_WHITE_RATIO = 0.05;

/** Pre-composited nav fox / trail companion — light fur at edges is intentional. */
const SKIP_PREFIXES = ["yama_nav_", "yama_trail_companion_", "yama_loading_"];

async function listWebpFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".webp"))
      .map((entry) => path.join(dir, entry.name));
  } catch {
    return [];
  }
}

function shouldSkip(baseName) {
  return SKIP_PREFIXES.some((prefix) => baseName.startsWith(prefix));
}

function collectBorderIndices(width, height) {
  const margin = Math.max(1, Math.floor(Math.min(width, height) * 0.02));
  const indices = new Set();

  for (let x = margin; x < width - margin; x += Math.max(1, Math.floor(width / 12))) {
    indices.add((margin * width + x) * 4);
    indices.add(((height - 1 - margin) * width + x) * 4);
  }
  for (let y = margin; y < height - margin; y += Math.max(1, Math.floor(height / 12))) {
    indices.add((y * width + margin) * 4);
    indices.add((y * width + (width - 1 - margin)) * 4);
  }

  const corners = [
    [margin, margin],
    [width - 1 - margin, margin],
    [margin, height - 1 - margin],
    [width - 1 - margin, height - 1 - margin],
  ];
  for (const [x, y] of corners) {
    indices.add((y * width + x) * 4);
  }

  return [...indices];
}

async function measureNearWhiteBorderRatio(filePath) {
  const input = await readFile(filePath);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const borderIndices = collectBorderIndices(width, height);
  if (borderIndices.length === 0) {
    return { ratio: 0, nearWhite: 0, total: 0 };
  }

  let nearWhite = 0;
  for (const idx of borderIndices) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    if (
      a >= OPAQUE_ALPHA_MIN &&
      r >= NEAR_WHITE_MIN &&
      g >= NEAR_WHITE_MIN &&
      b >= NEAR_WHITE_MIN
    ) {
      nearWhite += 1;
    }
  }

  return { ratio: nearWhite / borderIndices.length, nearWhite, total: borderIndices.length };
}

const failures = [];
const scanned = [];

for (const dir of SCAN_DIRS) {
  const files = await listWebpFiles(dir);
  for (const filePath of files) {
    const baseName = path.basename(filePath, ".webp");
    if (shouldSkip(baseName)) {
      continue;
    }

    const { ratio, nearWhite, total } = await measureNearWhiteBorderRatio(filePath);
    scanned.push(path.relative(ROOT, filePath));

    if (ratio > MAX_NEAR_WHITE_RATIO) {
      failures.push({
        file: path.relative(ROOT, filePath),
        ratio,
        nearWhite,
        total,
      });
    }
  }
}

if (failures.length > 0) {
  console.error("Visual asset alpha QA failed (>5% near-white border pixels):\n");
  for (const failure of failures) {
    console.error(
      `  - ${failure.file}: ${(failure.ratio * 100).toFixed(1)}% (${failure.nearWhite}/${failure.total} border samples)`,
    );
  }
  process.exit(1);
}

console.log(`Visual asset alpha QA passed (${scanned.length} WebP files scanned).`);
