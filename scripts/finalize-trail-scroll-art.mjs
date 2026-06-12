/**
 * Produces final trail scroll PNG (1536×5120) from a single continuous hero illustration.
 * Lanczos upscale — one artwork, correct base→summit orientation, zero tiling.
 * No spine blend or procedural path overlay (prevents double-path artifacts).
 *
 * Usage: node scripts/finalize-trail-scroll-art.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pipelinePlates = path.join(root, "assets", "ui", "_pipeline", "_scroll_plates");

const WIDTH = 1536;
const HEIGHT = 5120;

const SCROLL_SPECS = [
  {
    theme: "dark",
    hero: path.join(pipelinePlates, "ui_trail_scroll_foothills_dark_v1_gen.png"),
    fallback: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_dark_v1/ui_trail_scroll_foothills_dark_v1_draft.png",
    ),
  },
  {
    theme: "light",
    hero: path.join(pipelinePlates, "ui_trail_scroll_foothills_light_v1_gen.png"),
    fallback: path.join(
      root,
      "assets/ui/ui_trail_scroll_foothills_light_v1/ui_trail_scroll_foothills_light_v1_draft.png",
    ),
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

async function finalize(spec) {
  const heroPath = await resolveHero(spec);
  const outDir = path.join(root, `assets/ui/ui_trail_scroll_foothills_${spec.theme}_v1`);
  const outBase = `ui_trail_scroll_foothills_${spec.theme}_v1`;
  const outPng = path.join(outDir, `${outBase}.png`);

  const buffer = await upscaleHero(heroPath);
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
      no_path_overlay: true,
      no_spine_blend: true,
    },
    design_notes: `Vertical immersive Foothills scroll (${spec.theme}). Single continuous hero illustration upscaled to ${WIDTH}×${HEIGHT}. Painted path only — no procedural overlay or spine blend. Node positions align to TRAIL_MAP_PATH_ANCHORS.`,
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
