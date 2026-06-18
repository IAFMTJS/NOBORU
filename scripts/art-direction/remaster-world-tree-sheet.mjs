#!/usr/bin/env node
/**
 * Post-process remastered World Tree sheet assets into production WebP.
 *
 * Drop AI-remastered PNGs (transparent) into:
 *   Art Library/world-tree/sheet-remasters/_staging/{asset_id}.png
 *
 * This script keys stray backgrounds, trims padding, writes final WebP + manifest.
 *
 * Usage:
 *   node scripts/art-direction/remaster-world-tree-sheet.mjs
 *   node scripts/art-direction/remaster-world-tree-sheet.mjs --ingest path/to/file.png --id wt_01_trunk_segments_05_light_v2
 */
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import {
  CHARACTER_STICKER_CONFIG,
  removeBakedBackgroundRgba,
} from "./character-sticker-process.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const EXTRACT_MANIFEST = join(ROOT, "Art Library/world-tree/sheet-extracts/manifest.json");
const REMASTER_ROOT = join(ROOT, "Art Library/world-tree/sheet-remasters");
const STAGING = join(REMASTER_ROOT, "_staging");
const REMASTER_MANIFEST = join(REMASTER_ROOT, "manifest.json");

const WEBP_OPTIONS = { quality: 92, effort: 6, alphaQuality: 100 };
const MIN_LONG_EDGE = 512;

function parseArgs(argv) {
  const args = { ingest: null, id: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--ingest") args.ingest = argv[++i];
    if (argv[i] === "--id") args.id = argv[++i];
  }
  return args;
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function ensureAlphaTrimmed(buffer, luminanceKeyMax = 48) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const copy = Buffer.from(data);
  removeBakedBackgroundRgba(copy, info.width, info.height, info.channels, luminanceKeyMax);
  return sharp(copy, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .trim({ threshold: CHARACTER_STICKER_CONFIG.trimThreshold })
    .extend({
      top: CHARACTER_STICKER_CONFIG.paddingPx,
      bottom: CHARACTER_STICKER_CONFIG.paddingPx,
      left: CHARACTER_STICKER_CONFIG.paddingPx,
      right: CHARACTER_STICKER_CONFIG.paddingPx,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png();
}

async function normalizeSize(pipeline) {
  const meta = await pipeline.metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (longEdge >= MIN_LONG_EDGE) return pipeline;
  const scale = MIN_LONG_EDGE / longEdge;
  return pipeline.resize({
    width: Math.round((meta.width ?? 0) * scale),
    height: Math.round((meta.height ?? 0) * scale),
    fit: "inside",
    kernel: sharp.kernel.lanczos3,
  });
}

const FIX_SCRIPT = join(__dirname, "fix-world-tree-transparency.py");

function stripCheckerboard(pngPath) {
  const result = spawnSync("python", [FIX_SCRIPT, "--only", pngPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`Checkerboard removal failed for ${pngPath}: ${result.stderr || result.stdout}`);
  }
}

async function publishRemaster(entry, sourcePath) {
  const v2Id = entry.id.replace("_v1", "_v2");
  const section = entry.section;
  const outDir = join(REMASTER_ROOT, section);
  await mkdir(outDir, { recursive: true });

  const pngPath = join(outDir, `${v2Id}.png`);
  const webpPath = join(outDir, `${v2Id}.webp`);

  let pipeline = await ensureAlphaTrimmed(await readFile(sourcePath));
  pipeline = await normalizeSize(pipeline);

  await pipeline.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  stripCheckerboard(pngPath);

  return {
    id: v2Id,
    section,
    sourceExtract: entry.file,
    png: pngPath.replace(/\\/g, "/").replace(`${ROOT}/`.replace(/\\/g, "/"), ""),
    webp: webpPath.replace(/\\/g, "/").replace(`${ROOT}/`.replace(/\\/g, "/"), ""),
    remasteredAt: new Date().toISOString(),
  };
}

async function ingestOne(sourcePath, assetId, extractManifest) {
  const v1Id = assetId.replace("_v2", "_v1");
  const entry = extractManifest.find((item) => item.id === v1Id);
  if (!entry) throw new Error(`Unknown extract id for ${assetId} (expected ${v1Id})`);

  const result = await publishRemaster(entry, sourcePath);
  let manifest = [];
  if (existsSync(REMASTER_MANIFEST)) {
    manifest = await loadJson(REMASTER_MANIFEST);
  }
  manifest = manifest.filter((item) => item.id !== result.id);
  manifest.push(result);
  manifest.sort((a, b) => a.id.localeCompare(b.id));
  await mkdir(REMASTER_ROOT, { recursive: true });
  await writeFile(REMASTER_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return result;
}

async function ingestStaging(extractManifest) {
  if (!existsSync(STAGING)) return [];
  const files = (await readdir(STAGING)).filter((name) => name.endsWith(".png"));
  const results = [];
  for (const file of files) {
    const assetId = file.replace(/\.png$/i, "");
    const sourcePath = join(STAGING, file);
    results.push(await ingestOne(sourcePath, assetId, extractManifest));
  }
  return results;
}

async function main() {
  const args = parseArgs(process.argv);
  const extractManifest = await loadJson(EXTRACT_MANIFEST);

  if (args.ingest && args.id) {
    const result = await ingestOne(resolve(args.ingest), args.id, extractManifest);
    console.log(`Remastered: ${result.id}`);
    console.log(`  PNG:  ${result.png}`);
    console.log(`  WebP: ${result.webp}`);
    return;
  }

  const results = await ingestStaging(extractManifest);
  if (results.length === 0) {
    const pending = extractManifest.length;
    let done = 0;
    if (existsSync(REMASTER_MANIFEST)) {
      done = (await loadJson(REMASTER_MANIFEST)).length;
    }
    console.log(`World Tree remaster: ${done}/${pending} complete.`);
    console.log(`Stage PNGs in: ${STAGING}`);
    console.log(`Naming: wt_{section}_{index}_{theme}_v2.png`);
    return;
  }

  console.log(`Ingested ${results.length} remaster(s) from staging.`);
  for (const result of results) {
    console.log(`  ${result.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
