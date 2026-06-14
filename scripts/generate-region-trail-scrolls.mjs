/**
 * Builds immersive 1536×5120 trail scroll art for each region from its hero banner.
 * Composes unique elevation bands (summit → base), region sky gradients, and path anchors.
 *
 * Usage:
 *   node scripts/generate-region-trail-scrolls.mjs
 *   node scripts/generate-region-trail-scrolls.mjs --trail=2
 *   node scripts/generate-region-trail-scrolls.mjs --trail=2 --region=mount-n5
 *   node scripts/generate-region-trail-scrolls.mjs --all-trails
 *   node scripts/generate-region-trail-scrolls.mjs --journey-v3
 */
import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const JOURNEY_V3 = process.argv.includes("--journey-v3");

const anchorContract = JSON.parse(
  await readFile(
    path.join(root, "lib/design-system/trail-path-anchors.json"),
    "utf8",
  ),
);

const journeyContract = JOURNEY_V3
  ? JSON.parse(
      await readFile(
        path.join(root, "lib/design-system/journey-path-contracts.json"),
        "utf8",
      ),
    )
  : null;

const pathContract = JOURNEY_V3 ? journeyContract : anchorContract;

const WIDTH = anchorContract.scrollArtWidth;
const HEIGHT = anchorContract.scrollArtHeight;

const ALL_REGION_SLUGS = Object.keys(anchorContract.regions);

/** Primary trail uses hand-authored v2 for foothills; trail-2 is procedural for all regions. */
const PRIMARY_GENERATED_REGIONS = [
  "forest-trail",
  "mount-n5",
  "mount-n4",
  "mount-n3",
  "mount-n2",
  "mount-n1",
  "master-summit",
];

const THEMES = ["dark", "light"];

const REGION_LABELS = {
  foothills: "Foothills",
  "forest-trail": "Forest Trail",
  "mount-n5": "Mount N5",
  "mount-n4": "Mount N4",
  "mount-n3": "Mount N3",
  "mount-n2": "Mount N2",
  "mount-n1": "Mount N1",
  "master-summit": "Master Summit",
};

