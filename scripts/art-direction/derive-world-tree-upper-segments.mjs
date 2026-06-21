#!/usr/bin/env node
/**
 * Derive canopy + celestial segment POCs from sheet remasters → Art Library segments/.
 * Light masters are remaster PNGs; dark variants are modulated from light.
 */
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const REMASTERS = join(ROOT, "Art Library/world-tree/sheet-remasters");
const SEGMENTS = join(ROOT, "Art Library/world-tree/segments");
const CANVAS = { width: 1536, height: 1024 };

/** segmentId → remaster relative path (light) + optional post-process */
const DERIVATIONS = [
  {
    id: "canopy_a",
    source: "02_branches_limbs/wt_02_branches_limbs_01_light_v2.png",
    note: "Wide branch hub",
  },
  {
    id: "canopy_b",
    source: "02_branches_limbs/wt_02_branches_limbs_04_light_v2.png",
    tint: "#FFB7C5",
    modulate: { brightness: 1.04, saturation: 1.2 },
    note: "Sakura branch cluster",
  },
  {
    id: "canopy_c",
    source: "05_floating_islands/wt_05_floating_islands_05_light_v2.png",
    note: "Floating island platform",
  },
  {
    id: "canopy_d",
    source: "11_nature_vegetation/wt_11_nature_vegetation_11_light_v2.png",
    note: "Dense leaf canopy",
  },
  {
    id: "canopy_e",
    source: "12_special_elements/wt_12_special_elements_04_light_v2.png",
    note: "Cloud-edge transition",
  },
  {
    id: "celestial_a",
    source: "07_shrines_sacred/wt_07_shrines_sacred_01_light_v2.png",
    modulate: { brightness: 1.1, saturation: 1.25 },
    tint: "#E8C468",
    note: "Golden crown base",
  },
  {
    id: "celestial_b",
    source: "07_shrines_sacred/wt_07_shrines_sacred_10_light_v2.png",
    modulate: { brightness: 1.08, saturation: 1.2 },
    tint: "#D4AF37",
    note: "Celestial architecture",
  },
  {
    id: "celestial_c",
    source: "12_special_elements/wt_12_special_elements_02_light_v2.png",
    modulate: { brightness: 1.12, saturation: 1.3 },
    tint: "#F0D878",
    note: "Divine energy streams",
  },
  {
    id: "celestial_d",
    source: "12_special_elements/wt_12_special_elements_05_light_v2.png",
    modulate: { brightness: 1.15, saturation: 1.35 },
    tint: "#FFE4A8",
    note: "Starlight crown apex",
  },
];

async function normalizeSegment(sourcePath, { modulate, tint }) {
  let pipeline = sharp(sourcePath).ensureAlpha().resize(CANVAS.width, CANVAS.height, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (modulate) {
    pipeline = pipeline.modulate(modulate);
  }
  if (tint) {
    pipeline = pipeline.tint(tint);
  }

  return pipeline.png().toBuffer();
}

async function toDarkTheme(lightBuffer) {
  return sharp(lightBuffer)
    .modulate({ brightness: 0.52, saturation: 0.82 })
    .tint("#1A2438")
    .png()
    .toBuffer();
}

async function writeSegment(segmentId, theme, buffer) {
  const destDir = join(SEGMENTS, segmentId);
  mkdirSync(destDir, { recursive: true });
  const destPath = join(destDir, `wt_${segmentId}_${theme}_v2.png`);
  await sharp(buffer).png().toFile(destPath);
  return destPath;
}

async function main() {
  let count = 0;
  for (const entry of DERIVATIONS) {
    const sourcePath = join(REMASTERS, entry.source);
    const lightBuffer = await normalizeSegment(sourcePath, entry);
    const darkBuffer = await toDarkTheme(lightBuffer);

    const lightPath = await writeSegment(entry.id, "light", lightBuffer);
    const darkPath = await writeSegment(entry.id, "dark", darkBuffer);
    console.log(`${entry.id}: ${entry.note}`);
    console.log(`  → ${lightPath}`);
    console.log(`  → ${darkPath}`);
    count += 2;
  }
  console.log(`Derived ${count} segment PNG masters (${DERIVATIONS.length} segments).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
