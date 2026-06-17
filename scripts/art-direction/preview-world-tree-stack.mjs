#!/usr/bin/env node
/** Stack world-tree light tiles vertically for seam review. */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const LIB = join(ROOT, "Art Library/world-tree");
const OUT = join(LIB, "_previews");

const version = process.argv[2] ?? "2";
const STACK = [
  `04_foothills_03/wt_foothills_03_light_v${version}.png`, // trunk_c (legacy file name)
  `03_foothills_02/wt_foothills_02_light_v${version}.png`, // trunk_b (legacy file name)
  `02_foothills_01/wt_foothills_01_light_v${version}.png`, // trunk_a (legacy file name)
  `01_roots/wt_roots_light_v${version}.png`, // roots_a (legacy file name)
];

mkdirSync(OUT, { recursive: true });

const meta = await Promise.all(
  STACK.map(async (rel) => {
    const input = join(LIB, rel);
    const m = await sharp(input).metadata();
    return { rel, input, width: m.width ?? 0, height: m.height ?? 0 };
  }),
);

const width = meta[0]?.width ?? 1536;
const height = meta.reduce((sum, m) => sum + m.height, 0);

const composites = [];
let top = 0;
for (const m of meta) {
  composites.push({ input: m.input, top, left: 0 });
  top += m.height;
}

const outPath = join(OUT, `batch1_light_stack_raw_v${version}.jpg`);
await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 20, g: 20, b: 30 },
  },
})
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(outPath);

// Blend 96px overlap zones between adjacent tiles
const overlap = 96;
let blendedTop = meta[0].height;
const blendLayers = [...composites];
for (let i = 1; i < meta.length; i += 1) {
  const upper = meta[i - 1];
  const lower = meta[i];
  const y = blendedTop - overlap;
  const upperCrop = await sharp(upper.input)
    .extract({ left: 0, top: upper.height - overlap, width, height: overlap })
    .ensureAlpha()
    .toBuffer();
  const lowerCrop = await sharp(lower.input)
    .extract({ left: 0, top: 0, width, height: overlap })
    .ensureAlpha()
    .toBuffer();
  const mask = await sharp({
    create: {
      width,
      height: overlap,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${width}" height="${overlap}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
  const blended = await sharp(lowerCrop)
    .composite([{ input: upperCrop, blend: "over" }])
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  blendLayers.push({ input: blended, top: y, left: 0 });
  blendedTop += meta[i].height - overlap;
}

const blendOut = join(OUT, `batch1_light_stack_blend96_v${version}.jpg`);
await sharp({
  create: {
    width,
    height: height - overlap * (meta.length - 1),
    channels: 3,
    background: { r: 20, g: 20, b: 30 },
  },
})
  .composite(
    meta.map((m, idx) => ({
      input: m.input,
      top: idx === 0 ? 0 : meta.slice(0, idx).reduce((s, x) => s + x.height, 0) - overlap * idx,
      left: 0,
    })),
  )
  .jpeg({ quality: 85 })
  .toFile(blendOut);

console.log("Dimensions per tile:", meta.map((m) => `${m.rel}: ${m.width}x${m.height}`).join("\n"));
console.log("Raw stack:", outPath);
console.log("Blend preview:", blendOut);
