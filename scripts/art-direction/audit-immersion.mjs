#!/usr/bin/env node
/**
 * Doc 09 — flags forbidden immersion patterns in learner-facing code.
 * Excludes admin routes and shared layout primitives.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const SCAN_ROOTS = [join(root, "app/(app)"), join(root, "features")];

const SKIP_PATH_PARTS = ["features/admin", "components/layout", "components/ui"];

const FORBIDDEN = [
  {
    id: "screen-header",
    pattern: /@\/components\/layout\/screen-header/,
    message: "ScreenHeader — use IllustratedScreen / StudyHubLayout",
  },
  {
    id: "page-container",
    pattern: /@\/components\/layout\/page-container/,
    message: "PageContainer — use ContentHubScreen / IllustratedScreen",
  },
  {
    id: "shadcn-card",
    pattern: /@\/components\/ui\/card/,
    message: "ShadCN Card dashboard shell — use GlassPanel / world layout",
  },
  {
    id: "list-row",
    pattern: /from ["']@\/components\/ui\/list-row["']/,
    message: "ListRow menu pattern — use StudyShelfRow / GlassPanel world rows",
  },
  {
    id: "bg-card-utility",
    pattern: /\bbg-card\b/,
    message: "bg-card dashboard shell — use bg-black/40 or GlassPanel",
  },
];

function shouldSkipPath(absPath) {
  const rel = relative(root, absPath).replace(/\\/g, "/");
  return SKIP_PATH_PARTS.some((part) => rel.includes(part));
}

function walk(dir, files = []) {
  if (shouldSkipPath(dir)) return files;

  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (shouldSkipPath(abs)) continue;

    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "tests") continue;
      walk(abs, files);
    } else if (abs.endsWith(".tsx") || abs.endsWith(".ts")) {
      files.push(abs);
    }
  }
  return files;
}

const violations = [];

for (const scanRoot of SCAN_ROOTS) {
  try {
    statSync(scanRoot);
  } catch {
    continue;
  }
  for (const file of walk(scanRoot)) {
    const content = readFileSync(file, "utf8");
    const rel = relative(root, file).replace(/\\/g, "/");
    for (const rule of FORBIDDEN) {
      if (rule.pattern.test(content)) {
        violations.push({ file: rel, rule: rule.id, message: rule.message });
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Immersion audit violations:");
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file} — ${v.message}`);
  }
  process.exit(1);
}

console.log("OK: immersion audit passed (learner routes).");
