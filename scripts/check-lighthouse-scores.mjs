import fs from "node:fs";

const files = process.argv.slice(2);
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 90);

if (files.length === 0) {
  console.error("Usage: node scripts/check-lighthouse-scores.mjs <report.json...>");
  process.exit(1);
}

const CATEGORY_AUDIT_IDS = {
  performance: "performance",
  accessibility: "accessibility",
  "best-practices": "best-practices",
  pwa: "pwa",
};

function resolveCategoryScore(report, category) {
  const direct = report.categories?.[category]?.score;
  if (typeof direct === "number") {
    return Math.round(direct * 100);
  }

  const auditId = CATEGORY_AUDIT_IDS[category];
  const auditScore = report.audits?.[auditId]?.score;
  if (typeof auditScore === "number") {
    return Math.round(auditScore * 100);
  }

  return null;
}

let failed = false;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn(`${file} · skipped (missing)`);
    continue;
  }

  const report = JSON.parse(fs.readFileSync(file, "utf8"));
  const route = report.finalUrl ?? file;

  for (const category of ["performance", "accessibility", "best-practices", "pwa"]) {
    const score = resolveCategoryScore(report, category);
    if (score === null) {
      console.warn(`${file} · ${category}: unavailable in report`);
      continue;
    }

    console.log(`${file} · ${category}: ${score}`);

    if (score < minimumScore) {
      console.error(
        `${route} ${category} score ${score} is below minimum ${minimumScore}`,
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}
