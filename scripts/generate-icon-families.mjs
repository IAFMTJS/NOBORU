/**
 * Generates dojo/world thin-line icons and hub hero scene art (v2 family).
 *
 * Output: PNG in assets/icons/{id}/, WebP in public/icons/
 *
 * Usage: node scripts/generate-icon-families.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const VERSION = "v2";
const ICON_SIZE = 96;
const HUB_WIDTH = 512;
const HUB_HEIGHT = 320;

const STROKE = "#F5F0E8";
const STROKE_MUTED = "#A8A29E";
const GOLD = "#F6AE2D";
const RED = "#D64045";
const EMERALD = "#2FBF71";
const SKY = "#38bdf8";
const VIOLET = "#A78BFA";

const DOJO_ICONS = {
  kana: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 6h12M6 12h8M6 18h10"/>
    <text x="14" y="17" font-size="8" fill="${GOLD}" stroke="none" font-family="serif">あ</text>
  </svg>`,
  vocab: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4h14v16H5z"/><path d="M9 8h6M9 12h6M9 16h4"/>
    <circle cx="17" cy="7" r="1.5" fill="${GOLD}" stroke="none"/>
  </svg>`,
  grammar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 8h16M4 16h16"/><path d="M8 8v8M16 8v8"/>
    <circle cx="12" cy="12" r="1.25" fill="${EMERALD}" stroke="none"/>
  </svg>`,
  listening: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 10a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0v-4z"/><path d="M12 18v2M9 20h6"/>
    <path d="M5 12H3M21 12h-2" stroke="${STROKE_MUTED}" stroke-width="1"/>
  </svg>`,
  review: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 4a8 8 0 1 1 0 16"/><path d="M12 8v4l3 2"/>
    <path d="M4 4l2 2M20 4l-2 2" stroke="${GOLD}" stroke-width="1"/>
  </svg>`,
  kanji: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="4" width="14" height="16" rx="1.5"/>
    <path d="M8 9h8M8 13h6M12 9v8"/>
  </svg>`,
  reading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 6c2-1 4-1 6 0s4 1 6 0v12c-2 1-4 1-6 0s-4-1-6 0V6z"/>
    <path d="M10 6v12M14 6v12" stroke="${STROKE_MUTED}" stroke-width="1"/>
  </svg>`,
};

const WORLD_ICONS = {
  trials: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 10h12M8 10V7h8v3"/><path d="M7 10v8h10v-8"/>
    <circle cx="12" cy="14" r="2" fill="${GOLD}" stroke="none"/>
  </svg>`,
  games: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="8" width="16" height="10" rx="3"/>
    <path d="M9 11v4M7 13h4"/><circle cx="16" cy="13" r="1" fill="${RED}" stroke="none"/><circle cx="18" cy="15" r="1" fill="${GOLD}" stroke="none"/>
  </svg>`,
  social: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="8" r="2.5"/><circle cx="16" cy="9" r="2"/><path d="M4 18v-1a5 5 0 0 1 8-3.5M14 18v-1a4 4 0 0 1 3-3.8"/>
  </svg>`,
  shop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    <circle cx="12" cy="14" r="2" fill="${GOLD}" stroke="none"/>
  </svg>`,
  inventory: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 6h8l1 14H7L8 6z"/><path d="M10 6V5a2 2 0 0 1 4 0v1"/>
    <path d="M9 11h6M9 15h4" stroke="${STROKE_MUTED}" stroke-width="1"/>
  </svg>`,
  events: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>
    <path d="M12 13l1.5 2.5-2.5 1 1.5-3.5z" fill="${GOLD}" stroke="none"/>
  </svg>`,
  map: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/>
    <circle cx="12" cy="10" r="1.25" fill="${SKY}" stroke="none"/>
  </svg>`,
};

const HUB_SCENES = {
  vocabulary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <path d="M80 220 Q256 120 432 220 L432 320 L80 320 Z" fill="#243044" opacity="0.8"/>
    <rect x="180" y="140" width="152" height="100" rx="6" fill="#2a3548" stroke="${GOLD}" stroke-width="2" opacity="0.9"/>
    <path d="M200 165h112M200 190h80M200 215h96" stroke="${STROKE_MUTED}" stroke-width="2" opacity="0.5"/>
  </svg>`,
  kanji: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a1a12"/><stop offset="100%" stop-color="#142820"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <path d="M120 240 L256 80 L392 240 Z" fill="#1a3d2a" opacity="0.85"/>
    <rect x="206" y="120" width="100" height="100" rx="4" fill="none" stroke="${EMERALD}" stroke-width="3" opacity="0.7"/>
    <path d="M230 145h52M256 145v70M230 180h52" stroke="${STROKE}" stroke-width="3" opacity="0.6"/>
  </svg>`,
  grammar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1428"/><stop offset="100%" stop-color="#0c0a14"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <rect x="186" y="100" width="140" height="10" fill="#8B2500"/><rect x="206" y="110" width="100" height="6" fill="#A03000"/>
    <rect x="226" y="116" width="10" height="120" fill="#8B2500"/><rect x="276" y="116" width="10" height="120" fill="#8B2500"/>
    <path d="M140 260h232" stroke="${EMERALD}" stroke-width="2" opacity="0.4"/>
  </svg>`,
  reading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0c1220"/><stop offset="100%" stop-color="#1a2332"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <circle cx="380" cy="70" r="28" fill="${GOLD}" opacity="0.2"/>
    <path d="M160 120c40-20 80-20 120 0v140c-40-20-80-20-120 0V120z" fill="#2a3548" stroke="${STROKE_MUTED}" stroke-width="2"/>
    <path d="M220 120v140" stroke="${STROKE_MUTED}" stroke-width="1.5"/>
  </svg>`,
  listening: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <path d="M180 160 Q200 120 220 160 T260 160 T300 160 T340 160" stroke="${SKY}" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M180 190 Q200 150 220 190 T260 190 T300 190 T340 190" stroke="${VIOLET}" stroke-width="2" fill="none" opacity="0.4"/>
    <ellipse cx="256" cy="200" rx="40" ry="24" fill="none" stroke="${STROKE}" stroke-width="2" opacity="0.5"/>
  </svg>`,
  hiragana: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3d1a2e"/><stop offset="100%" stop-color="#1a1420"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <circle cx="100" cy="80" r="8" fill="#F472B6" opacity="0.4"/><circle cx="400" cy="100" r="6" fill="#FDA4AF" opacity="0.35"/>
    <text x="256" y="190" text-anchor="middle" font-size="96" fill="${STROKE}" opacity="0.85" font-family="serif">あ</text>
  </svg>`,
  katakana: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0c4a6e"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs>
    <rect width="512" height="320" fill="url(#sky)"/>
    <path d="M0 200 Q128 170 256 190 T512 200" stroke="#7dd3fc" stroke-width="2" opacity="0.3" fill="none"/>
    <text x="256" y="190" text-anchor="middle" font-size="96" fill="${STROKE}" opacity="0.85" font-family="serif">ア</text>
  </svg>`,
};

function metadata(id, category, name, tags, files) {
  return {
    id,
    name,
    version: VERSION,
    category,
    owner_agent: "Art Director Agent",
    created_at: "2026-06-14",
    updated_at: "2026-06-14",
    status: "approved",
    tags,
    usage_locations: ["dojo", "world", "hub"],
    files,
  };
}

async function publishIcon(id, svg, size = ICON_SIZE) {
  const dir = path.join(root, "assets", "icons", id);
  await mkdir(dir, { recursive: true });

  const pngPath = path.join(dir, `${id}.png`);
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const webpBuffer = await sharp(pngBuffer)
    .webp({ quality: 90, effort: 4, alphaQuality: 100 })
    .toBuffer();

  await writeFile(pngPath, pngBuffer);

  const publicDir = path.join(root, "public", "icons");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, `${id}.webp`), webpBuffer);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(metadata(id, "icons", id.replace(/_/g, " "), ["icon", id, VERSION], [`${id}.png`]), null, 2),
  );

  console.log(`Generated icon ${path.relative(root, pngPath)}`);
}

async function publishHubScene(id, svg) {
  const dir = path.join(root, "assets", "icons", id);
  await mkdir(dir, { recursive: true });

  const pngPath = path.join(dir, `${id}.png`);
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(HUB_WIDTH, HUB_HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();

  const webpBuffer = await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();

  await writeFile(pngPath, pngBuffer);

  const publicDir = path.join(root, "public", "icons");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, `${id}.webp`), webpBuffer);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(
      metadata(id, "icons", id.replace(/_/g, " "), ["hub", "hero", id, VERSION], [`${id}.png`]),
      null,
      2,
    ),
  );

  console.log(`Generated hub scene ${path.relative(root, pngPath)}`);
}

async function main() {
  for (const [slug, svg] of Object.entries(DOJO_ICONS)) {
    await publishIcon(`icon_dojo_${slug}_${VERSION}`, svg);
  }

  for (const [slug, svg] of Object.entries(WORLD_ICONS)) {
    await publishIcon(`icon_world_${slug}_${VERSION}`, svg);
  }

  for (const [slug, svg] of Object.entries(HUB_SCENES)) {
    await publishHubScene(`icon_ui_hub_${slug}_${VERSION}`, svg);
  }

  console.log("Icon families ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
