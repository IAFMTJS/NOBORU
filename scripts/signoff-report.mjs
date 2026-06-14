#!/usr/bin/env node
/**
 * Sign-off status report — screenshot presence + DoD checklist from signoff-results.json.
 *
 * Usage: npm run qa:signoff:report
 */
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SIGNOFF_DIR = path.join(ROOT, "assets", "_staging", "signoff");
const ROUTES_PATH = path.join(SIGNOFF_DIR, "signoff-routes.json");
const RESULTS_PATH = path.join(SIGNOFF_DIR, "signoff-results.json");
const REPORT_PATH = path.join(SIGNOFF_DIR, "signoff-report.md");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function scoreRoute(route, results, hasScreenshot, hasComposite) {
  const entry = results.routes?.[route.slug];
  if (!entry?.criteria) return { pass: 0, total: 7, status: "pending" };

  const values = Object.values(entry.criteria);
  const pass = values.filter((v) => v === true || v === "pass").length;
  const total = 7;
  const status = pass === total ? "pass" : pass === 0 ? "pending" : "partial";
  return { pass, total, status, notes: entry.notes ?? "" };
}

async function main() {
  const config = await loadJson(ROUTES_PATH);
  let results = { routes: {} };
  if (await exists(RESULTS_PATH)) {
    results = await loadJson(RESULTS_PATH);
  }

  const lines = [
    "# Sign-Off Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
  ];

  const rows = [];
  let screenshotsPresent = 0;
  let routesPassed = 0;

  for (const route of config.routes) {
    const screenshotPath = path.join(SIGNOFF_DIR, `${route.slug}.png`);
    const compositePath = path.join(SIGNOFF_DIR, "composites", `${route.slug}_compare.png`);
    const hasScreenshot = await exists(screenshotPath);
    const hasComposite = await exists(compositePath);
    if (hasScreenshot) screenshotsPresent += 1;

    const score = scoreRoute(route, results, hasScreenshot, hasComposite);
    if (score.status === "pass") routesPassed += 1;

    rows.push({
      route,
      hasScreenshot,
      hasComposite,
      score,
    });
  }

  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Tier A routes configured | ${config.routes.length} |`);
  lines.push(`| Live screenshots present | ${screenshotsPresent}/${config.routes.length} |`);
  lines.push(`| Routes 7/7 DoD pass | ${routesPassed}/${config.routes.length} |`);
  lines.push("");
  lines.push("## DoD criteria");
  lines.push("");
  for (const c of config.dodCriteria) {
    lines.push(`- ${c.label}`);
  }
  lines.push("");
  lines.push("## Route status");
  lines.push("");
  lines.push(
    "| Priority | Route | Screenshot | Composite | DoD | Mockup panel |",
  );
  lines.push("|----------|-------|------------|-----------|-----|--------------|");

  for (const { route, hasScreenshot, hasComposite, score } of rows.sort(
    (a, b) => a.route.priority - b.route.priority,
  )) {
    const dodLabel =
      score.status === "pass"
        ? `**${score.pass}/${score.total} pass**`
        : score.status === "partial"
          ? `${score.pass}/${score.total} partial`
          : "pending AD";
    lines.push(
      `| ${route.priority} | \`${route.slug}\` | ${hasScreenshot ? "yes" : "**missing**"} | ${hasComposite ? "yes" : "—"} | ${dodLabel} | ${route.mockupPanel} |`,
    );
  }

  lines.push("");
  lines.push("## Per-route DoD detail");
  lines.push("");

  for (const { route, score } of rows) {
    lines.push(`### ${route.slug} (\`${route.path}\`)`);
    lines.push("");
    const entry = results.routes?.[route.slug];
    if (!entry?.criteria) {
      lines.push("_No AD results yet — copy `signoff-results.template.json` to `signoff-results.json` and fill criteria._");
      lines.push("");
      continue;
    }
    for (const c of config.dodCriteria) {
      const val = entry.criteria[c.id];
      const mark = val === true || val === "pass" ? "pass" : val === false || val === "fail" ? "**fail**" : "—";
      lines.push(`- [${val === true || val === "pass" ? "x" : " "}] ${c.label} — ${mark}`);
    }
    if (entry.notes) {
      lines.push("");
      lines.push(`Notes: ${entry.notes}`);
    }
    lines.push("");
  }

  lines.push("## Next steps");
  lines.push("");
  if (screenshotsPresent < config.routes.length) {
    lines.push("1. Capture missing screenshots at 390×844 → `assets/_staging/signoff/{slug}.png`");
  }
  lines.push("1. Run `npm run qa:signoff:composite` for side-by-side panels");
  lines.push("1. AD fills `signoff-results.json` after reviewing composites");
  lines.push("1. Re-run `npm run qa:signoff:report` and update `docs/visual-acceptance-checklist.md`");
  lines.push("");

  const report = lines.join("\n");
  await writeFile(REPORT_PATH, report);
  console.log(report);
  console.log(`\nWrote ${path.relative(ROOT, REPORT_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
