/**
 * Generates Noboru bottom-nav icon PNGs (96×96) from inline SVG.
 * Output: assets/icons/icon_nav_{tab}_v1/icon_nav_{tab}_v1.png
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const STROKE = "#D64045";
const STROKE_WIDTH = 2;
const SIZE = 96;

const NAV_ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="${STROKE_WIDTH / 4}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 20h16"/><path d="M6 20V11l6-7 6 7v9"/><path d="M9 20v-5h6v5"/><path d="M12 4v2"/>
  </svg>`,
  learn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="${STROKE_WIDTH / 4}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19c3-6 5-9 8-12 3 3 5 6 8 12"/>
    <circle cx="12" cy="7" r="1.5" fill="${STROKE}" stroke="none"/>
    <circle cx="9" cy="12" r="1.25" fill="${STROKE}" stroke="none"/>
    <circle cx="15" cy="16" r="1.25" fill="${STROKE}" stroke="none"/>
  </svg>`,
  review: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="${STROKE_WIDTH / 4}" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="8" width="8" height="8" rx="1.5"/>
    <path d="M12 6v-2M12 20v-2M6 12H4M20 12h-2"/>
    <path d="M16 4.5a7 7 0 0 1 2.8 11.2M8 19.5a7 7 0 0 1-2.8-11.2"/>
  </svg>`,
  explore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="${STROKE_WIDTH / 4}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>
    <path d="M12 8l2.5 4.5-4.5 1.5 2-6z" fill="${STROKE}" stroke="none"/>
    <circle cx="12" cy="12" r="1" fill="${STROKE}" stroke="none"/>
  </svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="${STROKE_WIDTH / 4}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="3.5"/>
    <path d="M5 20v-1a7 7 0 0 1 14 0v1"/>
    <path d="M16 4.5l1.5 1.2L16 7"/>
  </svg>`,
};

const METADATA_TEMPLATE = (id, name, tags) => ({
  id,
  name,
  version: "v1",
  category: "icons",
  owner_agent: "Art Director Agent",
  created_at: "2026-06-12",
  updated_at: "2026-06-12",
  status: "approved",
  tags,
  usage_locations: ["bottom-nav"],
  files: [`${id}.png`],
});

async function main() {
  for (const [tab, svg] of Object.entries(NAV_ICONS)) {
    const id = `icon_nav_${tab}_v1`;
    const dir = path.join(root, "assets", "icons", id);
    await mkdir(dir, { recursive: true });

    const pngPath = path.join(dir, `${id}.png`);
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await writeFile(pngPath, pngBuffer);
    await writeFile(
      path.join(dir, "metadata.json"),
      JSON.stringify(
        METADATA_TEMPLATE(id, `Nav Icon ${tab.charAt(0).toUpperCase()}${tab.slice(1)}`, [
          "nav",
          "bottom-nav",
          tab,
        ]),
        null,
        2,
      ),
    );

    console.log(`Generated ${path.relative(root, pngPath)}`);
  }

  console.log("Nav icons ready. Run: npm run assets:stickers");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
