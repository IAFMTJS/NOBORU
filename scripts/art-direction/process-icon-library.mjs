#!/usr/bin/env node
/**
 * Full icon pipeline: strip backgrounds, derive dark variants, copy duplicates.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const folders = [
  "Art Library/icons",
  "Art Library/props",
  "Art Library/achievements",
];

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

for (const folder of folders) {
  console.log(`\n=== strip ${folder} ===`);
  run("node", ["scripts/art-direction/strip-icon-backgrounds.mjs", folder]);
}

console.log("\n=== derive dark variants ===");
run("node", ["scripts/art-direction/derive-dark-icons.mjs", ...folders]);

console.log("\n=== copy duplicate hub icons ===");
run("node", ["scripts/art-direction/copy-duplicate-icons.mjs"]);

console.log("\n=== strict transparency audit ===");
run("node", ["scripts/art-direction/audit-transparency.mjs"]);

console.log("\nDone.");
