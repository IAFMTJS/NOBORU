/**
 * Export full N5 greybox assets for art authoring.
 *
 * Usage: npm run assets:export-n5-greybox
 * Outputs:
 *   Art Library/staging/n5-greybox.json
 *   Art Library/staging/n5-greybox.svg
 *   Art Library/staging/n5-greybox.png
 *   Art Library/staging/n5-greybox-light.svg
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

import {
  buildN5GreyboxExportDocument,
  renderN5GreyboxSvg,
} from "../../features/worlds/utils/n5-greybox-export.utils";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "Art Library", "staging");

function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const document = buildN5GreyboxExportDocument("dark");
  const svgDark = renderN5GreyboxSvg(document, "dark");
  const svgLight = renderN5GreyboxSvg(document, "light");

  const jsonPath = join(OUT_DIR, "n5-greybox.json");
  const svgDarkPath = join(OUT_DIR, "n5-greybox.svg");
  const svgLightPath = join(OUT_DIR, "n5-greybox-light.svg");
  const pngPath = join(OUT_DIR, "n5-greybox.png");

  writeFileSync(jsonPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  writeFileSync(svgDarkPath, svgDark, "utf8");
  writeFileSync(svgLightPath, svgLight, "utf8");

  void sharp(Buffer.from(svgDark))
    .png()
    .toFile(pngPath)
    .then(() => {
      console.log("N5 greybox export complete:");
      console.log(`  JSON  → ${jsonPath}`);
      console.log(`  SVG   → ${svgDarkPath}`);
      console.log(`  SVG   → ${svgLightPath}`);
      console.log(`  PNG   → ${pngPath}`);
      console.log(
        `  Slots → ${document.stats.totalSpineSlots} total (${document.stats.visibleSlots} visible, ${document.stats.reservedSlots} reserved)`,
      );
    })
    .catch((error: unknown) => {
      console.error("PNG render failed:", error);
      process.exitCode = 1;
    });
}

main();
