#!/usr/bin/env node
/**
 * Concept-map World Tree composition preview (v6).
 *
 * Wide trunk spine + horizontal tier hubs — matches the reference map layout,
 * not the journey scroll column.
 *
 * Usage:
 *   node scripts/art-direction/preview-world-tree-composition.mjs [--verbose]
 */
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const LIB = join(ROOT, "Art Library/world-tree");
const OUT_DIR = join(LIB, "_previews");
const REMASTER_MANIFEST = join(LIB, "sheet-remasters/manifest.json");
const LAYOUT_PATH = join(import.meta.dirname, "world-tree-composition-layout.json");

const UNDERGROUND = new Set([
  "14_underground_root_passages",
  "15_root_chambers_caverns",
  "16_underground_platforms",
  "17_underground_settlements",
  "18_underground_props",
  "19_underground_fungi",
  "20_underground_crystals",
  "21_underground_special",
  "22_cave_backgrounds",
]);

function parseArgs(argv) {
  const args = { verbose: false, output: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--verbose" || argv[i] === "-v") args.verbose = true;
    else if (argv[i] === "--output" || argv[i] === "-o") {
      args.output = argv[++i];
      i += 1;
    }
  }
  return args;
}

function resolveTheme(section, requested) {
  if (requested) return requested;
  return UNDERGROUND.has(section) ? "dark" : "light";
}

function remasterId(section, index, theme) {
  return `wt_${section}_${String(index).padStart(2, "0")}_${theme}_v2`;
}

function findRemaster(manifest, section, index, theme) {
  const resolved = resolveTheme(section, theme);
  const id = remasterId(section, index, resolved);
  const entry = manifest.find((item) => item.id === id);
  if (!entry) return null;
  const path = join(ROOT, entry.png);
  if (!existsSync(path)) return null;
  return { id, path };
}

function puzzlePiecePath(piece) {
  const folder = piece.folder ?? `segments/${piece.id}`;
  return join(LIB, folder, `wt_${piece.id}_${piece.theme ?? "light"}_v2.png`);
}

function expandSpinePieces(spec) {
  const out = [];
  for (const piece of spec.pieces ?? []) {
    const count = piece.repeat ?? 1;
    for (let i = 0; i < count; i += 1) out.push(piece);
  }
  return out;
}

async function measureAlphaBounds(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let maxX = 0;
  let found = false;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * info.channels + (info.channels - 1)];
      if (alpha > 24) {
        found = true;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }

  if (!found) return { width: info.width, tileWidth: info.width };

  return { width: maxX - minX + 1, tileWidth: info.width };
}

