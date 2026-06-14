/**
 * Generates immersive bottom-nav icons (v2 thin-line) and Mountain Fox stickers (v2).
 *
 * v2 icons: white/light stroke, mockup-aligned thin-line family.
 * v2 fox: transparent compositing — no full-canvas background rect.
 *
 * Usage: npm run assets:nav-fox
 */
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const VERSION = "v2";
const CANVAS = 256;
const STROKE = "#F5F0E8";
const STROKE_MUTED = "#A8A29E";
const GOLD = "#F6AE2D";
const RED = "#D64045";

const NAV_TABS = ["camp", "journey", "dojo", "world", "profile"];

const FOX_SOURCES = {
  camp: { dark: "yama_encouraging_dark_v2", light: "yama_encouraging_light_v1" },
  journey: { dark: "yama_adventure_hiking_dark_v1", light: "yama_adventure_hiking_light_v1" },
  dojo: { dark: "yama_training_demo_stance_dark_v1", light: "yama_training_demo_stance_light_v1" },
  world: { dark: "yama_adventure_hiking_dark_v1", light: "yama_adventure_hiking_light_v1" },
  profile: { dark: "yama_victorious_dark_v1", light: "yama_victorious_light_v1" },
};

/** Thin-line nav icons — stroke only, no fill blocks */
const NAV_ICONS_V2 = {
  camp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 20h16"/><path d="M8 20 L12 9 L16 20"/><path d="M10 20v-3h4v3"/>
    <path d="M12 7v1.5"/><circle cx="12" cy="6" r="0.75" fill="${GOLD}" stroke="none"/>
  </svg>`,
  journey: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 20 L8 14 L12 17 L16 11 L21 20"/>
    <path d="M6 20 L9 12 L12 15 L15 8 L18 20" stroke="${STROKE_MUTED}" stroke-width="1"/>
    <circle cx="12" cy="8" r="1" fill="${GOLD}" stroke="none"/>
    <circle cx="8" cy="13" r="0.75" fill="${STROKE}" stroke="none"/>
    <circle cx="16" cy="10" r="0.75" fill="${STROKE}" stroke="none"/>
  </svg>`,
  dojo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14h16"/><path d="M6 14V10h12v4"/><path d="M3 10 L12 4 L21 10"/>
    <path d="M10 10V7h4v3"/>
  </svg>`,
  world: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="7.5"/>
    <path d="M12 4.5v1.5M12 18v1.5M4.5 12h1.5M18 12h1.5"/>
    <path d="M12 9l1.5 2.5-2.5 1 1.5-3.5z" fill="${GOLD}" stroke="none"/>
  </svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="3"/>
    <path d="M5 20v-1a7 7 0 0 1 14 0v1"/>
  </svg>`,
};

const UI_ICONS = {
  chevron_down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>`,
  map: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/>
  </svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>`,
  flame: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22c-4-3-6-6-6-10a6 6 0 0 1 12 0c0 4-2 7-6 10z"/><path d="M12 22c-2-2-3-4-3-6 0-2 1.5-3 3-3s3 1 3 3c0 2-1 4-3 6z" fill="${GOLD}" opacity="0.4"/>
  </svg>`,
  gem: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9B6FD4" stroke-width="1.5" stroke-linejoin="round">
    <path d="M6 3h12l4 7-10 11L2 10l4-7z"/><path d="M2 10h20M6 3l6 18M18 3L12 21"/>
  </svg>`,
  trophy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M6 5h12v6a6 6 0 0 1-12 0V5z"/><path d="M12 15v3M8 21h8"/>
  </svg>`,
  gear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/>
  </svg>`,
  checkpoint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4v16"/><path d="M4 6h10l-2.5 4L14 14H4"/><circle cx="18" cy="6" r="2" fill="${GOLD}" stroke="none" opacity="0.8"/>
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
    usage_locations: ["bottom-nav", "immersive-navigation"],
    files,
  };
}

async function resolveSourcePng(sourceId) {
  const candidates = [
    path.join(root, "assets", "mascots", sourceId, `${sourceId}.png`),
    path.join(root, "assets", "mascots", "_staging", `${sourceId}.png`),
    path.join(root, "public", "mascots", `${sourceId}.webp`.replace(".webp", ".png")),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(`Missing source PNG for ${sourceId}`);
}

async function resolveSourceWebp(sourceId) {
  const webpPath = path.join(root, "public", "mascots", `${sourceId}.webp`);
  try {
    await access(webpPath);
    return webpPath;
  } catch {
    return resolveSourcePng(sourceId);
  }
}

async function composeNavFox(tab, theme) {
  const config = FOX_SOURCES[tab];
  const sourceId = theme === "light" ? config.light : config.dark;
  const id = `yama_nav_${tab}_${theme}_${VERSION}`;
  const dir = path.join(root, "assets", "mascots", id);
  await mkdir(dir, { recursive: true });

  const sourcePath = await resolveSourceWebp(sourceId);
  const pngPath = path.join(dir, `${id}.png`);

  await sharp(sourcePath)
    .resize(220, 220, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 18,
      bottom: 18,
      left: 18,
      right: 18,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(pngPath);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(
      metadata(id, "mascots", `Yama Nav ${tab} ${theme}`, ["yama", "mascot", "bottom-nav", tab, theme, VERSION], [
        `${id}.png`,
      ]),
      null,
      2,
    ),
  );

  console.log(`Generated fox ${path.relative(root, pngPath)}`);
}

async function composeIcon(name, svg, category = "icons") {
  const id = `icon_${name}_${VERSION}`;
  const dir = path.join(root, "assets", category === "icons" ? "icons" : "icons", id);
  await mkdir(dir, { recursive: true });

  const pngPath = path.join(dir, `${id}.png`);
  await sharp(Buffer.from(svg))
    .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(pngPath);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(
      metadata(id, "icons", name.replace(/_/g, " "), ["icon", name, VERSION], [`${id}.png`]),
      null,
      2,
    ),
  );

  console.log(`Generated icon ${path.relative(root, pngPath)}`);
}

async function main() {
  for (const tab of NAV_TABS) {
    await composeIcon(`nav_${tab}`, NAV_ICONS_V2[tab]);
    await composeNavFox(tab, "dark");
    await composeNavFox(tab, "light");
  }

  for (const [name, svg] of Object.entries(UI_ICONS)) {
    await composeIcon(`ui_${name}`, svg);
  }

  console.log("Nav v2 art ready. Run: npm run assets:stickers");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
