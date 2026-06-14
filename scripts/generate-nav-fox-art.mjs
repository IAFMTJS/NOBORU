/**
 * Generates immersive bottom-nav Mountain Fox stickers and themed tab icons.
 *
 * Fox assets composite approved Yama poses with tab-specific props (campfire,
 * trail, compass, etc.) for the active nav state.
 *
 * Usage:
 *   node scripts/generate-nav-fox-art.mjs
 *   npm run assets:stickers
 */
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const CANVAS = 256;
const RED = "#D64045";
const GOLD = "#F6AE2D";
const GREEN = "#2FBF71";

const NAV_TABS = ["camp", "journey", "dojo", "world", "profile"];

const FOX_SOURCES = {
  camp: {
    dark: "yama_encouraging_dark_v2",
    light: "yama_encouraging_light_v1",
    prop: "campfire",
  },
  journey: {
    dark: "yama_adventure_hiking_dark_v1",
    light: "yama_adventure_hiking_light_v1",
    prop: "trail",
  },
  dojo: {
    dark: "yama_training_demo_stance_dark_v1",
    light: "yama_training_demo_stance_light_v1",
    prop: "dojo",
  },
  world: {
    dark: "yama_adventure_hiking_dark_v1",
    light: "yama_adventure_hiking_light_v1",
    prop: "compass",
  },
  profile: {
    dark: "yama_victorious_dark_v1",
    light: "yama_victorious_light_v1",
    prop: "journal",
  },
};