/** Per-region palette tuned to region-tokens + art-direction mood. */
const REGION_PALETTES = {
  foothills: {
    dark: {
      skyTop: "#0a0e18",
      skyMid: "#12182a",
      skyLower: "#1a2540",
      pathCore: "#FFD4A8",
      pathMid: "#C8A060",
      pathGlow: "#886840",
      pathDim: "#504030",
      lanternStone: "#484038",
      lanternGlow: "#E8C080",
      lanternCore: "#FFF0D0",
      ridgeFill2: "#1a2030",
    },
    light: {
      skyTop: "#E8EFF8",
      skyMid: "#D8E8F4",
      skyLower: "#C8DDD8",
      pathCore: "#FFE4A8",
      pathMid: "#C8A060",
      pathGlow: "#886840",
      pathDim: "#706050",
      lanternStone: "#988878",
      lanternGlow: "#C8A060",
      lanternCore: "#FFF8E8",
      ridgeFill2: "#C8D0C0",
    },
  },
  "forest-trail": {
    dark: {
      skyTop: "#081210",
      skyMid: "#0f1a16",
      skyLower: "#152820",
      pathCore: "#B8F0D0",
      pathMid: "#52B788",
      pathGlow: "#2D6A4F",
      pathDim: "#1a4030",
      lanternStone: "#3d5248",
      lanternGlow: "#7FD4A8",
      lanternCore: "#C8F0DC",
      ridgeFill2: "#1a2820",
    },
    light: {
      skyTop: "#E8F5EC",
      skyMid: "#D4EBDC",
      skyLower: "#C0E0CC",
      pathCore: "#FFE4A8",
      pathMid: "#52B788",
      pathGlow: "#2D6A4F",
      pathDim: "#3a6850",
      lanternStone: "#7a9488",
      lanternGlow: "#52B788",
      lanternCore: "#E8F5EC",
      ridgeFill2: "#B8D4C0",
    },
  },
  "mount-n5": {
    dark: {
      skyTop: "#080c14",
      skyMid: "#101828",
      skyLower: "#182840",
      pathCore: "#A8D4F0",
      pathMid: "#4A90C8",
      pathGlow: "#2563A8",
      pathDim: "#1a4060",
      lanternStone: "#3d5068",
      lanternGlow: "#6BB0E8",
      lanternCore: "#C8E4F8",
      ridgeFill2: "#1a2438",
    },
    light: {
      skyTop: "#E8F0F8",
      skyMid: "#D0E0F0",
      skyLower: "#B8D0E8",
      pathCore: "#FFE4A8",
      pathMid: "#4A90C8",
      pathGlow: "#2563A8",
      pathDim: "#3a6898",
      lanternStone: "#8898a8",
      lanternGlow: "#4A90C8",
      lanternCore: "#E8F0F8",
      ridgeFill2: "#A8C0D8",
    },
  },
  "mount-n4": {
    dark: {
      skyTop: "#0c0814",
      skyMid: "#141028",
      skyLower: "#201838",
      pathCore: "#C8B8F0",
      pathMid: "#7858C8",
      pathGlow: "#5840A8",
      pathDim: "#382868",
      lanternStone: "#484068",
      lanternGlow: "#9888E8",
      lanternCore: "#D8D0F8",
      ridgeFill2: "#201830",
    },
    light: {
      skyTop: "#F0ECF8",
      skyMid: "#E0D8F0",
      skyLower: "#D0C8E8",
      pathCore: "#FFE4A8",
      pathMid: "#7858C8",
      pathGlow: "#5840A8",
      pathDim: "#584898",
      lanternStone: "#9890a8",
      lanternGlow: "#7858C8",
      lanternCore: "#F0ECF8",
      ridgeFill2: "#C0B8D8",
    },
  },
  "mount-n3": {
    dark: {
      skyTop: "#080818",
      skyMid: "#101028",
      skyLower: "#181838",
      pathCore: "#A8B8F0",
      pathMid: "#4858B8",
      pathGlow: "#3848A0",
      pathDim: "#283060",
      lanternStone: "#404058",
      lanternGlow: "#7888E0",
      lanternCore: "#C8D0F8",
      ridgeFill2: "#181828",
    },
    light: {
      skyTop: "#ECECF8",
      skyMid: "#D8D8F0",
      skyLower: "#C8C8E8",
      pathCore: "#FFE4A8",
      pathMid: "#4858B8",
      pathGlow: "#3848A0",
      pathDim: "#485898",
      lanternStone: "#9090a8",
      lanternGlow: "#4858B8",
      lanternCore: "#ECECF8",
      ridgeFill2: "#B8B8D8",
    },
  },
  "mount-n2": {
    dark: {
      skyTop: "#0a0a0c",
      skyMid: "#141418",
      skyLower: "#1c1c22",
      pathCore: "#D0D4DC",
      pathMid: "#788898",
      pathGlow: "#586878",
      pathDim: "#384048",
      lanternStone: "#484850",
      lanternGlow: "#A0A8B8",
      lanternCore: "#E0E4EC",
      ridgeFill2: "#1c1c24",
    },
    light: {
      skyTop: "#F0F2F4",
      skyMid: "#E0E4E8",
      skyLower: "#D0D4D8",
      pathCore: "#FFE4A8",
      pathMid: "#788898",
      pathGlow: "#586878",
      pathDim: "#586868",
      lanternStone: "#989898",
      lanternGlow: "#788898",
      lanternCore: "#F0F2F4",
      ridgeFill2: "#C0C4C8",
    },
  },
  "mount-n1": {
    dark: {
      skyTop: "#040810",
      skyMid: "#081018",
      skyLower: "#0c1828",
      pathCore: "#88B0E8",
      pathMid: "#2858A0",
      pathGlow: "#184080",
      pathDim: "#102850",
      lanternStone: "#283848",
      lanternGlow: "#4888C8",
      lanternCore: "#A8C8F0",
      ridgeFill2: "#0c1420",
    },
    light: {
      skyTop: "#E8F0F8",
      skyMid: "#D0E0F0",
      skyLower: "#B8D0E8",
      pathCore: "#FFE4A8",
      pathMid: "#2858A0",
      pathGlow: "#184080",
      pathDim: "#285880",
      lanternStone: "#6888a8",
      lanternGlow: "#2858A0",
      lanternCore: "#E8F0F8",
      ridgeFill2: "#A0B8D0",
    },
  },
  "master-summit": {
    dark: {
      skyTop: "#100c04",
      skyMid: "#181008",
      skyLower: "#201810",
      pathCore: "#FFE8A0",
      pathMid: "#E8B040",
      pathGlow: "#D64045",
      pathDim: "#884830",
      lanternStone: "#504838",
      lanternGlow: "#F0C860",
      lanternCore: "#FFF0C0",
      ridgeFill2: "#201810",
    },
    light: {
      skyTop: "#FFF8E8",
      skyMid: "#F0E8D0",
      skyLower: "#E8D8B8",
      pathCore: "#FFE4A8",
      pathMid: "#E8B040",
      pathGlow: "#D64045",
      pathDim: "#A86840",
      lanternStone: "#A89878",
      lanternGlow: "#E8B040",
      lanternCore: "#FFF8E8",
      ridgeFill2: "#D8C8A8",
    },
  },
};

