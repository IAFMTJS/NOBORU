#!/usr/bin/env node
/**
 * Build PWA icon variants from Art Library app icon sources into public/icons/.
 * Usage: node scripts/build-pwa-icons.mjs
 */
import { mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "icons");
const SPLASH_OUT = join(OUT, "splash");

const SOURCES = {
  light: join(
    ROOT,
    "Art Library/_rejected/no_transparency/icon_app_light_light_v1.png",
  ),
  dark: join(
    ROOT,
    "Art Library/_rejected/no_transparency/icon_app_dark_dark_v1.png",
  ),
};

const BG = {
  light: "#F4EFE3",
  dark: "#0D1320",
};

async function ensureMaskable(input, size, bg) {
  const inner = Math.round(size * 0.72);
  const resized = await sharp(input).resize(inner, inner, { fit: "contain" }).png().toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

async function writeWebp(buffer, path, size) {
  await sharp(buffer).resize(size, size).webp({ quality: 90 }).toFile(path);
}

async function buildIcons() {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(SPLASH_OUT, { recursive: true });

  for (const [theme, src] of Object.entries(SOURCES)) {
    if (!existsSync(src)) {
      throw new Error(`Missing app icon source: ${src}`);
    }
  }

  const darkSource = SOURCES.dark;
  const lightSource = SOURCES.light;

  await writeWebp(darkSource, join(OUT, "icon_app_dark_v1.webp"), 512);
  await writeWebp(lightSource, join(OUT, "icon_app_light_v1.webp"), 512);
  await writeWebp(darkSource, join(OUT, "icon-192_v1.webp"), 192);
  await writeWebp(darkSource, join(OUT, "icon-512_v1.webp"), 512);

  const maskableDark = await ensureMaskable(darkSource, 512, BG.dark);
  const maskableLight = await ensureMaskable(lightSource, 512, BG.light);
  await sharp(maskableDark).webp({ quality: 90 }).toFile(join(OUT, "icon_app_maskable_dark_v1.webp"));
  await sharp(maskableLight).webp({ quality: 90 }).toFile(join(OUT, "icon_app_maskable_light_v1.webp"));

  await sharp(darkSource)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toFile(join(OUT, "apple-touch-icon_v1.png"));

  const splashSizes = [
    { name: "iphone-15-pro-max", width: 1290, height: 2796 },
    { name: "iphone-15", width: 1170, height: 2532 },
    { name: "iphone-se", width: 750, height: 1334 },
  ];

  for (const { name, width, height } of splashSizes) {
    const iconSize = Math.round(Math.min(width, height) * 0.28);
    const icon = await sharp(darkSource)
      .resize(iconSize, iconSize, { fit: "contain" })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: "#0F1115",
      },
    })
      .composite([{ input: icon, gravity: "centre" }])
      .png()
      .toFile(join(SPLASH_OUT, `splash_${name}_dark_v1.png`));
  }

  console.log(`PWA icons written to ${OUT}`);
}

buildIcons().catch((error) => {
  console.error(error);
  process.exit(1);
});
