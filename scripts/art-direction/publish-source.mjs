#!/usr/bin/env node
/**
 * Publishes hand-authored PNG sources from assets/art/_source/ to assets/art/ and public/art/.
 * Source layout mirrors production: assets/art/_source/{category}/{id}.png
 */
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SOURCE_ROOT = path.join(ROOT, "assets", "art", "_source");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function publishOne(sourcePath) {
  const rel = path.relative(SOURCE_ROOT, sourcePath);
  const parsed = path.parse(rel);
  const category = parsed.dir.replace(/\\/g, "/");
  const id = parsed.name;

  const outDir = path.join(ROOT, "assets", "art", category);
  const publicDir = path.join(ROOT, "public", "art", category);
  await mkdir(outDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const pngOut = path.join(outDir, `${id}.png`);
  const webpOut = path.join(outDir, `${id}.webp`);
  const publicWebp = path.join(publicDir, `${id}.webp`);

  await copyFile(sourcePath, pngOut);
  await sharp(sourcePath).webp({ quality: 88, effort: 4 }).toFile(webpOut);
  await copyFile(webpOut, publicWebp);

  return { category, id, publicPath: `/art/${category}/${id}.webp` };
}

async function main() {
  try {
    await stat(SOURCE_ROOT);
  } catch {
    console.log("No assets/art/_source/ directory — nothing to publish.");
    return;
  }

  const sources = await walk(SOURCE_ROOT);
  if (sources.length === 0) {
    console.log("No source PNGs found.");
    return;
  }

  console.log(`Publishing ${sources.length} source art files…`);
  for (const source of sources) {
    const result = await publishOne(source);
    console.log(`  ${result.publicPath}`);
  }
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
