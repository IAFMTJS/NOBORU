/**
 * Stitches unique AI-authored elevation segments into seamless 1536×5120 trail scrolls.
 * No spine tiling — each vertical band is a distinct generated segment.
 * Path glow + lanterns calibrated to TRAIL_MAP_PATH_ANCHORS.
 */
import { mkdir, writeFile, access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cursorAssets = path.join(root, ".cursor", "projects", "d-NOBORU", "assets");

const WIDTH = 1536;
const HEIGHT = 5120;
const SEGMENT_COUNT = 4;
const BLEND = 320;
const SEGMENT_HEIGHT = Math.ceil(
  (HEIGHT + (SEGMENT_COUNT - 1) * BLEND) / SEGMENT_COUNT,
);

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
    spine: "ui_trail_spine_dark_v1",
    segments: [
      { key: "summit", files: ["segments/summit.png", "ui_trail_scroll_dark_seg_summit.png"] },
      { key: "midhigh", files: ["segments/midhigh.png", "ui_trail_scroll_dark_seg_midhigh.png"] },
      { key: "mid", files: ["segments/mid.png", "ui_trail_scroll_dark_seg_mid.png"] },
      {
        key: "base",
        files: [
          "segments/base.png",
          "ui_trail_scroll_foothills_dark_v1_draft.png",
        ],
      },
    ],
    pathCore: "#FFB347",
    pathMid: "#FF6B4A",
    pathGlow: "#FF3D2E",
    pathDim: "#8a3a28",
    lanternStone: "#4A5568",
    lanternGlow: "#E8B84A",
    lanternCore: "#F5D78E",
  },
  {
    region: "foothills",
    theme: "light",
    spine: "ui_trail_spine_light_v1",
    segments: [
      { key: "summit", files: ["segments/summit.png", "ui_trail_scroll_light_seg_summit.png"] },
      { key: "midhigh", files: ["segments/midhigh.png", "ui_trail_scroll_light_seg_midhigh.png"] },
      { key: "mid", files: ["segments/mid.png", "ui_trail_scroll_light_seg_mid.png"] },
      {
        key: "base",
        files: [
          "segments/base.png",
          "ui_trail_scroll_foothills_light_v1_draft.png",
        ],
      },
    ],
    pathCore: "#FFE4A8",
    pathMid: "#E8A84B",
    pathGlow: "#D64045",
    pathDim: "#A84840",
    lanternStone: "#8B939E",
    lanternGlow: "#D4A84B",
    lanternCore: "#F0D998",
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

function buildLanternSvg(x, y, spec, scale = 1) {
  const s = scale;
  return `
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" opacity="0.92">
      <ellipse cx="0" cy="14" rx="30" ry="10" fill="${spec.pathGlow}" opacity="0.18"/>
      <ellipse cx="0" cy="12" rx="20" ry="6" fill="${spec.lanternStone}" opacity="0.85"/>
      <rect x="-4" y="-48" width="8" height="58" fill="${spec.lanternStone}" rx="2"/>
      <rect x="-16" y="-62" width="32" height="18" fill="${spec.lanternStone}" rx="3" opacity="0.9"/>
      <rect x="-10" y="-57" width="20" height="11" fill="${spec.lanternCore}" opacity="0.85"/>
      <ellipse cx="0" cy="-52" rx="16" ry="6" fill="${spec.lanternGlow}" opacity="0.3"/>
    </g>
  `;
}

function buildLanternOverlaySvg(spec) {
  const pixelAnchors = PATH_ANCHORS.map(anchorToPixel);
  const lanterns = pixelAnchors
    .map((point, i) => {
      const scale = 0.72 + (i / PATH_ANCHORS.length) * 0.18;
      return buildLanternSvg(point.x, point.y, spec, scale);
    })
    .join("\n");

  return `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lanternBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>
      <g filter="url(#lanternBloom)" opacity="0.42">${lanterns}</g>
    </svg>
  `;
}

function segmentBlendMask(height, fadeTop, fadeBottom) {
  const topStop = fadeTop === 0 ? 0 : ((fadeTop / height) * 100).toFixed(1);
  const bottomStart =
    fadeBottom === 0 ? 100 : (100 - (fadeBottom / height) * 100).toFixed(1);

  return Buffer.from(`
    <svg width="${WIDTH}" height="${height}">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="${topStop}%" stop-color="white" stop-opacity="1"/>
          <stop offset="${bottomStart}%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#fade)"/>
    </svg>
  `);
}

async function resolveSegmentFile(candidates, outDir) {
  const searchPaths = [];

  for (const file of candidates) {
    searchPaths.push(
      path.join(outDir, file),
      path.join(outDir, path.basename(file)),
      path.join(cursorAssets, path.basename(file)),
      path.join(cursorAssets, file),
      path.join(root, "assets", "ui", file),
      path.join(root, file),
    );
  }

  for (const candidate of searchPaths) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error(`Segment not found: ${candidates.join(", ")}`);
}

async function loadSegmentBuffer(segmentPath) {
  return sharp(segmentPath)
    .resize(WIDTH, SEGMENT_HEIGHT, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .png()
    .toBuffer();
}

async function maskedSegment(buffer, index, total) {
  const fadeTop = index === 0 ? 0 : BLEND;
  const fadeBottom = 0;

  if (fadeTop === 0 && fadeBottom === 0) {
    return buffer;
  }

  return sharp(buffer)
    .composite([
      {
        input: segmentBlendMask(SEGMENT_HEIGHT, fadeTop, fadeBottom),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function stitchSegments(segmentBuffers) {
  const base = await maskedSegment(segmentBuffers[0], 0, segmentBuffers.length);
  let canvas = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 15, g: 17, b: 21, alpha: 1 },
    },
  })
    .composite([{ input: base, top: 0, left: 0 }])
    .png()
    .toBuffer();

  for (let index = 1; index < segmentBuffers.length; index += 1) {
    const top = index * (SEGMENT_HEIGHT - BLEND);
    const layer = await maskedSegment(
      segmentBuffers[index],
      index,
      segmentBuffers.length,
    );

    canvas = await sharp(canvas)
      .composite([{ input: layer, top, left: 0 }])
      .png()
      .toBuffer();
  }

  return canvas;
}

async function archiveSegmentSources(spec, outDir) {
  const segDir = path.join(outDir, "segments");
  await mkdir(segDir, { recursive: true });

  for (const segment of spec.segments) {
    const source = await resolveSegmentFile(segment.files, outDir);
    const dest = path.join(segDir, `${segment.key}.png`);
    await copyFile(source, dest);
  }
}

async function generateScrollAsset(spec) {
  const outDir = path.join(
    root,
    "assets",
    "ui",
    `ui_trail_scroll_${spec.region}_${spec.theme}_v1`,
  );
  const outBase = `ui_trail_scroll_${spec.region}_${spec.theme}_v1`;
  const outPng = path.join(outDir, `${outBase}.png`);

  await mkdir(outDir, { recursive: true });
  await archiveSegmentSources(spec, outDir);

  const segmentBuffers = [];
  for (let i = 0; i < spec.segments.length; i += 1) {
    const segment = spec.segments[i];
    const source = await resolveSegmentFile(segment.files, outDir);
    segmentBuffers.push(await loadSegmentBuffer(source));
  }

  const stitched = await stitchSegments(segmentBuffers);
  const lanternOverlay = Buffer.from(buildLanternOverlaySvg(spec));

  const composite = await sharp(stitched)
    .composite([{ input: lanternOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();

  await writeFile(outPng, composite);

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
    dependencies: [spec.spine],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    design_notes:
      "Vertical immersive Foothills scroll. Four unique AI-authored elevation segments (summit/midhigh/mid/base) cross-faded with 320px overlaps — no spine tiling or segment repetition. Painted path continuity from segments; subtle lantern markers at TRAIL_MAP_PATH_ANCHORS for node calibration. Awaiting Art Director approval.",
  };

  await writeFile(
    path.join(outDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );

  return outPng;
}

async function main() {
  for (const spec of SCROLL_SPECS) {
    const out = await generateScrollAsset(spec);
    const meta = await sharp(out).metadata();
    console.log(
      `Generated ${path.relative(root, out)} (${meta.width}x${meta.height})`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
