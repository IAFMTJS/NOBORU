#!/usr/bin/env node
/**
 * Full kitsune companion pipeline: migrate rejected, sync new, strip, derive dark, audit.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const KITSUNE = resolve(ROOT, "Art Library/characters/kitsune");

function run(cmd, args, label) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("node", ["scripts/art-direction/migrate-kitsune-from-rejected.mjs"], "migrate rejected yama (skip if done)");
run("node", ["scripts/art-direction/sync-kitsune-generated.mjs"], "sync new generations");
run("node", ["scripts/art-direction/strip-icon-backgrounds.mjs", KITSUNE], "strip backgrounds (rembg)");
run("node", ["scripts/art-direction/derive-dark-icons.mjs", KITSUNE], "derive dark variants");
run("node", ["scripts/art-direction/audit-transparency.mjs", KITSUNE], "strict transparency audit");
console.log("\nKitsune companion library ready.");
