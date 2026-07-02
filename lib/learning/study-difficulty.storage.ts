import type { StudyDifficulty } from "@/lib/learning/hint-policy.types";

const STORAGE_KEY = "noboru.studyDifficulty";

export function getStudyDifficulty(): StudyDifficulty {
  if (typeof window === "undefined") return "normal";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "easy" || stored === "normal" || stored === "hard") {
    return stored;
  }
  return "normal";
}

export function setStudyDifficulty(value: StudyDifficulty): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, value);
}
