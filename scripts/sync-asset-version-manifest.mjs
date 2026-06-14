#!/usr/bin/env node
/**
 * Scans public/ WebP files and resolves asset version chains to lib/assets/asset-version-manifest.json.
 *
 * Usage: npm run assets:sync-version-manifest
 */
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const MANIFEST_PATH = path.join(ROOT, "lib", "assets", "asset-version-manifest.json");
const CHAINS_PATH = path.join(ROOT, "lib", "assets", "asset-version-chains.json");

async function fileExists(publicPath) {
  const rel = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  try {
    await access(path.join(PUBLIC_DIR, rel));
    return true;
  } catch {
    return false;
  }
}

async function walkWebpFiles(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walkWebpFiles(path.join(dir, entry.name), rel)));
    } else if (entry.name.endsWith(".webp")) {
      files.push(`/${rel.replace(/\\/g, "/")}`);
    }
  }
  return files;
}

function resolveChain(chain, availableSet) {
  for (const candidate of chain) {
    if (availableSet.has(candidate)) {
      return { path: candidate, usedFallback: candidate !== chain[0] };
    }
  }
  return { path: chain[chain.length - 1], usedFallback: true, missing: true };
}

function buildTrailScrollVersionChain(regionSlug, theme, order) {
  return order.map((version) => `/ui/ui_trail_scroll_${regionSlug}_${theme}_${version}.webp`);
}

async function main() {
  const available = new Set(await walkWebpFiles(PUBLIC_DIR));
  const chainsConfig = JSON.parse(await readFile(CHAINS_PATH, "utf8"));
  const { chains, trailScrollRegionSlugs, trailScrollVersionOrder } = chainsConfig;

  const resolved = {};
  const fallbacksUsed = [];
  const missing = [];

  for (const [key, chain] of Object.entries(chains)) {
    const result = resolveChain(chain, available);
    resolved[key] = result.path;
    if (result.usedFallback) {
      fallbacksUsed.push(`${key}: ${chain[0]} → ${result.path}`);
    }
    if (result.missing) {
      missing.push(`${key}: no chain member in public/ (using ${result.path})`);
    }
  }

  const trailScrollResolved = {};
  for (const slug of trailScrollRegionSlugs) {
    for (const theme of ["dark", "light"]) {
      const key = `trailScroll.${slug}.${theme}`;
      const chain = buildTrailScrollVersionChain(slug, theme, trailScrollVersionOrder);
      const result = resolveChain(chain, available);
      trailScrollResolved[key] = result.path;
      if (result.usedFallback) {
        fallbacksUsed.push(`${key}: ${chain[0]} → ${result.path}`);
      }
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    availableCount: available.size,
    resolved,
    trailScrollResolved,
    fallbacksUsed,
    missing,
  };

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Asset version manifest synced (${available.size} WebP in public/)`);
  console.log(`  Resolved keys: ${Object.keys(resolved).length}`);
  console.log(`  Trail scroll keys: ${Object.keys(trailScrollResolved).length}`);
  if (fallbacksUsed.length > 0) {
    console.log(`  Fallbacks (${fallbacksUsed.length}):`);
    for (const line of fallbacksUsed.slice(0, 12)) {
      console.log(`    - ${line}`);
    }
    if (fallbacksUsed.length > 12) {
      console.log(`    … and ${fallbacksUsed.length - 12} more`);
    }
  }
  if (missing.length > 0) {
    console.warn(`  Missing (${missing.length}):`);
    for (const line of missing) {
      console.warn(`    - ${line}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
