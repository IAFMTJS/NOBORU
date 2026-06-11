import { readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const TARGET_DIRS = [
  path.join(root, "assets"),
  path.join(root, "public"),
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertPngToWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const input = await readFile(pngPath);
  const output = await sharp(input)
    .webp({ quality: 88, effort: 4 })
    .toBuffer();

  await writeFile(webpPath, output);

  const [pngSize, webpSize] = await Promise.all([
    stat(pngPath).then((s) => s.size),
    stat(webpPath).then((s) => s.size),
  ]);

  if (path.dirname(pngPath).startsWith(path.join(root, "public"))) {
    await unlink(pngPath);
  }

  return { pngPath, webpPath, pngSize, webpSize };
}

async function main() {
  const pngFiles = (
    await Promise.all(TARGET_DIRS.map((dir) => walk(dir).catch(() => [])))
  ).flat();

  if (pngFiles.length === 0) {
    console.log("No PNG files found.");
    return;
  }

  let saved = 0;
  for (const pngPath of pngFiles) {
    const result = await convertPngToWebp(pngPath);
    saved += result.pngSize - result.webpSize;
    console.log(
      `Converted ${path.relative(root, result.pngPath)} -> ${path.relative(root, result.webpPath)}`,
    );
  }

  console.log(`Done. ${pngFiles.length} files converted. ~${Math.round(saved / 1024)} KB saved in public/.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
