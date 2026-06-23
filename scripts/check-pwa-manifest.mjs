#!/usr/bin/env node
/**
 * Fast CI gate for PWA manifest and required static assets.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "public/manifest.json",
  "public/sw.js",
  "public/icons/icon-192_v1.webp",
  "public/icons/icon-512_v1.webp",
  "public/icons/apple-touch-icon_v1.png",
  "public/icons/icon_app_maskable_dark_v1.webp",
  "public/icons/icon_app_maskable_light_v1.webp",
];

let failed = false;

for (const relative of REQUIRED_FILES) {
  const absolute = join(ROOT, relative);
  if (!existsSync(absolute)) {
    console.error(`Missing required PWA asset: ${relative}`);
    failed = true;
  }
}

const manifestPath = join(ROOT, "public/manifest.json");
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
    console.error("manifest.json must define at least two icons.");
    failed = true;
  }
  if (manifest.display !== "standalone") {
    console.error('manifest.json display must be "standalone".');
    failed = true;
  }
  if (!manifest.start_url) {
    console.error("manifest.json must define start_url.");
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log("PWA manifest and assets validated.");
