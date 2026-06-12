/**
 * Converts full-scene PNG assets to WebP while preserving backgrounds.
 * Use for trail maps, auth atmosphere, and region heroes — not sticker cutouts.
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
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

async function discoverTrailScrollFolders() {
  const uiDir = path.join(root, "assets", "ui");
  const entries = await readdir(uiDir, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name.startsWith("ui_trail_scroll_") &&
        !SCENE_SOURCES.includes(`ui/${entry.name}`),
    )
    .map((entry) => `ui/${entry.name}`);
}

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
  const discovered = await discoverTrailScrollFolders();
  const allSources = [...SCENE_SOURCES, ...discovered];
  const pngFiles = allSources.map((relative) =>
    path.join(root, "assets", relative, `${path.basename(relative)}.png`),
  );

  console.log(`Converting ${pngFiles.length} scene assets…`);

  for (const pngPath of pngFiles) {
    try {
      const result = await convertScenePng(pngPath);
      console.log(
        `${path.relative(root, result.pngPath)} → ${path.relative(root, result.publicWebp)}`,
      );
    } catch (error) {
      console.warn(`Skipping ${path.relative(root, pngPath)}: ${error.message}`);
    }
  }

  console.log("Done. Scene assets keep their full backgrounds.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
