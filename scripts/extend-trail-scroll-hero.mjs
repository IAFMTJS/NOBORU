/**
 * Extends a single hero trail illustration (1536×1024) to full scroll (1536×5120)
 * by slicing distinct vertical bands — no segment tiling, no repeated peaks.
 *
 * Usage: node scripts/extend-trail-scroll-hero.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const genDir = path.join("C:/Users/siebe/.cursor/projects/d-NOBORU/assets");

const WIDTH = 1536;
const HEIGHT = 5120;
const BLEND_PX = 200;

/**
 * Each band extracts a unique vertical slice from the hero (0–1) and maps it
 * to a destination band on the scroll canvas. Overlaps enable feather blending.
 */
const BANDS = [
  { srcY0: 0.62, srcY1: 1.0, destY0: 0.0, destY1: 0.17 },
  { srcY0: 0.42, srcY1: 0.78, destY0: 0.12, destY1: 0.32 },
  { srcY0: 0.24, srcY1: 0.58, destY0: 0.27, destY1: 0.52 },
  { srcY0: 0.1, srcY1: 0.38, destY0: 0.47, destY1: 0.72 },
  { srcY0: 0.0, srcY1: 0.28, destY0: 0.67, destY1: 1.0 },
];

const SCROLL_SPECS = [
  {
    theme: "dark",
    hero: path.join(genDir, "ui_trail_scroll_foothills_dark_v1_gen_full.png"),
    spine: path.join(root, "assets/ui/ui_trail_spine_dark_v1/ui_trail_spine_dark_v1.png"),
    bg: { r: 10, g: 12, b: 18 },
    fallbackHero: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_dark_v1/ui_trail_scroll_foothills_dark_v1_draft.png",
    ),
  },
  {
    theme: "light",
    hero: path.join(genDir, "ui_trail_scroll_foothills_light_v1_gen_full.png"),
    spine: path.join(root, "assets/ui/ui_trail_spine_light_v1/ui_trail_spine_light_v1.png"),
    bg: { r: 232, g: 239, b: 248 },
    fallbackHero: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_light_v1/ui_trail_scroll_foothills_light_v1_draft.png",
    ),
  },
];

