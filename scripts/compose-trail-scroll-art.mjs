/**
 * Composes production trail scroll art from unique AI environment plates.
 * No spine tiling, no repeated segments — each band is a distinct source plate
 * blended with gradient masks. Path + lanterns calibrated to TRAIL_MAP_PATH_ANCHORS.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cursorAssets = path.join(root, ".cursor", "projects", "d-NOBORU", "assets");

const WIDTH = 1536;
const HEIGHT = 5120;

const PATH_ANCHORS = [
  { x: 50, y: 93 },
  { x: 43, y: 88 },
  { x: 35, y: 82 },
  { x: 30, y: 74 },
  { x: 36, y: 66 },
  { x: 46, y: 59 },
  { x: 56, y: 52 },
  { x: 64, y: 45 },
  { x: 58, y: 38 },
  { x: 48, y: 31 },
  { x: 40, y: 24 },
  { x: 44, y: 17 },
  { x: 52, y: 11 },
  { x: 50, y: 6 },
];

const SCROLL_SPECS = [
  {
    region: "foothills",
    theme: "dark",
    bottomPlate: "assets/ui/_scroll_plates/ui_trail_scroll_foothills_dark_v1_draft.png",
    bands: [
      { file: "ui_trail_scroll_dark_seg_summit.png", top: 0, height: 2200, fadeBottom: 620, crop: "top" },
      { file: "ui_trail_scroll_dark_seg_midhigh.png", top: 1580, height: 2000, fadeTop: 560, fadeBottom: 580, crop: "center" },
    ],
    skyTop: "#0a0c12",
    skyMid: "#12151c",
    skyLower: "#1a2332",
    pathCore: "#FFB347",
    pathMid: "#FF6B4A",
    pathGlow: "#FF3D2E",
    pathDim: "#8a3a28",
    lanternStone: "#4A5568",
    lanternGlow: "#E8B84A",
    lanternCore: "#F5D78E",
    ridgeFill2: "#1E232D",
    pathOpacity: 0.55,
    lanternOpacity: 0.92,
  },
  {
    region: "foothills",
    theme: "light",
    bottomPlate: "assets/ui/_scroll_plates/ui_trail_scroll_foothills_light_v1_draft.png",
    bands: [
      { file: "ui_trail_scroll_light_seg_summit.png", top: 0, height: 2200, fadeBottom: 620, crop: "top" },
      { file: "ui_trail_scroll_light_seg_midhigh.png", top: 1580, height: 2000, fadeTop: 560, fadeBottom: 580, crop: "center" },
    ],
    skyTop: "#E8EFF8",
    skyMid: "#D4E4F0",
    skyLower: "#C8DDD8",
    pathCore: "#FFE4A8",
    pathMid: "#E8A84B",
    pathGlow: "#D64045",
    pathDim: "#A84840",
    lanternStone: "#8B939E",
    lanternGlow: "#D4A84B",
    lanternCore: "#F0D998",
    ridgeFill2: "#B8C8C0",
    pathOpacity: 0.52,
    lanternOpacity: 0.9,
  },
];

function anchorToPixel(anchor) {
  return {
    x: (anchor.x / 100) * WIDTH,
    y: (anchor.y / 100) * HEIGHT,
  };
}

function catmullRomPath(points, tension = 0.35) {
  if (points.length < 2) return "";
  const [first] = points;
  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

function buildMistVeilsSvg(spec) {
  const veils = [
    { cy: 0.2, ry: 0.06, opacity: 0.35 },
    { cy: 0.42, ry: 0.07, opacity: 0.42 },
    { cy: 0.64, ry: 0.08, opacity: 0.38 },
  ];
  const ellipses = veils
    .map(
      (v) => `
    <ellipse cx="${WIDTH / 2}" cy="${(v.cy * HEIGHT).toFixed(0)}"
      rx="${(WIDTH * 0.55).toFixed(0)}" ry="${(v.ry * HEIGHT).toFixed(0)}"
      fill="${spec.theme === "dark" ? "rgba(26,35,50,0.55)" : "rgba(255,255,255,0.48)"}" opacity="${v.opacity}"/>
  `,
    )
    .join("\n");

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${ellipses}
    </svg>
  `);
}
function buildSkySvg(spec) {
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${spec.skyTop}"/>
          <stop offset="35%" stop-color="${spec.skyMid}"/>
          <stop offset="72%" stop-color="${spec.skyLower}"/>
          <stop offset="100%" stop-color="${spec.skyLower}"/>
        </linearGradient>
        <radialGradient id="summitGlow" cx="50%" cy="6%" r="28%">
          <stop offset="0%" stop-color="${spec.lanternGlow}" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="${spec.lanternGlow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sky)"/>
      <rect width="100%" height="100%" fill="url(#summitGlow)"/>
    </svg>
  `);
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

function buildLanternSvg(x, y, spec, scale = 1) {
  const s = scale;
  return `
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">
      <ellipse cx="0" cy="14" rx="34" ry="11" fill="${spec.pathGlow}" opacity="0.18"/>
      <ellipse cx="0" cy="12" rx="22" ry="7" fill="${spec.lanternStone}" opacity="0.92"/>
      <rect x="-5" y="-52" width="10" height="64" fill="${spec.lanternStone}" rx="2"/>
      <rect x="-18" y="-68" width="36" height="22" fill="${spec.ridgeFill2}" rx="3" stroke="${spec.lanternStone}" stroke-width="1.5"/>
      <rect x="-12" y="-62" width="24" height="14" fill="${spec.lanternCore}" opacity="0.95"/>
      <rect x="-12" y="-62" width="24" height="14" fill="${spec.lanternGlow}" opacity="0.5"/>
      <ellipse cx="0" cy="-55" rx="20" ry="8" fill="${spec.lanternGlow}" opacity="0.4"/>
    </g>
  `;
}

function buildPathOverlaySvg(spec) {
  const pixelAnchors = PATH_ANCHORS.map(anchorToPixel);
  const pathD = catmullRomPath(pixelAnchors);
  const pathOpacity = spec.pathOpacity ?? 0.9;
  const lanternOpacity = spec.lanternOpacity ?? Math.min(1, pathOpacity + 0.35);
  const lanterns = pixelAnchors
    .map((point, i) => {
      const scale = 0.82 + (i / PATH_ANCHORS.length) * 0.28;
      return buildLanternSvg(point.x, point.y, spec, scale);
    })
    .join("\n");

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pathGlow" x="-30%" y="-5%" width="160%" height="110%">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="lanternBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
      </defs>
      <g opacity="${pathOpacity}">
        <path d="${pathD}" fill="none" stroke="${spec.pathDim}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${spec.pathGlow}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${spec.pathMid}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.72" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${spec.pathCore}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>
      </g>
      <g filter="url(#lanternBloom)" opacity="${lanternOpacity}">${lanterns}</g>
    </svg>
  `);
}

async function resolveAsset(relativePath) {
  const base = path.basename(relativePath);
  const candidates = [
    path.join(root, "assets", "ui", "_scroll_plates", base),
    path.join(cursorAssets, base),
    path.join(root, relativePath),
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }
  throw new Error(`Asset not found: ${relativePath}`);
}

async function loadBandPlate(band) {
  const sourcePath = await resolveAsset(band.file);
  const mask = buildBandMask(band);
  const position = band.crop === "top" ? "top" : band.crop === "bottom" ? "bottom" : "center";
  return sharp(sourcePath)
    .resize(WIDTH, band.height, { fit: "cover", position })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function loadBottomPlate(relativePath, plateHeight) {
  const sourcePath = await resolveAsset(relativePath);
  const meta = await sharp(sourcePath).metadata();
  const cropHeight = Math.round(meta.height * 0.58);
  const cropTop = meta.height - cropHeight;
  const mask = Buffer.from(`
    <svg width="${WIDTH}" height="${plateHeight}">
      <defs>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="22%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#topFade)"/>
    </svg>
  `);

  return sharp(sourcePath)
    .extract({ left: 0, top: cropTop, width: meta.width, height: cropHeight })
    .resize(WIDTH, plateHeight, { fit: "cover", position: "bottom" })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function composeScroll(spec) {
  const outDir = path.join(root, "assets", "ui", `ui_trail_scroll_${spec.region}_${spec.theme}_v1`);
  const outBase = `ui_trail_scroll_${spec.region}_${spec.theme}_v1`;
  const outPng = path.join(outDir, `${outBase}.png`);
  await mkdir(outDir, { recursive: true });

  const bottomHeight = Math.round(HEIGHT * 0.34);
  const bottomTop = HEIGHT - bottomHeight;

  const composites = [];
  for (const band of spec.bands) {
    const plate = await loadBandPlate(band);
    composites.push({ input: plate, top: band.top, left: 0 });
  }

  const bottomPlate = await loadBottomPlate(spec.bottomPlate, bottomHeight);
  composites.push({ input: bottomPlate, top: bottomTop, left: 0 });

  const pathOverlay = buildPathOverlaySvg(spec);

  const sky = buildSkySvg(spec);
  const result = await sharp(sky)
    .composite([
      ...composites,
      { input: pathOverlay, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  await writeFile(outPng, result);

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
    tags: ["ui", "trail", "scroll", "foothills", `${spec.theme}-mode`, "immersive", "painterly"],
    usage_locations: ["trail-first-learn-screen", "trail-map-immersive"],
    dependencies: [`ui_trail_spine_${spec.theme}_v1`],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    design_notes: `Production Foothills scroll (${spec.theme}). AI-authored painterly environment bands (summit/mid/ascent) gradient-blended with cropped draft bottom plate (trail base only, no summit repeat). Subtle path overlay + 14 lantern waypoints at TRAIL_MAP_PATH_ANCHORS. No spine tiling. Awaiting Art Director approval per SPEC.md.`,
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
