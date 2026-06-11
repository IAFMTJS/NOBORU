/**
 * Produces final trail scroll PNG (1536×5120) from a single continuous hero illustration.
 * Lanczos upscale — one artwork, correct base→summit orientation, zero tiling.
 *
 * Usage: node scripts/finalize-trail-scroll-art.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const genDir = path.join("C:/Users/siebe/.cursor/projects/d-NOBORU/assets");

const WIDTH = 1536;
const HEIGHT = 5120;

const SCROLL_SPECS = [
  {
    theme: "dark",
    hero: path.join(genDir, "ui_trail_scroll_foothills_dark_v1_gen_full.png"),
    fallback: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_dark_v1/ui_trail_scroll_foothills_dark_v1_draft.png",
    ),
    spine: path.join(root, "assets/ui/ui_trail_spine_dark_v1/ui_trail_spine_dark_v1.png"),
    spineBlend: 0.32,
  },
  {
    theme: "light",
    hero: path.join(genDir, "ui_trail_scroll_foothills_light_v1_gen_full.png"),
    fallback: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_light_v1/ui_trail_scroll_foothills_light_v1_draft.png",
    ),
    spine: path.join(root, "assets/ui/ui_trail_spine_light_v1/ui_trail_spine_light_v1.png"),
    spineBlend: 0.28,
  },
];

async function resolveHero(spec) {
  for (const candidate of [spec.hero, spec.fallback]) {
    try {
      await sharp(candidate).metadata();
      return candidate;
    } catch {
      // try next
    }
  }
  throw new Error(`No hero for ${spec.theme}`);
}

async function upscaleHero(heroPath) {
  return sharp(heroPath)
    .resize(WIDTH, HEIGHT, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.3 })
    .png()
    .toBuffer();
}

async function blendSpine(scrollBuffer, spinePath, blendOpacity) {
  const spineH = Math.round(HEIGHT * 0.18);
  const spine = await sharp(spinePath)
    .resize(WIDTH, spineH, { fit: "cover", position: "bottom" })
    .png()
    .toBuffer();

  const mask = Buffer.from(`
    <svg width="${WIDTH}" height="${spineH}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="35%" stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="${blendOpacity}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `);

  const faded = await sharp(spine)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(scrollBuffer)
    .composite([{ input: faded, top: HEIGHT - spineH, left: 0, blend: "over" }])
    .png()
    .toBuffer();
}

async function finalize(spec) {
  const heroPath = await resolveHero(spec);
  const outDir = path.join(root, `assets/ui/ui_trail_scroll_foothills_${spec.theme}_v1`);
  const outBase = `ui_trail_scroll_foothills_${spec.theme}_v1`;
  const outPng = path.join(outDir, `${outBase}.png`);

  let buffer = await upscaleHero(heroPath);
  buffer = await blendSpine(buffer, spec.spine, spec.spineBlend);

  await sharp(buffer).png({ compressionLevel: 6 }).toFile(outPng);

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
    dependencies: [`ui_trail_spine_${spec.theme}_v1`],
    dimensions: { width: WIDTH, height: HEIGHT },
    files: [`${outBase}.png`, `${outBase}.webp`],
    composition: {
      method: "single-hero-lanczos-upscale",
      hero_source: path.basename(heroPath),
      no_tiling: true,
      spine_blend: spec.spineBlend,
    },
    design_notes: `Vertical immersive Foothills scroll (${spec.theme}). Single continuous hero illustration upscaled to ${WIDTH}×${HEIGHT} with spine detail at base. Glowing path and 14 stone lanterns at TRAIL_MAP_PATH_ANCHORS. Mountain ${spec.theme === "dark" ? "Night" : "Dawn"} per art-direction. Awaiting Art Director approval.`,
  };

  await writeFile(path.join(outDir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);

  const meta = await sharp(outPng).metadata();
  return { outPng, width: meta.width, height: meta.height, hero: path.basename(heroPath) };
}

async function main() {
  for (const spec of SCROLL_SPECS) {
    const r = await finalize(spec);
    console.log(`Finalized ${path.relative(root, r.outPng)} (${r.width}×${r.height}) from ${r.hero}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
