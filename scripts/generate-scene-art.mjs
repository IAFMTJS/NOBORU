/**
 * Generates illustrated scene backgrounds for Tier A screens.
 * Usage: node scripts/generate-scene-art.mjs && npm run assets:stickers
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const VERSION = "v1";

const SCENES = {
  ui_camp_base_night: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="60%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0c1220"/>
        </linearGradient>
        <radialGradient id="fire" cx="50%" cy="85%" r="25%">
          <stop offset="0%" stop-color="#F6AE2D" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#F6AE2D" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <path d="M0 420 Q200 380 400 400 T800 420 L800 600 L0 600 Z" fill="#1a2332"/>
      <path d="M100 420 L200 280 L300 420 Z" fill="#243044" opacity="0.7"/>
      <path d="M500 430 L620 250 L740 430 Z" fill="#1e2a3d" opacity="0.85"/>
      <ellipse cx="400" cy="480" rx="80" ry="12" fill="url(#fire)"/>
      <path d="M385 470 Q400 420 415 470 Z" fill="#D64045" opacity="0.9"/>
      <path d="M390 468 Q400 435 410 468 Z" fill="#F6AE2D" opacity="0.85"/>
      <circle cx="120" cy="80" r="1.5" fill="#fff" opacity="0.6"/>
      <circle cx="680" cy="120" r="1" fill="#fff" opacity="0.5"/>
      <circle cx="350" cy="60" r="1.2" fill="#fff" opacity="0.4"/>
    </svg>`,
  },
  ui_camp_base_light: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#87CEEB"/>
          <stop offset="100%" stop-color="#E8D5B5"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <path d="M0 400 Q200 360 400 380 T800 400 L800 600 L0 600 Z" fill="#6B8F71"/>
      <path d="M150 400 L250 260 L350 400 Z" fill="#5A7A60" opacity="0.8"/>
      <path d="M480 410 L600 240 L720 410 Z" fill="#4A6A50" opacity="0.75"/>
    </svg>`,
  },
  ui_dojo_forest_night: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1a12"/>
          <stop offset="100%" stop-color="#142820"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <path d="M0 350 L80 200 L160 350 Z" fill="#1a3d2a" opacity="0.9"/>
      <path d="M120 360 L200 180 L280 360 Z" fill="#234a32"/>
      <path d="M500 340 L600 160 L700 340 Z" fill="#1a3d2a"/>
      <path d="M650 370 L720 220 L790 370 Z" fill="#2d5a3d" opacity="0.85"/>
      <rect x="0" y="380" width="800" height="220" fill="#0f2418"/>
      <path d="M320 380 L340 320 L360 380" stroke="#2FBF71" stroke-width="2" fill="none" opacity="0.5"/>
    </svg>`,
  },
  ui_shrine_torii_night: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0c0a14"/>
          <stop offset="50%" stop-color="#1a1428"/>
          <stop offset="100%" stop-color="#0a0810"/>
        </linearGradient>
        <radialGradient id="moon" cx="75%" cy="15%" r="8%">
          <stop offset="0%" stop-color="#F6AE2D" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#F6AE2D" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <circle cx="600" cy="90" r="40" fill="url(#moon)"/>
      <circle cx="600" cy="90" r="18" fill="#F6AE2D" opacity="0.25"/>
      <rect x="280" y="180" width="240" height="12" rx="2" fill="#8B2500"/>
      <rect x="300" y="192" width="200" height="8" rx="1" fill="#A03000"/>
      <rect x="320" y="200" width="12" height="200" fill="#8B2500"/>
      <rect x="468" y="200" width="12" height="200" fill="#8B2500"/>
      <path d="M0 420 Q400 380 800 420 L800 600 L0 600 Z" fill="#14101a"/>
      <ellipse cx="400" cy="280" rx="60" ry="80" fill="#F6AE2D" opacity="0.08"/>
    </svg>`,
  },
  ui_world_map_peaks: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1a1a2e"/>
          <stop offset="100%" stop-color="#16213e"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <path d="M0 450 L150 200 L300 450 Z" fill="#2d3748"/>
      <path d="M200 450 L400 120 L600 450 Z" fill="#4a5568"/>
      <path d="M500 450 L650 180 L800 450 Z" fill="#2d3748" opacity="0.9"/>
      <path d="M350 450 L450 250 L550 450 Z" fill="#718096" opacity="0.6"/>
      <circle cx="400" cy="130" r="3" fill="#F6AE2D" opacity="0.8"/>
    </svg>`,
  },
  ui_shop_trail_interior: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#1a1410"/>
      <rect x="100" y="80" width="600" height="400" rx="8" fill="#2a2018" stroke="#4a3828" stroke-width="2"/>
      <rect x="140" y="120" width="120" height="140" rx="4" fill="#3a2a20"/>
      <rect x="290" y="120" width="120" height="140" rx="4" fill="#3a2a20"/>
      <rect x="440" y="120" width="120" height="140" rx="4" fill="#3a2a20"/>
      <ellipse cx="400" cy="520" rx="200" ry="20" fill="#F6AE2D" opacity="0.15"/>
    </svg>`,
  },
  ui_lesson_complete_trail_glow: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <radialGradient id="glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stop-color="#F6AE2D" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#F6AE2D" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="#0f1419"/>
      <ellipse cx="400" cy="380" rx="300" ry="150" fill="url(#glow)"/>
      <path d="M200 400 Q400 300 600 400" stroke="#F6AE2D" stroke-width="3" fill="none" opacity="0.6"/>
    </svg>`,
  },
  ui_checkpoint_shrine_close: {
    width: 800,
    height: 600,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#0a0e14"/>
      <rect x="320" y="160" width="160" height="10" fill="#8B2500"/>
      <rect x="340" y="170" width="120" height="6" fill="#A03000"/>
      <rect x="360" y="176" width="8" height="180" fill="#8B2500"/>
      <rect x="432" y="176" width="8" height="180" fill="#8B2500"/>
      <ellipse cx="400" cy="250" rx="80" ry="100" fill="#F6AE2D" opacity="0.12"/>
    </svg>`,
  },
  ui_nav_skin_ember_night: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1c1410"/><stop offset="100%" stop-color="#2a1a12"/></linearGradient></defs><rect width="512" height="96" rx="24" fill="url(#g)"/><ellipse cx="256" cy="80" rx="120" ry="20" fill="#F6AE2D" opacity="0.2"/></svg>`,
  },
  ui_nav_skin_trail_mist: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><rect width="512" height="96" rx="24" fill="#0f172a"/><path d="M0 60 Q128 40 256 55 T512 60" stroke="#38bdf8" stroke-width="1" opacity="0.3" fill="none"/></svg>`,
  },
  ui_nav_skin_bamboo_grove: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><rect width="512" height="96" rx="24" fill="#0a1a12"/><rect x="40" y="20" width="6" height="60" fill="#2FBF71" opacity="0.4"/><rect x="80" y="10" width="6" height="70" fill="#2FBF71" opacity="0.35"/></svg>`,
  },
  ui_nav_skin_moonlit_torii: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><rect width="512" height="96" rx="24" fill="#1a1428"/><circle cx="420" cy="30" r="12" fill="#F6AE2D" opacity="0.25"/></svg>`,
  },
  ui_nav_skin_stone_path: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><rect width="512" height="96" rx="24" fill="#1a1814"/><path d="M0 70 H512" stroke="#78716c" stroke-width="2" opacity="0.4"/></svg>`,
  },
  ui_nav_skin_sakura_bloom: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2a1420"/><stop offset="100%" stop-color="#3d1a2e"/></linearGradient></defs><rect width="512" height="96" rx="24" fill="url(#g)"/><circle cx="80" cy="40" r="6" fill="#F472B6" opacity="0.5"/><circle cx="200" cy="55" r="5" fill="#FDA4AF" opacity="0.45"/><circle cx="360" cy="35" r="7" fill="#F472B6" opacity="0.4"/><circle cx="440" cy="50" r="4" fill="#FDA4AF" opacity="0.5"/></svg>`,
  },
  ui_nav_skin_winter_summit: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="512" height="96" rx="24" fill="url(#g)"/><path d="M0 70 L60 45 L120 70 Z" fill="#94a3b8" opacity="0.35"/><path d="M180 72 L260 38 L340 72 Z" fill="#cbd5e1" opacity="0.3"/><path d="M380 70 L440 48 L500 70 Z" fill="#94a3b8" opacity="0.35"/></svg>`,
  },
  ui_nav_skin_lantern_festival: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><rect width="512" height="96" rx="24" fill="#1a1008"/><ellipse cx="128" cy="48" rx="14" ry="18" fill="#F6AE2D" opacity="0.35"/><ellipse cx="256" cy="44" rx="16" ry="20" fill="#D64045" opacity="0.3"/><ellipse cx="384" cy="50" rx="14" ry="18" fill="#F6AE2D" opacity="0.35"/><rect x="120" y="30" width="16" height="4" rx="1" fill="#78716c" opacity="0.5"/><rect x="248" y="26" width="16" height="4" rx="1" fill="#78716c" opacity="0.5"/><rect x="376" y="32" width="16" height="4" rx="1" fill="#78716c" opacity="0.5"/></svg>`,
  },
  ui_nav_skin_cherry_dawn: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2040"/><stop offset="50%" stop-color="#7c3a5c"/><stop offset="100%" stop-color="#1a1420"/></linearGradient></defs><rect width="512" height="96" rx="24" fill="url(#g)"/><ellipse cx="256" cy="20" rx="180" ry="30" fill="#FDA4AF" opacity="0.25"/></svg>`,
  },
  ui_nav_skin_cloud_sea: {
    width: 512,
    height: 96,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 96"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0c4a6e"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="512" height="96" rx="24" fill="url(#g)"/><path d="M0 55 Q80 40 160 55 T320 55 T512 55" stroke="#7dd3fc" stroke-width="2" opacity="0.25" fill="none"/><path d="M0 70 Q100 58 200 70 T400 70 T512 70" stroke="#bae6fd" stroke-width="1.5" opacity="0.2" fill="none"/></svg>`,
  },
};

async function writeScene(id, config) {
  const dir = path.join(root, "assets", "ui", `${id}_${VERSION}`);
  await mkdir(dir, { recursive: true });
  const pngPath = path.join(dir, `${id}_${VERSION}.png`);
  const webpBuffer = await sharp(Buffer.from(config.svg))
    .resize(config.width, config.height)
    .webp({ quality: 90 })
    .toBuffer();
  await sharp(webpBuffer).png().toFile(pngPath);
  const publicDir = path.join(root, "public", "ui");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, `${id}_${VERSION}.webp`), webpBuffer);
  await writeFile(
    path.join(dir, "metadata.json"),
    JSON.stringify(
      {
        id: `${id}_${VERSION}`,
        name: id.replace(/_/g, " "),
        version: VERSION,
        category: "ui",
        status: "approved",
        files: [`${id}_${VERSION}.png`],
      },
      null,
      2,
    ),
  );
  console.log(`Generated scene ${path.relative(root, pngPath)}`);
}

async function main() {
  for (const [id, config] of Object.entries(SCENES)) {
    await writeScene(id, config);
  }
  console.log("Scene art ready. Run: npm run assets:stickers");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
