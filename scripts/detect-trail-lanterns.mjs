/**
 * Detects bright lantern pixels along the trail hero to suggest anchor coordinates.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function detectLanterns(imagePath) {
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const hits = [];

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const warmth = r - b;
      const xPct = (x / width) * 100;
      const yPct = (y / height) * 100;
      if (
        xPct >= 34 &&
        xPct <= 66 &&
        yPct >= 4 &&
        yPct <= 98 &&
        brightness > 140 &&
        warmth > 18 &&
        r > 110
      ) {
        hits.push({ x, y, r, g, b });
      }
    }
  }

  const clusters = [];
  const threshold = 42;

  for (const hit of hits) {
    let cluster = clusters.find(
      (c) => Math.hypot(c.x - hit.x, c.y - hit.y) < threshold,
    );
    if (!cluster) {
      cluster = { x: 0, y: 0, count: 0, r: 0, g: 0, b: 0 };
      clusters.push(cluster);
    }
    cluster.x += hit.x;
    cluster.y += hit.y;
    cluster.r += hit.r;
    cluster.g += hit.g;
    cluster.b += hit.b;
    cluster.count += 1;
  }

  return clusters
    .map((c) => ({
      x: (c.x / c.count / width) * 100,
      y: (c.y / c.count / height) * 100,
      count: c.count,
      r: Math.round(c.r / c.count),
      g: Math.round(c.g / c.count),
      b: Math.round(c.b / c.count),
    }))
    .filter((c) => c.count > 20)
    .sort((a, b) => b.y - a.y);
}

async function main() {
  const outDir = path.join(root, "assets", "ui", "_pipeline", "_calibration");
  await mkdir(outDir, { recursive: true });

  for (const theme of ["dark", "light"]) {
    const hero = path.join(
      root,
      "assets/ui/_pipeline/_scroll_plates",
      `ui_trail_scroll_foothills_${theme}_v1_gen.png`,
    );
    const lanterns = await detectLanterns(hero);
    const report = {
      theme,
      lanternCount: lanterns.length,
      lanterns: lanterns.map((l) => ({
        x: Math.round(l.x * 10) / 10,
        y: Math.round(l.y * 10) / 10,
      })),
      anchors: lanterns.slice(0, 14).map((l) => ({
        x: Math.round(l.x),
        y: Math.round(l.y * 10) / 10,
      })),
    };

    const out = path.join(outDir, `foothills_${theme}_detected_anchors.json`);
    await writeFile(out, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`${theme}: ${report.lanternCount} clusters → ${path.relative(root, out)}`);
    console.log(JSON.stringify(report.anchors, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