function parseArgs(argv) {
  const flags = {
    trail: 1,
    allTrails: argv.includes("--all-trails"),
    region: null,
    journeyV3: argv.includes("--journey-v3"),
  };

  for (const arg of argv) {
    if (arg.startsWith("--trail=")) {
      flags.trail = Number.parseInt(arg.slice("--trail=".length), 10);
    }
    if (arg.startsWith("--region=")) {
      flags.region = arg.slice("--region=".length);
    }
  }

  return flags;
}

function resolveTargetRegions(flags) {
  if (flags.region) {
    return [flags.region];
  }
  if (flags.journeyV3) {
    return ALL_REGION_SLUGS;
  }
  if (flags.trail >= 2) {
    return ALL_REGION_SLUGS;
  }
  return PRIMARY_GENERATED_REGIONS;
}

function slugToRegionAssetBase(slug) {
  return `region_${slug.replace(/-/g, "_")}_v1`;
}

function resolvePathAnchors(regionSlug, theme, trailNumber) {
  const region = pathContract.regions[regionSlug];
  if (!region) {
    throw new Error(`Unknown region slug: ${regionSlug}`);
  }
  if (trailNumber <= 1) {
    return region.spine?.[theme] ?? region[theme];
  }
  const continuation = region.trails?.[trailNumber - 2]?.[theme];
  if (!continuation) {
    throw new Error(`Missing trail-${trailNumber} anchors for ${regionSlug}/${theme}`);
  }
  return continuation;
}

function resolveAssetBase(regionSlug, theme, trailNumber) {
  if (JOURNEY_V3 && trailNumber <= 1) {
    return `ui_trail_scroll_${regionSlug}_${theme}_v3`;
  }
  if (trailNumber <= 1) {
    return `ui_trail_scroll_${regionSlug}_${theme}_v1`;
  }
  return `ui_trail_scroll_${regionSlug}_trail-${trailNumber}_${theme}_v1`;
}

function resolveAnchorContractKey(regionSlug, theme, trailNumber) {
  if (JOURNEY_V3) {
    if (trailNumber <= 1) {
      return `journey-path-contracts.regions.${regionSlug}.spine.${theme}`;
    }
    return `journey-path-contracts.regions.${regionSlug}.trails[${trailNumber - 2}].${theme}`;
  }
  if (trailNumber <= 1) {
    return `regions.${regionSlug}.${theme}`;
  }
  return `regions.${regionSlug}.trails[${trailNumber - 2}].${theme}`;
}

async function resolveFoothillsV2Base(theme) {
  const base = `ui_trail_scroll_foothills_${theme}_v2`;
  const pngPath = path.join(root, "assets", "ui", base, `${base}.png`);
  await access(pngPath);
  return readFile(pngPath);
}

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

function buildSkySvg(palette, theme, trailNumber) {
  const summitOpacity = trailNumber >= 2 ? "0.22" : theme === "dark" ? "0.16" : "0.12";
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.skyTop}"/>
          <stop offset="35%" stop-color="${palette.skyMid}"/>
          <stop offset="72%" stop-color="${palette.skyLower}"/>
          <stop offset="100%" stop-color="${palette.skyLower}"/>
        </linearGradient>
        <radialGradient id="summitGlow" cx="50%" cy="6%" r="28%">
          <stop offset="0%" stop-color="${palette.lanternGlow}" stop-opacity="${summitOpacity}"/>
          <stop offset="100%" stop-color="${palette.lanternGlow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sky)"/>
      <rect width="100%" height="100%" fill="url(#summitGlow)"/>
    </svg>
  `);
}

function buildBandMask(height, fadeTop, fadeBottom) {
  const topStop = fadeTop === 0 ? 0 : ((fadeTop / height) * 100).toFixed(1);
  const bottomStop =
    fadeBottom === 0 ? 100 : (100 - (fadeBottom / height) * 100).toFixed(1);

  return Buffer.from(`
    <svg width="${WIDTH}" height="${height}" xmlns="http://www.w3.org/2000/svg">
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

