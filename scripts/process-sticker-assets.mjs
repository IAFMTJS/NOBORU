/**
 * Removes solid letterbox backgrounds from sticker-style raster assets and
 * writes transparent WebP to assets/ + public/.
 *
 * Source PNGs are kept in assets/ as authoring files.
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Relative paths under assets/ */
const STICKER_SOURCES = [
  "achievements",
  "brand",
  "games",
  "icons",
  "mascots",
];

const SKIP_MASCOT_PREFIXES = ["yama_main_"];

/** Nav fox / trail companion PNGs are pre-composited with alpha — corner sampling eats light fur. */
const SKIP_NAV_FOX_PREFIXES = ["yama_nav_", "yama_trail_companion_"];

const OPTIONS = {
  /** RGB distance from sampled background → fully transparent */
  threshold: 42,
  /** Soft edge feather band in RGB distance */
  feather: 22,
  webpQuality: 90,
};

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function sampleBackground(data, width, height, channels, mode = "corners") {
  const points = [];
  const margin = Math.max(2, Math.floor(Math.min(width, height) * 0.02));

  if (mode === "center") {
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    const radius = Math.max(4, Math.floor(Math.min(width, height) * 0.08));
    for (let y = cy - radius; y <= cy + radius; y += Math.max(1, Math.floor(radius / 2))) {
      for (let x = cx - radius; x <= cx + radius; x += Math.max(1, Math.floor(radius / 2))) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          points.push([x, y]);
        }
      }
    }
  } else {
    for (let x = margin; x < width - margin; x += Math.max(1, Math.floor(width / 12))) {
      points.push([x, margin]);
      points.push([x, height - 1 - margin]);
    }
    for (let y = margin; y < height - margin; y += Math.max(1, Math.floor(height / 12))) {
      points.push([margin, y]);
      points.push([width - 1 - margin, y]);
    }

    points.push([margin, margin], [width - 1 - margin, margin]);
    points.push([margin, height - 1 - margin], [width - 1 - margin, height - 1 - margin]);
  }

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (const [x, y] of points) {
    const i = (y * width + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count += 1;
  }

  return { r: r / count, g: g / count, b: b / count };
}

function usesNavFoxSampling(baseName) {
  return SKIP_NAV_FOX_PREFIXES.some((prefix) => baseName.startsWith(prefix));
}

async function convertTransparentWebp(inputBuffer) {
  return sharp(inputBuffer)
    .ensureAlpha()
    .webp({
      quality: OPTIONS.webpQuality,
      effort: 4,
      alphaQuality: 100,
      lossless: false,
    })
    .toBuffer();
}

async function removeSolidBackground(inputBuffer, samplingMode = "corners") {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleBackground(data, width, height, channels, samplingMode);
  const { threshold, feather } = OPTIONS;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dist = colorDistance(r, g, b, bg.r, bg.g, bg.b);

      if (dist <= threshold) {
        data[i + 3] = 0;
      } else if (dist <= threshold + feather) {
        const alpha = Math.round(255 * ((dist - threshold) / feather));
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }
  }

  return sharp(data, { raw: { width, height, channels: 4 } })
    .webp({
      quality: OPTIONS.webpQuality,
      effort: 4,
      alphaQuality: 100,
      lossless: false,
    })
    .toBuffer();
}

async function collectPngFiles(relativePath) {
  const full = path.join(root, "assets", relativePath);

  try {
    const fileStat = await stat(full);
    if (fileStat.isFile() && full.toLowerCase().endsWith(".png")) {
      return [full];
    }
  } catch {
    return [];
  }

  const files = [];

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
        if (entry.name.startsWith("_") || dir.includes(`${path.sep}_staging`)) {
          continue;
        }
        files.push(entryPath);
      }
    }
  }

  await walk(full);
  return files;
}

async function publishWebp(pngPath, webpBuffer) {
  const baseName = path.basename(pngPath, ".png");
  const publicCategory = path.basename(path.dirname(path.dirname(pngPath)));

  const assetWebp = pngPath.replace(/\.png$/i, ".webp");
  const publicDir = path.join(root, "public", publicCategory);
  const publicWebp = path.join(publicDir, `${baseName}.webp`);

  await writeFile(assetWebp, webpBuffer);
  await mkdir(publicDir, { recursive: true });
  await writeFile(publicWebp, webpBuffer);

  return { assetWebp, publicWebp };
}

async function main() {
  const pngFiles = (
    await Promise.all(STICKER_SOURCES.map((source) => collectPngFiles(source)))
  )
    .flat()
    .filter((pngPath) => {
      const base = path.basename(pngPath, ".png");
      return !SKIP_MASCOT_PREFIXES.some((prefix) => base.startsWith(prefix));
    });

  if (pngFiles.length === 0) {
    console.log("No sticker PNG sources found.");
    return;
  }

  console.log(`Processing ${pngFiles.length} sticker assets…`);

  for (const pngPath of pngFiles) {
    const input = await readFile(pngPath);
    const baseName = path.basename(pngPath, ".png");
    const webpBuffer = usesNavFoxSampling(baseName)
      ? await convertTransparentWebp(input)
      : await removeSolidBackground(input);
    const { publicWebp } = await publishWebp(pngPath, webpBuffer);
    const mode = usesNavFoxSampling(baseName) ? "pre-composited alpha" : "transparent";
    console.log(`${path.relative(root, pngPath)} → ${path.relative(root, publicWebp)} (${mode})`);
  }

  console.log("Done. Sticker assets now use alpha transparency.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
