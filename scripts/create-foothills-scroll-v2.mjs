/**
 * Composes foothills trail scroll v2 from AI-authored elevation bands.
 * Single continuous 1536×5120 scroll — no spine tiling, no procedural path overlay.
 *
 * Usage: node scripts/create-foothills-scroll-v2.mjs
 */
import { mkdir, writeFile, access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WIDTH = 1536;
const HEIGHT = 5120;

/** Foothills v2 uses hand-painted plates; anchors live in trail-path-anchors.json */
  {
    theme: "dark",
    version: "v2",
    plates: {
      summit: "foothills_v2_dark_summit.png",
      mid: "foothills_v2_dark_mid.png",
      base: "foothills_v2_dark_base.png",
    },
    skyTop: "#0a0e18",
    skyMid: "#12182a",
    skyLower: "#1a2540",
    mist: "rgba(26,35,55,0.45)",
  },
  {
    theme: "light",
    version: "v2",
    plates: {
      summit: "foothills_v2_light_summit.png",
      mid: "foothills_v2_light_mid.png",
      base: "foothills_v2_light_base.png",
    },
    skyTop: "#E8EFF8",
    skyMid: "#D8E8F4",
    skyLower: "#C8DDD8",
    mist: "rgba(255,255,255,0.42)",
  },
];

const BANDS = [
  { key: "summit", top: 0, height: 2100, fadeBottom: 520, crop: "top" },
  { key: "mid", top: 1580, height: 2100, fadeTop: 480, fadeBottom: 520, crop: "center" },
  { key: "base", top: HEIGHT - 1900, height: 1900, fadeTop: 420, crop: "bottom" },
];

async function resolvePlate(filename) {
  const candidates = [
    path.join(root, "assets", "ui", "_pipeline", "_scroll_plates", filename),
    path.join(root, ".cursor", "projects", "d-NOBORU", "assets", filename),
    path.join(root, "assets", filename),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error(`Plate not found: ${filename}`);
}

function buildBandMask(band) {
  const h = band.height;
  const fadeTop = band.fadeTop ?? 0;
  const fadeBottom = band.fadeBottom ?? 0;
  const topStop = h === 0 ? 0 : ((fadeTop / h) * 100).toFixed(1);
  const bottomStop = h === 0 ? 100 : (100 - (fadeBottom / h) * 100).toFixed(1);

  return Buffer.from(`
    <svg width="${WIDTH}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="${topStop}%" stop-color="white" stop-opacity="1"/>
          <stop offset="${bottomStop}%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#fade)"/>
    </svg>
  `);
}

function buildSkySvg(spec) {
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${spec.skyTop}"/>
          <stop offset="40%" stop-color="${spec.skyMid}"/>
          <stop offset="100%" stop-color="${spec.skyLower}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sky)"/>
    </svg>
  `);
}

function buildAtmosphereSvg(spec) {
  const veils = [
    { cy: 0.22, ry: 0.055, opacity: 0.32 },
    { cy: 0.48, ry: 0.065, opacity: 0.38 },
    { cy: 0.72, ry: 0.07, opacity: 0.34 },
  ];

  const ellipses = veils
    .map(
      (v) => `
    <ellipse cx="${WIDTH / 2}" cy="${(v.cy * HEIGHT).toFixed(0)}"
      rx="${(WIDTH * 0.52).toFixed(0)}" ry="${(v.ry * HEIGHT).toFixed(0)}"
      fill="${spec.mist}" opacity="${v.opacity}"/>
  `,
    )
    .join("\n");

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${ellipses}
    </svg>
  `);
}

async function loadBandPlate(sourcePath, band) {
  const mask = buildBandMask(band);
  const position = band.crop === "top" ? "top" : band.crop === "bottom" ? "bottom" : "centre";

  return sharp(sourcePath)
    .resize(WIDTH, band.height, { fit: "cover", position })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function composeScroll(spec) {
  const outDir = path.join(
    root,
    "assets",
    "ui",
    `ui_trail_scroll_foothills_${spec.theme}_${spec.version}`,
  );
  const outBase = `ui_trail_scroll_foothills_${spec.theme}_${spec.version}`;
  const outPng = path.join(outDir, `${outBase}.png`);
  await mkdir(outDir, { recursive: true });

  const plateDir = path.join(outDir, "plates");
  await mkdir(plateDir, { recursive: true });

  const composites = [];
  for (const band of BANDS) {
    const source = await resolvePlate(spec.plates[band.key]);
    await copyFile(source, path.join(plateDir, `${band.key}.png`));
    const plate = await loadBandPlate(source, band);
    composites.push({ input: plate, top: band.top, left: 0 });
  }

  const sky = buildSkySvg(spec);
  const atmosphere = buildAtmosphereSvg(spec);

  const result = await sharp(sky)
    .composite([...composites, { input: atmosphere, top: 0, left: 0, blend: "over" }])
    .png()
    .toBuffer();

  await writeFile(outPng, result);

  const metadata = {
    id: outBase,
    name: `Trail Scroll Foothills ${spec.theme === "dark" ? "Dark" : "Light"} v2`,
    category: "ui",
    version: spec.version,
    status: "approved",
    owner_agent: "UI Art Agent",
    creation_agent: "UI Art Agent",
    approved_by: null,
    created_at: "2026-06-12",
    updated_at: "2026-06-12",
    tags: ["ui", "trail", "scroll", "foothills", `${spec.theme}-mode`, "immersive", "v2"],
    usage_locations: ["trail-first-learn-screen", "trail-map-immersive"],
    dependencies: [`ui_trail_spine_${spec.theme}_v1`],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    composition: {
      method: "ai-plate-band-composite",
      plates: Object.keys(spec.plates),
      no_tiling: true,
      no_path_overlay: true,
      anchor_contract: `regions.foothills.${spec.theme}`,
    },
    design_notes: `Foothills scroll v2 (${spec.theme}). New AI-authored environment bands (summit/mid/base) cross-faded into single 1536×5120 scroll. Welcoming foothills meadow-to-summit ascent. Painted paths in source plates; node positions use SPEC S-curve anchors.`,
  };

  await writeFile(path.join(outDir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);

  const meta = await sharp(outPng).metadata();
  return { outPng, width: meta.width, height: meta.height };
}

async function main() {
  for (const spec of SCROLL_SPECS) {
    const { outPng, width, height } = await composeScroll(spec);
    console.log(`Composed ${path.relative(root, outPng)} (${width}x${height})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
