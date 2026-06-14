#!/usr/bin/env node
/**
 * Build mockup | live side-by-side composites for AD sign-off.
 *
 * Usage: npm run qa:signoff:composite
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SIGNOFF_DIR = path.join(ROOT, "assets", "_staging", "signoff");
const REFS_DIR = path.join(ROOT, "assets", "_staging", "mockup-refs");
const COMPOSITES_DIR = path.join(SIGNOFF_DIR, "composites");
const ROUTES_PATH = path.join(SIGNOFF_DIR, "signoff-routes.json");

const VIEWPORT_W = 390;
const VIEWPORT_H = 844;
const GUTTER = 16;
const LABEL_H = 36;

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function fitPanel(inputBuffer, width, height) {
  return sharp(inputBuffer)
    .resize(width, height, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
}

async function buildComposite(route, mockupBuffer, liveBuffer) {
  const mockupPanel = await fitPanel(mockupBuffer, VIEWPORT_W, VIEWPORT_H);
  const livePanel = await fitPanel(liveBuffer, VIEWPORT_W, VIEWPORT_H);

  const totalW = VIEWPORT_W * 2 + GUTTER;
  const totalH = VIEWPORT_H + LABEL_H;

  return sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 15, g: 17, b: 21, alpha: 255 },
    },
  })
    .composite([
      { input: mockupPanel, left: 0, top: LABEL_H },
      { input: livePanel, left: VIEWPORT_W + GUTTER, top: LABEL_H },
    ])
    .png()
    .toBuffer();
}

async function main() {
  const config = await loadJson(ROUTES_PATH);
  await mkdir(COMPOSITES_DIR, { recursive: true });

  let built = 0;
  let skipped = 0;

  console.log("Building sign-off composites…\n");

  for (const route of config.routes) {
    const livePath = path.join(SIGNOFF_DIR, `${route.slug}.png`);
    const refPath = path.join(REFS_DIR, `${route.mockupRef}.png`);
    const outPath = path.join(COMPOSITES_DIR, `${route.slug}_compare.png`);

    if (!(await exists(livePath))) {
      console.warn(`  ○ ${route.slug} — missing live screenshot (${route.slug}.png)`);
      skipped += 1;
      continue;
    }

    if (!(await exists(refPath))) {
      console.warn(`  ○ ${route.slug} — missing mockup ref (${route.mockupRef}.png)`);
      skipped += 1;
      continue;
    }

    const mockupBuffer = await readFile(refPath);
    const liveBuffer = await readFile(livePath);
    const composite = await buildComposite(route, mockupBuffer, liveBuffer);
    await writeFile(outPath, composite);
    console.log(`  ✓ ${route.slug} → composites/${route.slug}_compare.png`);
    built += 1;
  }

  console.log(`\nDone: ${built} composites, ${skipped} skipped`);
  if (skipped > 0) {
    console.log("Drop live PNGs in assets/_staging/signoff/ then re-run.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
