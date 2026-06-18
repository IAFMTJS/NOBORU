#!/usr/bin/env node
/**
 * Batch-ingest remastered PNGs from Cursor assets folder into Art Library.
 *
 * Usage:
 *   node scripts/art-direction/ingest-world-tree-remasters.mjs
 *   node scripts/art-direction/ingest-world-tree-remasters.mjs path/to/wt_*_v2.png
 */
import { readdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const INGEST = join(__dirname, "remaster-world-tree-sheet.mjs");
const DEFAULT_SOURCES = [
  join(ROOT, ".cursor/projects/d-NOBORU/assets"),
  join(process.env.USERPROFILE ?? "", ".cursor/projects/d-NOBORU/assets"),
];

async function ingestFile(path) {
  const id = basename(path).replace(/\.png$/i, "");
  if (!/_v2$/i.test(id)) {
    console.warn(`Skip (not v2): ${path}`);
    return false;
  }
  const result = spawnSync(
    process.execPath,
    [INGEST, "--ingest", path, "--id", id],
    { stdio: "inherit", cwd: ROOT },
  );
  return result.status === 0;
}

async function main() {
  const inputs = process.argv.slice(2);
  const files =
    inputs.length > 0
      ? inputs.map((p) => resolve(p))
      : DEFAULT_SOURCES.flatMap((source) =>
          existsSync(source)
            ? readdirSync(source)
                .filter((name) => /^wt_\d{2}_/.test(name) && name.endsWith("_v2.png"))
                .map((name) => join(source, name))
            : [],
        );

  if (files.length === 0) {
    console.log("No remaster PNGs found to ingest.");
    return;
  }

  let ok = 0;
  for (const file of files.sort()) {
    if (await ingestFile(file)) ok += 1;
  }
  console.log(`Ingested ${ok}/${files.length} remaster(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
