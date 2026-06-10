import fs from "node:fs";

const files = process.argv.slice(2);
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 90);

if (files.length === 0) {
  console.error("Usage: node scripts/check-lighthouse-scores.mjs <report.json...>");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const report = JSON.parse(fs.readFileSync(file, "utf8"));
  const categories = report.categories ?? {};
  const route = report.finalUrl ?? file;

  for (const category of ["performance", "accessibility", "best-practices"]) {
    const score = Math.round((categories[category]?.score ?? 0) * 100);
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
