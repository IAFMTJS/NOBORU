/**
 * Staged lesson pipeline — a node is a full learning session, not a single exercise.
 * See lesson-stage-assembly.service.ts for runtime assembly.
 */

export const LESSON_STAGES = [
  "introduction",
  "recognition",
  "guided_practice",
  "active_recall",
  "listening",
  "context_application",
  "review_injection",
  "mastery_challenge",
] as const;

export type LessonStage = (typeof LESSON_STAGES)[number];

/** Scored drill stages (introduction uses teach steps — not scored). */
export type ScoredLessonStage = Exclude<LessonStage, "introduction">;

export const LESSON_MIN_SCORED_EXERCISES = 8;
export const LESSON_MAX_SCORED_EXERCISES = 15;

/** Universal first-completion threshold for mini-chapter lessons. */
export const LESSON_PASS_SCORE_UNIVERSAL = 90;

/** Review content should occupy 20–30% of scored exercises. */
export const LESSON_REVIEW_RATIO_MIN = 0.2;
export const LESSON_REVIEW_RATIO_MAX = 0.3;

/** Never show the same exercise kind more than this many times in a row. */
export const LESSON_MAX_CONSECUTIVE_SAME_KIND = 2;

/** Target lesson duration hint for CMS (minutes). */
export const LESSON_TARGET_DURATION_MIN = 3;
export const LESSON_TARGET_DURATION_MAX = 6;

/** Stage exercise count ranges for a single-concept lesson. */
export const STAGE_EXERCISE_RANGES: Readonly<
  Record<ScoredLessonStage, { min: number; max: number }>
> = {
  recognition: { min: 2, max: 3 },
  guided_practice: { min: 2, max: 3 },
  active_recall: { min: 1, max: 3 },
  listening: { min: 1, max: 2 },
  context_application: { min: 2, max: 3 },
  review_injection: { min: 2, max: 4 },
  mastery_challenge: { min: 1, max: 1 },
};

export const STAGE_LABELS: Readonly<Record<LessonStage, string>> = {
  introduction: "Introduction",
  recognition: "Recognition",
  guided_practice: "Guided Practice",
  active_recall: "Active Recall",
  listening: "Listening",
  context_application: "Context",
  review_injection: "Review",
  mastery_challenge: "Mastery Check",
};
