import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:3000/camp";
const outputPath = process.argv[3] ?? "./lighthouse-camp.json";
const storagePath = path.resolve("tests/lighthouse/authenticated.storage.json");

if (!fs.existsSync(storagePath)) {
  console.log("No authenticated lighthouse storage — skipping camp audit.");
  process.exit(0);
}

const browser = await chromium.launch({
  headless: true,
  args: ["--remote-debugging-port=9222", "--no-sandbox"],
});

const context = await browser.newContext({ storageState: storagePath });
const page = await context.newPage();
await page.goto(targetUrl, { waitUntil: "networkidle" });

execSync(
  [
    "npx lighthouse",
    targetUrl,
    "--port=9222",
    "--only-categories=performance,accessibility,best-practices,pwa",
    '--chrome-flags="--headless --no-sandbox"',
    "--output=json",
    `--output-path=${outputPath}`,
    "--quiet",
  ].join(" "),
  { stdio: "inherit" },
);

await browser.close();
console.log(`Wrote authenticated lighthouse report to ${outputPath}`);
