export const LESSON_PASS_SCORE_DEFAULT = 90;
export const LESSON_PASS_SCORE_PRACTICE = 90;
export const LESSON_PASS_SCORE_APPLICATION = 90;

export const LESSON_EMBEDDED_STEP_PASS_THRESHOLD = 60;

export const LESSON_MIXED_RECALL_MAX_ITEMS = 5;
export const LESSON_MIXED_RECALL_MIN_ITEMS = 2;

export function getLessonPassScore(lessonType: string): number {
  if (lessonType === "practice") return LESSON_PASS_SCORE_PRACTICE;
  if (lessonType === "application") return LESSON_PASS_SCORE_APPLICATION;
  return LESSON_PASS_SCORE_DEFAULT;
}

export function isLessonScorePassing(lessonType: string, score: number): boolean {
  return score >= getLessonPassScore(lessonType);
}

export function calculateLessonScore(recallCorrect: number, recallTotal: number): number {
  if (recallTotal === 0) return 100;
  return Math.round((recallCorrect / recallTotal) * 100);
}
