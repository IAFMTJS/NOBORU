#!/usr/bin/env node
/**
 * Capture full World Tree audit page as PNG (+ art-only JLPT band stack).
 *
 * Requires dev server: npm run dev
 *
 * Usage:
 *   node scripts/art-direction/export-world-tree-page-audit.mjs
 *   node scripts/art-direction/export-world-tree-page-audit.mjs --theme dark
 *   node scripts/art-direction/export-world-tree-page-audit.mjs --base-url http://127.0.0.1:3000
 */
import { mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = join(ROOT, "Art Library/world-tree/_previews");
const JLPT_DIR = join(ROOT, "Art Library/world-tree/jlpt-bands");
const VIEWPORT = { width: 430, height: 932 };

function parseArgs(argv) {
  const args = {
    theme: "light",
    baseUrl: "http://127.0.0.1:3000",
    artOnly: false,
    pageOnly: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--theme") args.theme = argv[++i] ?? "light";
    else if (argv[i] === "--base-url") args.baseUrl = argv[++i] ?? args.baseUrl;
    else if (argv[i] === "--art-only") args.artOnly = true;
    else if (argv[i] === "--page-only") args.pageOnly = true;
  }
  return args;
}

async function waitForServer(baseUrl, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(`${baseUrl}/tree-audit`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Dev server not reachable at ${baseUrl}/tree-audit. Run: npm run dev`);
}

async function compositeArtOnly(theme) {
  const bands = ["n5", "n4", "n3", "n2", "n1"];
  const bandHeight = 2048;
  const width = 1536;
  const totalHeight = bandHeight * bands.length;

  const layers = await Promise.all(
    bands.map(async (band, index) => {
      const path = join(JLPT_DIR, band, `wt_jlpt_${band}_${theme}_v1.png`);
      if (!existsSync(path)) {
        throw new Error(`Missing JLPT band art: ${path}`);
      }
      const resized = await sharp(path).resize(width, bandHeight, { fit: "contain" }).png().toBuffer();
      return { input: resized, top: index * bandHeight, left: 0 };
    }),
  );

  const outPath = join(OUT_DIR, `world-tree-jlpt-art-stack_${theme}_v1.png`);
  await sharp({
    create: {
      width,
      height: totalHeight,
      channels: 4,
      background: { r: 13, g: 19, b: 32, alpha: 1 },
    },
  })
    .composite(layers)
    .png()
    .toFile(outPath);

  return outPath;
}

async function capturePage(baseUrl, theme) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/tree-audit`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForSelector("[data-world-tree-export='true']", { timeout: 60_000 });
  await page.waitForSelector("[data-world-tree-jlpt-band-art]", { timeout: 60_000 });
  await page.waitForTimeout(2500);

  const outPath = join(OUT_DIR, `world-tree-page-audit_${theme}_v1.png`);
  await page.screenshot({ path: outPath, fullPage: true, animations: "disabled" });

  await browser.close();
  return outPath;
}

async function main() {
  const args = parseArgs(process.argv);
  mkdirSync(OUT_DIR, { recursive: true });

  if (!args.artOnly) {
    console.log(`Waiting for dev server at ${args.baseUrl}…`);
    await waitForServer(args.baseUrl);
  }

  if (!args.pageOnly) {
    console.log(`Compositing JLPT art stack (${args.theme})…`);
    const artPath = await compositeArtOnly(args.theme);
    console.log(`  → ${artPath}`);
  }

  if (!args.artOnly) {
    console.log(`Capturing /tree-audit full page (${args.theme})…`);
    const pagePath = await capturePage(args.baseUrl, args.theme);
    console.log(`  → ${pagePath}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
