import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? "http://127.0.0.1:3000";
const secretLessonId = process.env.LIGHTHOUSE_LESSON_ID?.trim();
const storagePath = path.resolve("tests/lighthouse/authenticated.storage.json");
const outputPath = path.resolve("tests/lighthouse/lesson-id.txt");

function resolveLessonIdFromLearningPath(data) {
  if (data?.nextLesson?.id) {
    return data.nextLesson.id;
  }

  for (const region of data?.regions ?? []) {
    for (const unit of region.units ?? []) {
      for (const lesson of unit.lessons ?? []) {
        if (lesson.contentStatus === "published" || lesson.status === "published") {
          return lesson.id;
        }
      }
    }
  }

  return null;
}

async function resolveLessonIdFromApi() {
  if (!fs.existsSync(storagePath)) {
    console.log("No authenticated lighthouse storage — skipping lesson id resolve.");
    return null;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: storagePath });
  const response = await context.request.get(`${baseUrl}/api/learning/regions`);
  await browser.close();

  if (!response.ok()) {
    console.warn(`Learning path API returned ${response.status()} — cannot resolve lesson id.`);
    return null;
  }

  const payload = await response.json();
  if (!payload?.success || !payload.data) {
    console.warn("Learning path API response missing data — cannot resolve lesson id.");
    return null;
  }

  return resolveLessonIdFromLearningPath(payload.data);
}

const lessonId = secretLessonId || (await resolveLessonIdFromApi());

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

if (!lessonId) {
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }
  console.log("No lighthouse lesson id available — lesson route audit skipped.");
  process.exit(0);
}

fs.writeFileSync(outputPath, lessonId, "utf8");
console.log(`Resolved lighthouse lesson id: ${lessonId}`);
