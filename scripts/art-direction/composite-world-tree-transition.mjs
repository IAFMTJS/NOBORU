#!/usr/bin/env node
/**
 * Blend two adjacent World Tree segment PNGs into a transition tile (POC seam).
 *
 * Usage:
 *   node scripts/art-direction/composite-world-tree-transition.mjs \
 *     --id trunk_to_ancient --lower trunk_b --upper trunk_c
 */
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const SEGMENTS = join(ROOT, "Art Library/world-tree/segments");
const TRANSITIONS = join(ROOT, "Art Library/world-tree/transitions");

const CANVAS = { width: 1536, height: 1024 };
const OVERLAP = 96;

function parseArgs(argv) {
  const args = { goldenTop: false, lowerKind: "segment", upperKind: "segment" };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--golden-top") {
      args.goldenTop = true;
      continue;
    }
    const next = argv[i + 1];
    if (token === "--id" && next) {
      args.id = next;
      i += 1;
    } else if (token === "--lower" && next) {
      args.lower = next;
      i += 1;
    } else if (token === "--upper" && next) {
      args.upper = next;
      i += 1;
    } else if (token === "--lower-kind" && next) {
      args.lowerKind = next;
      i += 1;
    } else if (token === "--upper-kind" && next) {
      args.upperKind = next;
      i += 1;
    }
  }
  if (!args.id || !args.lower || !args.upper) {
    throw new Error("Required: --id <transition_id> --lower <segment> --upper <segment>");
  }
  return args;
}

async function loadAsset(kind, assetId, theme) {
  const root = kind === "transition" ? TRANSITIONS : SEGMENTS;
  const prefix = kind === "transition" ? "wt_transition_" : "wt_";
  const path = join(root, assetId, `${prefix}${assetId}_${theme}_v2.png`);
  return sharp(path).ensureAlpha().toBuffer();
}

async function normalizeToCanvas(buffer) {
  const meta = await sharp(buffer).metadata();
  if (meta.width === CANVAS.width && meta.height === CANVAS.height) {
    return buffer;
  }
  return sharp(buffer)
    .resize(CANVAS.width, CANVAS.height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
}

async function buildTransition({ lowerBuf, upperBuf, goldenTop }) {
  const lowerNorm = await normalizeToCanvas(lowerBuf);
  const upperNorm = await normalizeToCanvas(upperBuf);

  const lowerH = Math.floor(CANVAS.height * 0.58);
  const upperH = Math.floor(CANVAS.height * 0.58);
  const seamY = Math.floor(CANVAS.height * 0.44);
  const cropH = Math.floor(CANVAS.height * 0.62);

  const lowerCrop = await sharp(lowerNorm)
    .extract({
      left: 0,
      top: CANVAS.height - cropH,
      width: CANVAS.width,
      height: cropH,
    })
    .resize(CANVAS.width, lowerH)
    .toBuffer();

  let upperPipeline = sharp(upperNorm).extract({
    left: 0,
    top: 0,
    width: CANVAS.width,
    height: cropH,
  });

  if (goldenTop) {
    upperPipeline = upperPipeline.modulate({ brightness: 1.08, saturation: 1.35 }).tint("#D4A84B");
  }

  const upperCrop = await upperPipeline.resize(CANVAS.width, upperH).toBuffer();

  return sharp({
    create: {
      width: CANVAS.width,
      height: CANVAS.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: lowerCrop, top: seamY + Math.floor(OVERLAP / 3), left: 0, blend: "over" },
      { input: upperCrop, top: seamY - Math.floor(OVERLAP / 3), left: 0, blend: "over" },
    ])
    .png()
    .toBuffer();
}

async function writeTransition(transitionId, theme, buffer) {
  const folderName = transitionId.slice("transition_".length);
  const destDir = join(TRANSITIONS, folderName);
  mkdirSync(destDir, { recursive: true });
  const filename = `wt_transition_${folderName}_${theme}_v2.png`;
  const destPath = join(destDir, filename);
  await sharp(buffer).png().toFile(destPath);
  return destPath;
}

async function main() {
  const args = parseArgs(process.argv);
  const transitionId = args.id.startsWith("transition_") ? args.id : `transition_${args.id}`;

  for (const theme of ["light", "dark"]) {
    const lowerBuf = await loadAsset(args.lowerKind, args.lower, theme);
    const upperBuf = await loadAsset(args.upperKind, args.upper, theme);
    const buffer = await buildTransition({
      lowerBuf,
      upperBuf,
      goldenTop: args.goldenTop,
    });
    const path = await writeTransition(transitionId, theme, buffer);
    console.log(`Wrote ${path}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