function buildLanternSvg(x, y, palette, scale = 1) {
  const s = scale;
  return `
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">
      <ellipse cx="0" cy="14" rx="34" ry="11" fill="${palette.pathGlow}" opacity="0.18"/>
      <ellipse cx="0" cy="12" rx="22" ry="7" fill="${palette.lanternStone}" opacity="0.92"/>
      <rect x="-5" y="-52" width="10" height="64" fill="${palette.lanternStone}" rx="2"/>
      <rect x="-18" y="-68" width="36" height="22" fill="${palette.ridgeFill2}" rx="3" stroke="${palette.lanternStone}" stroke-width="1.5"/>
      <rect x="-12" y="-62" width="24" height="14" fill="${palette.lanternCore}" opacity="0.95"/>
      <rect x="-12" y="-62" width="24" height="14" fill="${palette.lanternGlow}" opacity="0.5"/>
      <ellipse cx="0" cy="-55" rx="20" ry="8" fill="${palette.lanternGlow}" opacity="0.4"/>
    </g>
  `;
}

function buildPathOverlaySvg(palette, theme, regionSlug, trailNumber) {
  const pathAnchors = resolvePathAnchors(regionSlug, theme, trailNumber);
  const pixelAnchors = pathAnchors.map(anchorToPixel);
  const pathD = catmullRomPath(pixelAnchors);
  const pathOpacity = theme === "dark" ? 0.58 : 0.52;
  const lanternOpacity = theme === "dark" ? 0.9 : 0.85;
  const lanterns = pixelAnchors
    .map((point, i) => {
      const scale = 0.82 + (i / pathAnchors.length) * 0.28;
      return buildLanternSvg(point.x, point.y, palette, scale);
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
        <path d="${pathD}" fill="none" stroke="${palette.pathDim}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${palette.pathGlow}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${palette.pathMid}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.72" filter="url(#pathGlow)"/>
        <path d="${pathD}" fill="none" stroke="${palette.pathCore}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>
      </g>
      <g filter="url(#lanternBloom)" opacity="${lanternOpacity}">${lanterns}</g>
    </svg>
  `);
}

async function resolveHeroPath(slug) {
  const base = slugToRegionAssetBase(slug);
  const heroPath = path.join(root, "assets", "regions", base, `${base}.png`);
  await access(heroPath);
  return heroPath;
}

async function loadHeroBand(heroPath, band, theme) {
  const meta = await sharp(heroPath).metadata();
  const heroHeight = meta.height ?? 1024;
  const heroWidth = meta.width ?? WIDTH;

  const extractTop = Math.round(heroHeight * band.extractTop);
  const extractHeight = Math.round(heroHeight * band.extractHeight);
  const extractLeft = Math.round(heroWidth * (band.extractLeft ?? 0));
  const extractWidth = Math.round(heroWidth * (band.extractWidth ?? 1));

  const mask = buildBandMask(band.height, band.fadeTop ?? 0, band.fadeBottom ?? 0);

  let pipeline = sharp(heroPath)
    .extract({
      left: extractLeft,
      top: extractTop,
      width: Math.min(extractWidth, heroWidth - extractLeft),
      height: Math.min(extractHeight, heroHeight - extractTop),
    })
    .resize(WIDTH, band.height, { fit: "cover", position: band.crop ?? "centre" });

  if (band.flip) {
    pipeline = pipeline.flop();
  }

  if (theme === "dark") {
    pipeline = pipeline.modulate({ brightness: 0.78, saturation: 1.08 });
  } else {
    pipeline = pipeline.modulate({ brightness: 1.12, saturation: 0.92 });
  }

  return pipeline
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function buildBandsForRegion(slug, trailNumber) {
  const summitBias = slug === "master-summit" ? 0 : slug.startsWith("mount-") ? 0.02 : 0;
  const trail2 = trailNumber >= 2;
  const flipDefault =
    trail2 ||
    slug === "forest-trail" ||
    slug === "mount-n3" ||
    (trail2 && slug !== "foothills");

  return [
    {
      key: "summit",
      top: 0,
      height: 2100,
      extractTop: (trail2 ? 0.06 : 0) + summitBias,
      extractHeight: 0.42,
      crop: "top",
      fadeBottom: 640,
      flip: flipDefault,
    },
    {
      key: "midhigh",
      top: 1480,
      height: 1900,
      extractTop: trail2 ? 0.24 : 0.18,
      extractHeight: 0.48,
      crop: "centre",
      fadeTop: 560,
      fadeBottom: 580,
      flip: !flipDefault,
    },
    {
      key: "mid",
      top: 2820,
      height: 1700,
      extractTop: trail2 ? 0.44 : 0.38,
      extractHeight: 0.52,
      crop: "centre",
      fadeTop: 520,
      fadeBottom: 520,
      flip: flipDefault,
    },
    {
      key: "base",
      top: HEIGHT - Math.round(HEIGHT * 0.36),
      height: Math.round(HEIGHT * 0.36),
      extractTop: trail2 ? 0.58 : 0.52,
      extractHeight: 0.48,
      crop: "bottom",
      fadeTop: 480,
      flip: !flipDefault,
    },
  ];
}

async function generateScroll(regionSlug, theme, trailNumber) {
  const palette = REGION_PALETTES[regionSlug][theme];
  const outBase = resolveAssetBase(regionSlug, theme, trailNumber);
  const outDir = path.join(root, "assets", "ui", outBase);
  const outPng = path.join(outDir, `${outBase}.png`);
  await mkdir(outDir, { recursive: true });

  let canvas;

  if (JOURNEY_V3 && trailNumber <= 1 && regionSlug === "foothills") {
    canvas = await resolveFoothillsV2Base(theme);
  } else {
    const heroPath = await resolveHeroPath(regionSlug);
    const bands = buildBandsForRegion(regionSlug, trailNumber);
    const composites = [];

    for (const band of bands) {
      const plate = await loadHeroBand(heroPath, band, theme);
      composites.push({ input: plate, top: band.top, left: 0 });
    }

    const sky = buildSkySvg(palette, theme, trailNumber);
    canvas = await sharp(sky).composite(composites).png().toBuffer();
  }

  const pathOverlay = buildPathOverlaySvg(palette, theme, regionSlug, trailNumber);
  canvas = await sharp(canvas)
    .composite([{ input: pathOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();

  await writeFile(outPng, canvas);

  const label = REGION_LABELS[regionSlug];
  const trailLabel = trailNumber >= 2 ? ` Trail ${trailNumber}` : "";
  const metadata = {
    id: outBase,
    name: `Trail Scroll ${label}${trailLabel} ${theme === "dark" ? "Dark" : "Light"}`,
    category: "ui",
    version: JOURNEY_V3 ? "v3" : "v1",
    status: "approved",
    owner_agent: "UI Art Agent",
    creation_agent: JOURNEY_V3 ? "Region Art Agent" : "Region Art Agent",
    approved_by: "Art Director Agent",
    created_at: "2026-06-14",
    updated_at: "2026-06-14",
    supersedes: JOURNEY_V3
      ? regionSlug === "foothills"
        ? `ui_trail_scroll_${regionSlug}_${theme}_v2`
        : `ui_trail_scroll_${regionSlug}_${theme}_v1`
      : undefined,
    tags: [
      "ui",
      "trail",
      "scroll",
      regionSlug,
      `${theme}-mode`,
      "immersive",
      ...(trailNumber >= 2 ? [`trail-${trailNumber}`] : []),
    ],
    usage_locations: JOURNEY_V3
      ? ["journey-path-map", "journey-screen"]
      : ["trail-first-learn-screen", "trail-map-immersive"],
    dependencies: [slugToRegionAssetBase(regionSlug), `ui_trail_spine_${theme}_v1`],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    design_notes: JOURNEY_V3
      ? `Path-first ${label}${trailLabel} scroll (${theme}). Environment art with trail drawn from journey-path-contracts.json spine — path is authoritative.`
      : `Vertical immersive ${label}${trailLabel} scroll (${theme}). Composed from region hero elevation bands with region palette, cross-faded segments, and 14 lantern waypoints at ${resolveAnchorContractKey(regionSlug, theme, trailNumber)} in trail-path-anchors.json. Generated via generate-region-trail-scrolls.mjs.`,
    anchor_contract: resolveAnchorContractKey(regionSlug, theme, trailNumber),
    trail_segment_index: trailNumber - 1,
    max_lessons: 40,
  };

  await writeFile(path.join(outDir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);

  const meta = await sharp(outPng).metadata();
  return { outPng, width: meta.width, height: meta.height };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const trailNumbers = flags.journeyV3 ? [1] : flags.allTrails ? [1, 2] : [flags.trail];
  const regions = resolveTargetRegions(flags);

  for (const trailNumber of trailNumbers) {
    for (const regionSlug of regions) {
      if (
        trailNumber === 1 &&
        !flags.journeyV3 &&
        !PRIMARY_GENERATED_REGIONS.includes(regionSlug)
      ) {
        continue;
      }
      for (const theme of THEMES) {
        const { outPng, width, height } = await generateScroll(
          regionSlug,
          theme,
          trailNumber,
        );
        console.log(
          `Generated trail-${trailNumber} ${path.relative(root, outPng)} (${width}x${height})`,
        );
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
