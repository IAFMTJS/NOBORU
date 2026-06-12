/**
 * Renders anchor overlay on trail art for visual calibration.
 * Usage: node scripts/calibrate-trail-anchors.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WIDTH = 1536;
const HEIGHT = 5120;

const CANDIDATE_ANCHORS_BY_THEME = {
  dark: [
    { x: 50, y: 93 },
    { x: 40, y: 88 },
    { x: 52, y: 83 },
    { x: 40, y: 77 },
    { x: 54, y: 71 },
    { x: 44, y: 65 },
    { x: 54, y: 59 },
    { x: 46, y: 53 },
    { x: 54, y: 47 },
    { x: 48, y: 40 },
    { x: 50, y: 32 },
    { x: 50, y: 22 },
    { x: 50, y: 12 },
    { x: 50, y: 6 },
  ],
  light: [
    { x: 50, y: 93 },
    { x: 44, y: 88 },
    { x: 52, y: 83 },
    { x: 38, y: 77 },
    { x: 48, y: 71 },
    { x: 36, y: 65 },
    { x: 46, y: 59 },
    { x: 38, y: 53 },
    { x: 48, y: 46 },
    { x: 52, y: 38 },
    { x: 50, y: 28 },
    { x: 50, y: 16 },
    { x: 50, y: 8 },
    { x: 50, y: 4 },
  ],
};

function anchorToPixel(anchor) {
  return {
    x: (anchor.x / 100) * WIDTH,
    y: (anchor.y / 100) * HEIGHT,
  };
}

function buildOverlaySvg(anchors) {
  const points = anchors.map(anchorToPixel);
  const circles = points
    .map(
      (p, i) => `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="28" fill="none" stroke="#00ff88" stroke-width="4"/>
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6" fill="#00ff88"/>
    <text x="${p.x.toFixed(1)}" y="${(p.y - 36).toFixed(1)}" text-anchor="middle" fill="#00ff88" font-size="22" font-family="sans-serif">${i + 1}</text>
  `,
    )
    .join("\n");

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathD}" fill="none" stroke="#00ff88" stroke-width="3" stroke-dasharray="12 8" opacity="0.9"/>
      ${circles}
    </svg>
  `);
}

async function upscaleHero(heroPath) {
  return sharp(heroPath)
    .resize(WIDTH, HEIGHT, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
}

async function main() {
  const outDir = path.join(root, "assets", "ui", "_pipeline", "_calibration");
  await mkdir(outDir, { recursive: true });

  for (const theme of ["dark", "light"]) {
    const CANDIDATE_ANCHORS = CANDIDATE_ANCHORS_BY_THEME[theme];
    const scrollPath = path.join(
      root,
      "assets/ui",
      `ui_trail_scroll_foothills_${theme}_v2`,
      `ui_trail_scroll_foothills_${theme}_v2.png`,
    );
    const scrollBuffer = await sharp(scrollPath).png().toBuffer();
    const overlay = buildOverlaySvg(CANDIDATE_ANCHORS);
    const out = path.join(outDir, `foothills_${theme}_v2_anchor_overlay.png`);

    await sharp(scrollBuffer)
      .composite([{ input: overlay, top: 0, left: 0 }])
      .png()
      .toFile(out);

    console.log(`Wrote ${path.relative(root, out)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
