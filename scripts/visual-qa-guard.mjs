#!/usr/bin/env node
/**
 * Lightweight visual governance checks for mockup parity CI.
 * Fails on Lucide in learner features and StoryTitle normal-case overrides.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, "features");
const APP_AUTH_DIR = path.join(ROOT, "app", "(auth)");

const LUCIDE_ALLOWLIST = new Set([
  "features/admin",
  "features/offline/components/offline-status-banner.tsx",
  "features/onboarding/constants/onboarding.constants.ts",
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function isLucideAllowed(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  for (const allowed of LUCIDE_ALLOWLIST) {
    if (rel === allowed || rel.startsWith(`${allowed}/`)) return true;
  }
  return false;
}

const errors = [];

const featureFiles = await walk(FEATURES_DIR);
let authFiles = [];
try {
  authFiles = await walk(APP_AUTH_DIR);
} catch {
  authFiles = [];
}

for (const file of [...featureFiles, ...authFiles]) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const content = await readFile(file, "utf8");

  if (content.includes('from "lucide-react"') && !isLucideAllowed(file)) {
    errors.push(`${rel}: lucide-react import not allowed in learner features`);
  }

  if (
    content.includes("StoryTitle") &&
    /StoryTitle[^>]*normal-case|normal-case[^>]*StoryTitle/.test(content)
  ) {
    errors.push(`${rel}: StoryTitle must not use normal-case override`);
  }
  if (
    content.includes("RegionHeroImage") &&
    /scene="(shop_interior|world_map_peaks)"/.test(content) === false &&
    /profile-screen|settings-screen|inventory|memory-book|social|events/.test(rel) &&
    !rel.includes("profile-screen.tsx")
  ) {
    // Region hero stand-in on non-profile illustrated screens
    if (/RegionHeroImage/.test(content) && /settings-screen|inventory-screen/.test(rel)) {
      errors.push(`${rel}: RegionHeroImage stand-in on illustrated screen (use SceneImage)`);
    }
  }
}

if (errors.length > 0) {
  console.error("Visual QA guard failed:\n");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("Visual QA guard passed.");