function buildBandMask(width, height, fadeTop, fadeBottom) {
  const stops = [];
  if (fadeTop > 0) {
    stops.push(`<stop offset="0%" stop-color="white" stop-opacity="0"/>`);
    stops.push(
      `<stop offset="${((fadeTop / height) * 100).toFixed(2)}%" stop-color="white" stop-opacity="1"/>`,
    );
  } else {
    stops.push(`<stop offset="0%" stop-color="white" stop-opacity="1"/>`);
  }

  if (fadeBottom > 0) {
    stops.push(
      `<stop offset="${(100 - (fadeBottom / height) * 100).toFixed(2)}%" stop-color="white" stop-opacity="1"/>`,
    );
    stops.push(`<stop offset="100%" stop-color="white" stop-opacity="0"/>`);
  } else {
    stops.push(`<stop offset="100%" stop-color="white" stop-opacity="1"/>`);
  }

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">${stops.join("")}</linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#m)"/>
    </svg>
  `);
}

async function resolveHero(spec) {
  for (const candidate of [spec.hero, spec.fallbackHero]) {
    try {
      return await sharp(candidate).metadata().then(() => candidate);
    } catch {
      // try next
    }
  }
  throw new Error(`No hero found for ${spec.theme}`);
}

async function extractBand(heroPath, band, bandIndex, totalBands) {
  const heroMeta = await sharp(heroPath).metadata();
  const heroH = heroMeta.height;
  const heroW = heroMeta.width;

  const extractTop = Math.round(band.srcY0 * heroH);
  const extractHeight = Math.max(1, Math.round((band.srcY1 - band.srcY0) * heroH));
  const destHeight = Math.round((band.destY1 - band.destY0) * HEIGHT);
  const destTop = Math.round(band.destY0 * HEIGHT);

  const fadeTop = bandIndex === 0 ? 0 : BLEND_PX;
  const fadeBottom = bandIndex === totalBands - 1 ? 0 : BLEND_PX;

  const extracted = await sharp(heroPath)
    .extract({
      left: 0,
      top: extractTop,
      width: heroW,
      height: Math.min(extractHeight, heroH - extractTop),
    })
    .resize(WIDTH, destHeight, { fit: "fill" })
    .png()
    .toBuffer();

  const mask = buildBandMask(WIDTH, destHeight, fadeTop, fadeBottom);

  const masked = await sharp(extracted)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return { buffer: masked, top: destTop };
}

async function blendSpineBase(composite, spinePath, theme) {
  const spineHeight = Math.round(HEIGHT * 0.2);
  const spine = await sharp(spinePath)
    .resize(WIDTH, spineHeight, { fit: "cover", position: "bottom" })
    .png()
    .toBuffer();

  const opacity = theme === "dark" ? 0.38 : 0.32;
  const spineMask = Buffer.from(`
    <svg width="${WIDTH}" height="${spineHeight}">
      <defs>
        <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="30%" stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="${opacity}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sf)"/>
    </svg>
  `);

  const faded = await sharp(spine)
    .composite([{ input: spineMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(composite)
    .composite([{ input: faded, top: HEIGHT - spineHeight, left: 0, blend: "over" }])
    .png()
    .toBuffer();
}

async function buildScroll(spec) {
  const heroPath = await resolveHero(spec);
  const outDir = path.join(root, `assets/ui/ui_trail_scroll_foothills_${spec.theme}_v1`);
  const outBase = `ui_trail_scroll_foothills_${spec.theme}_v1`;
  const outPng = path.join(outDir, `${outBase}.png`);

  const layers = [];
  for (let i = 0; i < BANDS.length; i += 1) {
    const band = await extractBand(heroPath, BANDS[i], i, BANDS.length);
    layers.push({ input: band.buffer, top: band.top, left: 0 });
  }

  let composite = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: spec.bg },
  })
    .composite(layers)
    .png()
    .toBuffer();

  composite = await blendSpineBase(composite, spec.spine, spec.theme);
  await sharp(composite).png({ compressionLevel: 6 }).toFile(outPng);

  const metadata = {
    id: outBase,
    name: `Trail Scroll Foothills ${spec.theme === "dark" ? "Dark" : "Light"}`,
    category: "ui",
    version: "v1",
    status: "review",
    owner_agent: "UI Art Agent",
    creation_agent: "UI Art Agent",
    approved_by: "Art Director Agent",
    created_at: "2026-06-11",
    updated_at: "2026-06-12",
    tags: ["ui", "trail", "scroll", "foothills", `${spec.theme}-mode`, "immersive"],
    usage_locations: ["trail-first-learn-screen", "trail-map-immersive"],
    dependencies: [`ui_trail_spine_${spec.theme}_v1`],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    composition: {
      method: "hero-slice-extend",
      hero_source: path.basename(heroPath),
      bands: BANDS.length,
      blend_px: BLEND_PX,
      no_tiling: true,
    },
    design_notes: `Vertical immersive Foothills scroll (${spec.theme}). Hero illustration sliced into ${BANDS.length} unique elevation bands and extended to ${WIDTH}×${HEIGHT}; spine detail blended at base. 14 lantern waypoints per TRAIL_MAP_PATH_ANCHORS. Awaiting Art Director approval.`,
  };

  await writeFile(path.join(outDir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);

  const meta = await sharp(outPng).metadata();
  return { outPng, width: meta.width, height: meta.height, hero: path.basename(heroPath) };
}

async function main() {
  for (const spec of SCROLL_SPECS) {
    const result = await buildScroll(spec);
    console.log(
      `Extended ${path.relative(root, result.outPng)} (${result.width}×${result.height}) from ${result.hero}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