function propSvg(prop, theme) {
  const glow =
    theme === "light"
      ? `<radialGradient id="g" cx="50%" cy="55%" r="45%"><stop offset="0%" stop-color="${GOLD}" stop-opacity="0.18"/><stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>`
      : `<radialGradient id="g" cx="50%" cy="55%" r="45%"><stop offset="0%" stop-color="${RED}" stop-opacity="0.22"/><stop offset="100%" stop-color="${RED}" stop-opacity="0"/></radialGradient>`;

  const props = {
    campfire: `
      <ellipse cx="128" cy="214" rx="34" ry="7" fill="${GOLD}" opacity="0.35"/>
      <path d="M116 208 Q128 168 140 208 Z" fill="${RED}" opacity="0.92"/>
      <path d="M120 206 Q128 182 136 206 Z" fill="${GOLD}" opacity="0.9"/>
      <circle cx="128" cy="176" r="10" fill="${GOLD}" opacity="0.25"/>`,
    trail: `
      <path d="M48 220 C80 190 110 205 128 188 C146 171 176 196 208 178" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
      <circle cx="80" cy="206" r="4" fill="${RED}" opacity="0.8"/>
      <circle cx="128" cy="188" r="4" fill="${GOLD}" opacity="0.9"/>
      <circle cx="176" cy="192" r="4" fill="${RED}" opacity="0.65"/>`,
    dojo: `
      <path d="M88 208 H168" stroke="${RED}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <path d="M98 208 V188 H158 V208" fill="none" stroke="${RED}" stroke-width="2.5"/>
      <path d="M78 188 H178 L128 162 Z" fill="none" stroke="${RED}" stroke-width="2.5" opacity="0.85"/>
      <path d="M118 188 V176 H138 V188" fill="none" stroke="${GREEN}" stroke-width="2" opacity="0.7"/>`,
    compass: `
      <circle cx="188" cy="188" r="24" fill="none" stroke="${RED}" stroke-width="2.2" opacity="0.85"/>
      <path d="M188 170 L194 188 L188 206 L182 188 Z" fill="${RED}" opacity="0.85"/>
      <path d="M170 188 L188 194 L206 188 L188 182 Z" fill="${GOLD}" opacity="0.75"/>
      <circle cx="188" cy="188" r="3" fill="${RED}"/>`,
    journal: `
      <rect x="68" y="186" width="36" height="26" rx="3" fill="none" stroke="${RED}" stroke-width="2" opacity="0.8"/>
      <path d="M74 194 H98 M74 200 H94 M74 206 H90" stroke="${GOLD}" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
      <path d="M176 170 L184 182 L172 182 Z" fill="${GOLD}" opacity="0.85"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
    <defs>${glow}</defs>
    <rect width="${CANVAS}" height="${CANVAS}" fill="url(#g)"/>
    ${props[prop] ?? ""}
  </svg>`;
}

const NAV_ICONS = {
  camp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 20h16"/><path d="M8 20 L12 8 L16 20"/><path d="M10 20v-4h4v4"/>
    <path d="M12 6v2"/><path d="M11 12 Q12 10 13 12" fill="${GOLD}" stroke="none"/>
  </svg>`,
  journey: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19c3-6 5-9 8-12 3 3 5 6 8 12"/>
    <circle cx="12" cy="7" r="1.5" fill="${RED}" stroke="none"/>
    <circle cx="9" cy="12" r="1.25" fill="${GOLD}" stroke="none"/>
    <circle cx="15" cy="16" r="1.25" fill="${RED}" stroke="none"/>
  </svg>`,
  dojo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 14h14"/><path d="M7 14V10h10v4"/><path d="M4 10 L12 5 L20 10"/>
    <path d="M10 10V8h4v2" stroke="${GREEN}"/>
  </svg>`,
  world: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>
    <path d="M12 8l2.5 4.5-4.5 1.5 2-6z" fill="${GOLD}" stroke="none"/>
    <circle cx="12" cy="12" r="1" fill="${RED}" stroke="none"/>
  </svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="3.5"/>
    <path d="M5 20v-1a7 7 0 0 1 14 0v1"/>
    <path d="M16 4.5l1.5 1.2L16 7"/>
  </svg>`,
};

function foxMetadata(id, tab, theme) {
  return {
    id,
    name: `Yama Nav ${tab.charAt(0).toUpperCase()}${tab.slice(1)} ${theme === "light" ? "Light" : "Dark"}`,
    version: "v1",
    category: "mascots",
    owner_agent: "Art Director Agent",
    created_at: "2026-06-14",
    updated_at: "2026-06-14",
    status: "approved",
    tags: ["yama", "mascot", "bottom-nav", tab, theme, "immersive-nav"],
    usage_locations: ["bottom-nav", "immersive-navigation"],
    design_notes: `Dedicated Mountain Fox pose for the ${tab} nav tab with themed prop overlay.`,
    files: [`${id}.png`],
  };
}

function iconMetadata(id, tab) {
  return {
    id,
    name: `Nav Icon ${tab.charAt(0).toUpperCase()}${tab.slice(1)}`,
    version: "v1",
    category: "icons",
    owner_agent: "Art Director Agent",
    created_at: "2026-06-14",
    updated_at: "2026-06-14",
    status: "approved",
    tags: ["nav", "bottom-nav", tab, "immersive-nav"],
    usage_locations: ["bottom-nav"],
    files: [`${id}.png`],
  };
}

async function resolveSourcePng(sourceId) {
  const candidates = [
    path.join(root, "assets", "mascots", sourceId, `${sourceId}.png`),
    path.join(root, "assets", "mascots", "_staging", `${sourceId}.png`),
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

async function composeNavFox(tab, theme) {
  const config = FOX_SOURCES[tab];
  const sourceId = theme === "light" ? config.light : config.dark;
  const id = `yama_nav_${tab}_${theme}_v1`;
  const dir = path.join(root, "assets", "mascots", id);
  await mkdir(dir, { recursive: true });

  const sourcePath = await resolveSourcePng(sourceId);
  const foxBuffer = await sharp(sourcePath)
    .resize(210, 210, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const propBuffer = await sharp(Buffer.from(propSvg(config.prop, theme)))
    .resize(CANVAS, CANVAS)
    .png()
    .toBuffer();

  const pngPath = path.join(dir, `${id}.png`);
  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: propBuffer, top: 0, left: 0 },
      { input: foxBuffer, top: 18, left: 23 },
    ])
    .png()
    .toFile(pngPath);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(foxMetadata(id, tab, theme), null, 2),
  );

  console.log(`Generated fox ${path.relative(root, pngPath)}`);
}

async function composeNavIcon(tab) {
  const id = `icon_nav_${tab}_v1`;
  const dir = path.join(root, "assets", "icons", id);
  await mkdir(dir, { recursive: true });

  const pngPath = path.join(dir, `${id}.png`);
  await sharp(Buffer.from(NAV_ICONS[tab]))
    .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(pngPath);

  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(iconMetadata(id, tab), null, 2),
  );

  console.log(`Generated icon ${path.relative(root, pngPath)}`);
}

async function main() {
  for (const tab of NAV_TABS) {
    await composeNavIcon(tab);
    await composeNavFox(tab, "dark");
    await composeNavFox(tab, "light");
  }

  console.log("Nav fox art ready. Run: npm run assets:stickers");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
