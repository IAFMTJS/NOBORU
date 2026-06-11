/**
 * Converts full-scene PNG assets to WebP while preserving backgrounds.
 * Use for trail maps, auth atmosphere, and region heroes — not sticker cutouts.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Relative paths under assets/ — each folder must contain a matching .png */
const SCENE_SOURCES = [
  "ui/ui_trail_spine_dark_v1",
  "ui/ui_trail_spine_light_v1",
  "ui/ui_trail_scroll_foothills_dark_v1",
  "ui/ui_trail_scroll_foothills_light_v1",
];

async function convertScenePng(pngPath) {
  const baseName = path.basename(pngPath, ".png");
  const category = path.basename(path.dirname(path.dirname(pngPath)));
  const input = await readFile(pngPath);
  const output = await sharp(input)
    .webp({ quality: 88, effort: 4 })
    .toBuffer();

  const assetWebp = pngPath.replace(/\.png$/i, ".webp");
  const publicDir = path.join(root, "public", category);
  const publicWebp = path.join(publicDir, `${baseName}.webp`);

  await writeFile(assetWebp, output);
  await mkdir(publicDir, { recursive: true });
  await writeFile(publicWebp, output);

  return { pngPath, assetWebp, publicWebp };
}

async function main() {
  const pngFiles = SCENE_SOURCES.map((relative) =>
    path.join(root, "assets", relative, `${path.basename(relative)}.png`),
  );

  console.log(`Converting ${pngFiles.length} scene assets…`);

  for (const pngPath of pngFiles) {
    const result = await convertScenePng(pngPath);
    console.log(
      `${path.relative(root, result.pngPath)} → ${path.relative(root, result.publicWebp)}`,
    );
  }

  console.log("Done. Scene assets keep their full backgrounds.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