async function withOpacity(input, opacity) {
  if (opacity >= 0.999) return input;
  const alpha = Math.round(opacity * 255);
  return sharp(input)
    .ensureAlpha()
    .composite([
      {
        input: Buffer.from([255, 255, 255, alpha]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function resizeToWidth(inputPath, targetWidth, flip = false) {
  let pipeline = sharp(inputPath).resize({
    width: Math.max(1, Math.round(targetWidth)),
    withoutEnlargement: false,
  });
  if (flip) pipeline = pipeline.flop();
  return pipeline.png().toBuffer();
}

async function measure(buffer) {
  const meta = await sharp(buffer).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

function buildSkySvg(layout) {
  const { width, height } = layout.canvas;
  const stops = (layout.sky?.stops ?? [])
    .map((s) => `<stop offset="${Math.round(s.offset * 100)}%" stop-color="${s.color}" />`)
    .join("\n");

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="${height}" gradientUnits="userSpaceOnUse">
          ${stops}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#sky)" />
    </svg>`,
  );
}

async function scalePuzzleToTrunkWidth(path, targetTrunkWidth) {
  const raw = await sharp(path).png().toBuffer();
  const bounds = await measureAlphaBounds(raw);
  const trunkFraction = bounds.width / bounds.tileWidth;
  const tileWidth = targetTrunkWidth / Math.max(trunkFraction, 0.12);
  return sharp(raw)
    .resize({ width: Math.round(tileWidth), withoutEnlargement: false })
    .png()
    .toBuffer();
}

async function buildTrunkSpine(layout, canvasW, canvasH) {
  const spine = layout.trunkSpine;
  if (!spine) return { layers: [], bounds: null };

  const pieces = expandSpinePieces(spine);
  const targetTrunkW = canvasW * (spine.targetTrunkWidthPercent ?? 0.4);
  const overlap = spine.seamOverlapPx ?? 128;
  const yTop = canvasH * (spine.top ?? 0.05);
  const yBottom = canvasH * (spine.bottom ?? 0.95);
  const available = yBottom - yTop;

  const scaled = [];
  for (const piece of pieces) {
    const path = puzzlePiecePath(piece);
    if (!existsSync(path)) {
      console.warn(`  skip spine: ${path}`);
      continue;
    }
    const buffer = await scalePuzzleToTrunkWidth(path, targetTrunkW);
    const { width, height } = await measure(buffer);
    scaled.push({ id: piece.id, buffer, width, height });
  }

  if (scaled.length === 0) return { layers: [], bounds: null };

  let totalH = scaled.reduce((s, p) => s + p.height, 0) - overlap * (scaled.length - 1);
  let scale = 1;
  if (totalH > available) scale = available / totalH;

  const layers = [];
  let cursorY = yBottom - totalH * scale;
  const centerX = canvasW * (spine.centerX ?? 0.5);

  const spineZ = spine.zIndex ?? 12;
  const spineOpacity = spine.opacity ?? 1;

  for (const piece of scaled) {
    const w = Math.round(piece.width * scale);
    const h = Math.round(piece.height * scale);
    let buffer =
      scale < 0.999
        ? await sharp(piece.buffer).resize({ width: w, height: h }).png().toBuffer()
        : piece.buffer;
    if (spineOpacity < 0.999) buffer = await withOpacity(buffer, spineOpacity);

    layers.push({
      zIndex: spineZ,
      label: `spine:${piece.id}`,
      top: Math.round(cursorY),
      left: Math.round(centerX - w / 2),
      input: buffer,
    });
    cursorY += h - overlap * scale;
  }

  return { layers };
}

async function placeAsset(manifest, spec, canvasW, canvasH, defaultY) {
  if (!spec) return null;
  const asset = findRemaster(manifest, spec.section, spec.index, spec.theme);
  if (!asset) {
    console.warn(`  skip tier asset: ${spec.section}_${spec.index}`);
    return null;
  }

  const targetWidth = canvasW * (spec.width ?? 0.2);
  let buffer = await resizeToWidth(asset.path, targetWidth, spec.flip ?? false);
  if (spec.opacity != null) buffer = await withOpacity(buffer, spec.opacity);
  const { width, height } = await measure(buffer);

  const y = canvasH * (spec.y ?? defaultY) + canvasH * (spec.yOffset ?? 0);
  const x = spec.x != null ? canvasW * spec.x : canvasW * 0.5;

  return {
    zIndex: spec.zIndex ?? 30,
    label: spec.label ?? asset.id,
    top: Math.round(y - height / 2),
    left: Math.round(x - width / 2),
    input: buffer,
  };
}

async function buildTiers(layout, manifest, canvasW, canvasH) {
  const layers = [];

  for (const tier of layout.tiers ?? []) {
    const tierY = tier.y ?? 0.5;

    for (const piece of tier.crown ?? []) {
      const placed = await placeAsset(manifest, { ...piece, y: tierY }, canvasW, canvasH, tierY);
      if (placed) layers.push(placed);
    }

    const center = await placeAsset(manifest, tier.center, canvasW, canvasH, tierY);
    if (center) layers.push(center);

    const left = await placeAsset(manifest, tier.left, canvasW, canvasH, tierY);
    if (left) layers.push(left);

    const right = await placeAsset(manifest, tier.right, canvasW, canvasH, tierY);
    if (right) layers.push(right);

    for (const bridge of tier.bridges ?? []) {
      const placed = await placeAsset(
        manifest,
        { ...bridge, y: tierY + (bridge.yOffset ?? 0) },
        canvasW,
        canvasH,
        tierY,
      );
      if (placed) layers.push(placed);
    }

    for (const effect of tier.effects ?? []) {
      const placed = await placeAsset(manifest, { ...effect, y: tierY }, canvasW, canvasH, tierY);
      if (placed) layers.push(placed);
    }

    if (tier.overlay) {
      const overlay = await placeAsset(
        manifest,
        tier.overlay,
        canvasW,
        canvasH,
        tier.overlay.y ?? tierY,
      );
      if (overlay) layers.push(overlay);
    }
  }

  return layers;
}

async function buildCloudLayers(layout, manifest, canvasW, canvasH) {
  const layers = [];
  for (const cloud of layout.sky?.cloudLayers ?? []) {
    const asset = findRemaster(manifest, cloud.section, cloud.index, cloud.theme);
    if (!asset) continue;
    const w = canvasW * (cloud.width ?? 1);
    let buffer = await resizeToWidth(asset.path, w);
    buffer = await withOpacity(buffer, cloud.opacity ?? 0.2);
    const { width, height } = await measure(buffer);
    layers.push({
      zIndex: cloud.zIndex ?? 3,
      label: `cloud:${asset.id}`,
      top: Math.round(canvasH * (cloud.y ?? 0.1) - height / 2),
      left: Math.round((canvasW - width) / 2),
      input: buffer,
    });
  }
  return layers;
}

async function main() {
  const args = parseArgs(process.argv);
  const layout = JSON.parse(readFileSync(LAYOUT_PATH, "utf8"));
  const manifest = JSON.parse(readFileSync(REMASTER_MANIFEST, "utf8"));
  const { width, height } = layout.canvas;

  mkdirSync(OUT_DIR, { recursive: true });

  const sky = await sharp(buildSkySvg(layout)).png().toBuffer();
  const clouds = await buildCloudLayers(layout, manifest, width, height);
  const { layers: spineLayers } = await buildTrunkSpine(layout, width, height);
  const tierLayers = await buildTiers(layout, manifest, width, height);

  const allLayers = [...clouds, ...spineLayers, ...tierLayers].sort((a, b) => a.zIndex - b.zIndex);
  const composite = allLayers.map(({ input, top, left }) => ({ input, top, left }));

  const outPath = args.output
    ? resolve(args.output)
    : join(OUT_DIR, "world-tree-composition_light_v6.jpg");

  await sharp(sky).composite(composite).jpeg({ quality: 92, mozjpeg: true }).toFile(outPath);

  const pngPath = outPath.replace(/\.jpe?g$/i, ".png");
  await sharp(sky).composite(composite).png({ compressionLevel: 9 }).toFile(pngPath);

  console.log("Composition preview:", outPath);
  console.log("PNG master:", pngPath);
  console.log(
    "Layers:",
    composite.length,
    `(clouds ${clouds.length}, spine ${spineLayers.length}, tiers ${tierLayers.length})`,
  );

  if (args.verbose) {
    for (const layer of allLayers) console.log(`  z${layer.zIndex} ${layer.label}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
