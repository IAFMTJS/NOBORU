import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const email = process.env.LIGHTHOUSE_TEST_EMAIL;
const password = process.env.LIGHTHOUSE_TEST_PASSWORD;
const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? "http://127.0.0.1:3000";
const storagePath = path.resolve("tests/lighthouse/authenticated.storage.json");

if (!email || !password) {
  console.log(
    "Skipping authenticated lighthouse storage (LIGHTHOUSE_TEST_EMAIL/PASSWORD not set).",
  );
  process.exit(0);
}

fs.mkdirSync(path.dirname(storagePath), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.getByLabel("Email").fill(email);
await page.getByLabel("Password").fill(password);
await page.getByRole("button", { name: "Sign In" }).click();
await page.waitForURL((current) => /\/(camp|tree|home)$/.test(current.pathname), {
  timeout: 60_000,
});

await context.storageState({ path: storagePath });
await browser.close();

console.log(`Saved lighthouse auth storage to ${storagePath}`);
