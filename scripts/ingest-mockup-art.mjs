#!/usr/bin/env node
/**
 * Ingest mockup-quality PNGs from assets/_staging/final-art/ into assets/ + public/.
 *
 * Usage:
 *   node scripts/ingest-mockup-art.mjs
 *   node scripts/ingest-mockup-art.mjs --check   # list missing sources only
 *
 * After ingest, run npm run assets:stickers or assets:scenes as needed.
 */
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "assets", "_staging", "ingest-manifest.json");
const CHECK_ONLY = process.argv.includes("--check");

const WEBP_OPTIONS = {
  scene: { quality: 88, effort: 4 },
  sticker: { quality: 90, effort: 4, alphaQuality: 100 },
  "nav-fox": { quality: 90, effort: 4, alphaQuality: 100 },
};

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertToWebp(inputBuffer, pipeline) {
  const opts = WEBP_OPTIONS[pipeline] ?? WEBP_OPTIONS.scene;
  return sharp(inputBuffer).ensureAlpha().webp(opts).toBuffer();
}

async function ingestAsset(entry) {
  const sourcePath = path.join(ROOT, entry.source);
  if (!(await fileExists(sourcePath))) {
    return { id: entry.id, status: "missing", source: entry.source };
  }

  const assetDir = path.join(ROOT, "assets", entry.category, entry.id);
  const publicDir = path.join(ROOT, "public", entry.category);
  const pngDest = path.join(assetDir, `${entry.id}.png`);
  const webpDest = path.join(assetDir, `${entry.id}.webp`);
  const publicWebp = path.join(publicDir, `${entry.id}.webp`);

  await mkdir(assetDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const input = await readFile(sourcePath);
  await copyFile(sourcePath, pngDest);

  const webp = await convertToWebp(input, entry.pipeline);
  await writeFile(webpDest, webp);
  await writeFile(publicWebp, webp);

  return {
    id: entry.id,
    status: "ingested",
    publicPath: `/${entry.category}/${entry.id}.webp`,
  };
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const assets = manifest.assets ?? [];

  if (assets.length === 0) {
    console.log("No assets in ingest manifest.");
    return;
  }

  console.log(`Mockup art ingest — ${assets.length} entries in manifest\n`);

  const results = [];
  for (const entry of assets) {
    if (CHECK_ONLY) {
      const exists = await fileExists(path.join(ROOT, entry.source));
      results.push({ id: entry.id, status: exists ? "ready" : "missing", source: entry.source });
      continue;
    }
    results.push(await ingestAsset(entry));
  }

  const ingested = results.filter((r) => r.status === "ingested");
  const missing = results.filter((r) => r.status === "missing");
  const ready = results.filter((r) => r.status === "ready");

  for (const r of ingested) {
    console.log(`✓ ${r.id} → ${r.publicPath}`);
  }
  for (const r of missing) {
    console.warn(`○ ${r.id} — drop PNG at ${r.source}`);
  }
  if (CHECK_ONLY) {
    for (const r of ready) {
      console.log(`✓ ${r.id} ready at ${r.source}`);
    }
  }

  console.log(
    `\nSummary: ${ingested.length} ingested, ${missing.length} missing, ${ready.length} ready (check mode)`,
  );

  if (!CHECK_ONLY && ingested.length > 0) {
    console.log("\nNext: update lib/assets/registry.ts to point at new v2/v3 paths, then npm run assets:alpha-qa");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
