#!/usr/bin/env node
/** Stack world-tree light tiles vertically for seam review. */
import { readFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const LIB = join(ROOT, "Art Library/world-tree");
const OUT = join(LIB, "_previews");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts/art-direction/world-tree-manifest.json"), "utf8"),
);

const version = process.argv[2] ?? "2";
const overlap = manifest.anchors?.seamOverlapPx ?? 96;

/** Bottom → top render order (crown first in file list = top of image). */
const STACK_IDS = [
  "transition_ancient_to_canopy",
  "trunk_h",
  "trunk_g",
  "trunk_f",
  "trunk_e",
  "trunk_d",
  "trunk_c",
  "trunk_b",
  "trunk_a",
  "roots_e",
  "roots_d",
  "roots_c",
  "roots_b",
  "roots_a",
];

const folderById = Object.fromEntries(manifest.segments.map((s) => [s.id, s.folder]));

mkdirSync(OUT, { recursive: true });

const STACK = STACK_IDS.map((id) =>
  join(LIB, folderById[id], `wt_${id}_light_v${version}.png`),
);

const meta = await Promise.all(
  STACK.map(async (input) => {
    const m = await sharp(input).metadata();
    return { input, width: m.width ?? 0, height: m.height ?? 0 };
  }),
);

const width = meta[0]?.width ?? 1536;
const height = meta.reduce((sum, m) => sum + m.height, 0) - overlap * (meta.length - 1);

const layers = meta.map((m, idx) => ({
  input: m.input,
  top: idx === 0 ? 0 : meta.slice(0, idx).reduce((s, x) => s + x.height, 0) - overlap * idx,
  left: 0,
}));

const outPath = join(OUT, `journey_stack_light_v${version}.jpg`);
await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 20, g: 20, b: 30 },
  },
})
  .composite(layers)
  .jpeg({ quality: 85 })
  .toFile(outPath);

console.log("Stack preview:", outPath);
console.log("Tiles:", meta.length, "Overlap:", overlap, "px");
