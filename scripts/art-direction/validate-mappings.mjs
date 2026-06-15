#!/usr/bin/env node
/**
 * Validates that every ArtAssetRef in art-mappings resolves to a file under public/art/.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const mappingsPath = join(root, "lib/assets/art-mappings.ts");
const lessonNodePath = join(root, "lib/assets/lesson-node-assets.ts");

const SCREEN_ASSET_EXPORTS = [
  "JOURNEY_WORLD_ASSETS",
  "CAMP_WORLD_ASSETS",
  "SCENE_BACKGROUND_ASSETS",
  "REGION_HERO_ASSETS",
];

function extractRefs(source) {
  const refs = [];
  const pattern = /category:\s*"([^"]+)"\s*,\s*id:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    refs.push({ category: match[1], id: match[2] });
  }
  return refs;
}

function extractScreenMatrixRefs(source) {
  const refs = [];
  for (const exportName of SCREEN_ASSET_EXPORTS) {
    const blockPattern = new RegExp(
      `export const ${exportName}[\\s\\S]*?=\\s*\\{([\\s\\S]*?)\\}\\s*as const`,
    );
    const blockMatch = blockPattern.exec(source);
    if (!blockMatch) continue;
    refs.push(...extractRefs(blockMatch[1]));
  }
  return refs;
}

function extractBlock(source, exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start === -1) return "";
  const braceStart = source.indexOf("{", start);
  if (braceStart === -1) return "";
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart, i + 1);
      }
    }
  }
  return "";
}

function resolvePath(ref) {
  return join(root, "public", "art", ref.category, `${ref.id}.webp`);
}

const mappingsSource = existsSync(mappingsPath) ? readFileSync(mappingsPath, "utf8") : "";
const sources = [mappingsPath, lessonNodePath];
const allRefs = sources.flatMap((path) => {
  if (!existsSync(path)) return [];
  const source = readFileSync(path, "utf8");
  if (path === mappingsPath) {
    return [...extractRefs(source), ...extractScreenMatrixRefs(source)];
  }
  return extractRefs(source);
});

const missing = [];
const seen = new Set();

for (const ref of allRefs) {
  const key = `${ref.category}/${ref.id}`;
  if (seen.has(key)) continue;
  seen.add(key);
  if (!existsSync(resolvePath(ref))) {
    missing.push(key);
  }
}

const yamaExpressionBlock = extractBlock(mappingsSource, "YAMA_EXPRESSION_ASSETS");
const yamaPoseBlock = extractBlock(mappingsSource, "NOBORU_POSE_ASSETS");
const yamaExpressionRefs = extractRefs(yamaExpressionBlock);
const yamaPoseRefs = extractRefs(yamaPoseBlock);

if (missing.length > 0) {
  console.error("Missing art assets:");
  for (const entry of missing.sort()) {
    console.error(`  - ${entry}.webp`);
  }
  process.exit(1);
}

console.log(`OK: ${seen.size} unique asset refs validated.`);
console.log(
  `OK: ${yamaExpressionRefs.length} Yama expression assets, ${yamaPoseRefs.length} Noboru poses.`,
);
