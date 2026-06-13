/**
 * Renders anchor overlay on trail art for visual calibration.
 * Usage:
 *   npm run assets:calibrate-trail
 *   npm run assets:calibrate-trail -- --region=foothills
 *   npm run assets:calibrate-trail -- --all
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const anchorContract = JSON.parse(
  await readFile(
    path.join(root, "lib/design-system/trail-path-anchors.json"),
    "utf8",
  ),
);

const SCROLL_VERSION_BY_REGION = {
  foothills: "v2",
};

const GENERATED_REGIONS = [
  "forest-trail",
  "mount-n5",
  "mount-n4",
  "mount-n3",
  "mount-n2",
  "mount-n1",
  "master-summit",
];

function parseArgs(argv) {
  const flags = {
    all: argv.includes("--all"),
    region: null,
  };

  for (const arg of argv) {
    if (arg.startsWith("--region=")) {
      flags.region = arg.slice("--region=".length);
    }
  }

  return flags;
}

function resolveTargets(flags) {
  if (flags.all) {
    return Object.keys(anchorContract.regions);
  }
  if (flags.region) {
    return [flags.region];
  }
  return ["foothills"];
}

function anchorToPixel(anchor, width, height) {
  return {
    x: (anchor.x / 100) * width,
    y: (anchor.y / 100) * height,
  };
}

function buildOverlaySvg(anchors, width, height) {
  const points = anchors.map((anchor) => anchorToPixel(anchor, width, height));
  const circles = points
    .map(
      (point, index) =>
        `<circle cx="${point.x}" cy="${point.y}" r="18" fill="lime" fill-opacity="0.85" />` +
        `<text x="${point.x + 22}" y="${point.y + 6}" font-size="28" fill="lime">${index + 1}</text>`,
    )
    .join("");

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      `<polyline points="${polyline}" fill="none" stroke="lime" stroke-width="6" stroke-dasharray="24 16" />` +
      circles +
      `</svg>`,
  );
}

function resolveScrollAssetPath(regionSlug, theme) {
  const version = SCROLL_VERSION_BY_REGION[regionSlug] ?? "v1";
  const assetId = `ui_trail_scroll_${regionSlug}_${theme}_${version}`;
  return {
    assetId,
    pngPath: path.join(root, "assets/ui", assetId, `${assetId}.png`),
    version,
  };
}

async function writeDetectedAnchors(regionSlug, theme, anchors) {
  const outputDir = path.join(root, "assets/ui/_pipeline/_calibration");
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(
    outputDir,
    `${regionSlug.replace(/-/g, "_")}_${theme}_detected_anchors.json`,
  );
  await writeFile(
    outputPath,
    JSON.stringify(
      {
        regionSlug,
        theme,
        source: "trail-path-anchors.json",
        lanternCount: anchors.length,
        anchors,
      },
      null,
      2,
    ),
  );
}

async function renderOverlay(regionSlug, theme) {
  const anchors = anchorContract.regions[regionSlug]?.[theme];
  if (!anchors) {
    console.warn(`Skipping ${regionSlug}/${theme}: no anchors in contract`);
    return;
  }

  const { assetId, pngPath, version } = resolveScrollAssetPath(regionSlug, theme);
  const width = anchorContract.scrollArtWidth;
  const height = anchorContract.scrollArtHeight;
  const outputDir = path.join(root, "assets/ui/_pipeline/_calibration");
  const outputPath = path.join(
    outputDir,
    `${regionSlug.replace(/-/g, "_")}_${theme}_${version}_anchor_overlay.png`,
  );

  const overlay = buildOverlaySvg(anchors, width, height);
  const composite = await sharp(pngPath)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toBuffer();

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, composite);
  await writeDetectedAnchors(regionSlug, theme, anchors);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

const flags = parseArgs(process.argv.slice(2));
const targets = resolveTargets(flags);

for (const regionSlug of targets) {
  for (const theme of ["dark", "light"]) {
    await renderOverlay(regionSlug, theme);
  }
}

console.log(
  `Anchor overlays rendered from lib/design-system/trail-path-anchors.json (${targets.length} region(s))`,
);
