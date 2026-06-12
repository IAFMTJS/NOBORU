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
    { x: 56, y: 88 },
    { x: 44, y: 83 },
    { x: 56, y: 78 },
    { x: 44, y: 73 },
    { x: 56, y: 68 },
    { x: 44, y: 63 },
    { x: 56, y: 58 },
    { x: 44, y: 53 },
    { x: 54, y: 46 },
    { x: 50, y: 38 },
    { x: 50, y: 28 },
    { x: 50, y: 16 },
    { x: 50, y: 6 },
  ],
  light: [
    { x: 50, y: 93 },
    { x: 54, y: 88 },
    { x: 46, y: 83 },
    { x: 54, y: 78 },
    { x: 46, y: 73 },
    { x: 54, y: 68 },
    { x: 46, y: 63 },
    { x: 54, y: 58 },
    { x: 46, y: 53 },
    { x: 52, y: 46 },
    { x: 50, y: 38 },
    { x: 50, y: 28 },
    { x: 50, y: 16 },
    { x: 50, y: 6 },
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
    const hero = path.join(
      root,
      "assets/ui/_pipeline/_scroll_plates",
      `ui_trail_scroll_foothills_${theme}_v1_gen.png`,
    );
    const heroBuffer = await sharp(hero).png().toBuffer();
    const heroMeta = await sharp(heroBuffer).metadata();
    const heroHeight = heroMeta.height ?? 1024;

    const heroOverlay = Buffer.from(`
      <svg width="${WIDTH}" height="${heroHeight}" xmlns="http://www.w3.org/2000/svg">
        ${CANDIDATE_ANCHORS.map((anchor, i) => {
          const p = {
            x: (anchor.x / 100) * WIDTH,
            y: (anchor.y / 100) * heroHeight,
          };
          return `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="20" fill="none" stroke="#00ff88" stroke-width="3"/>
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="#00ff88"/>
            <text x="${p.x.toFixed(1)}" y="${(p.y - 24).toFixed(1)}" text-anchor="middle" fill="#00ff88" font-size="18" font-family="sans-serif">${i + 1}</text>
          `;
        }).join("\n")}
      </svg>
    `);

    const heroOut = path.join(outDir, `foothills_${theme}_hero_overlay.png`);
    await sharp(heroBuffer)
      .composite([{ input: heroOverlay, top: 0, left: 0 }])
      .png()
      .toFile(heroOut);

    const scroll = await upscaleHero(hero);
    const overlay = buildOverlaySvg(CANDIDATE_ANCHORS);
    const out = path.join(outDir, `foothills_${theme}_anchor_overlay.png`);

    await sharp(scroll)
      .composite([{ input: overlay, top: 0, left: 0 }])
      .png()
      .toFile(out);

    console.log(`Wrote ${path.relative(root, heroOut)}`);
    console.log(`Wrote ${path.relative(root, out)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
