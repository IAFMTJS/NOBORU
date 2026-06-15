#!/usr/bin/env node
/**
 * Generates art-direction assets into assets/art/ and public/art/.
 * Painterly SVG → WebP. Does not use mockup crops or legacy ui_* paths.
 */
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { ART_CATALOG } from "./catalog.mjs";
import { drawAssetSvg } from "./draw.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SOURCE_ROOT = path.join(ROOT, "assets", "art", "_source");

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function resolveSourcePng(category, id) {
  const sourcePath = path.join(SOURCE_ROOT, category, `${id}.png`);
  try {
    await access(sourcePath);
    return sourcePath;
  } catch {
    return null;
  }
}

async function generateOne(entry) {
  const { category, id } = entry;
  const sourceDir = path.join(ROOT, "assets", "art", category);
  const publicDir = path.join(ROOT, "public", "art", category);
  await ensureDir(sourceDir);
  await ensureDir(publicDir);

  const pngPath = path.join(sourceDir, `${id}.png`);
  const webpPath = path.join(sourceDir, `${id}.webp`);
  const publicPath = path.join(publicDir, `${id}.webp`);

  const authoredSource = await resolveSourcePng(category, id);
  if (authoredSource) {
    await copyFile(authoredSource, pngPath);
    await sharp(authoredSource).webp({ quality: 88, effort: 4 }).toFile(webpPath);
    await copyFile(webpPath, publicPath);
    const meta = await sharp(authoredSource).metadata();
    return {
      id,
      category,
      width: meta.width ?? null,
      height: meta.height ?? null,
      publicPath: `/art/${category}/${id}.webp`,
      source: "authored",
    };
  }

  const svg = drawAssetSvg(entry);
  const buffer = Buffer.from(svg);
  const image = sharp(buffer, { density: 144 });
  const meta = await image.metadata();

  await image.png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(pngPath).webp({ quality: 82, effort: 4 }).toFile(webpPath);
  await copyFile(webpPath, publicPath);

  return {
    id,
    category,
    width: meta.width ?? null,
    height: meta.height ?? null,
    publicPath: `/art/${category}/${id}.webp`,
    source: "procedural",
  };
}

async function main() {
  console.log(`Generating ${ART_CATALOG.length} art-direction assets…`);
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    spec: "art-direction/06_asset_inventory_and_naming.md",
    count: ART_CATALOG.length,
    assets: [],
  };

  let done = 0;
  for (const entry of ART_CATALOG) {
    const result = await generateOne(entry);
    manifest.assets.push(result);
    done += 1;
    if (done % 25 === 0 || done === ART_CATALOG.length) {
      console.log(`  ${done}/${ART_CATALOG.length}`);
    }
  }

  const manifestPath = path.join(ROOT, "assets", "art", "manifest.json");
  await ensureDir(path.dirname(manifestPath));
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Done. Manifest: assets/art/manifest.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
