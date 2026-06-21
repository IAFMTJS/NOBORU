import type { LessonStage } from "@/lib/learning/lesson-stage.constants";

/**
 * Four-phase Duolingo-style learning loop.
 * Maps granular runtime stages into learner-visible phases.
 */
export const LESSON_PHASES = [
  "introduction",
  "recognition",
  "active_recall",
  "context_mastery",
] as const;

export type LessonPhase = (typeof LESSON_PHASES)[number];

export const PHASE_LABELS: Readonly<Record<LessonPhase, string>> = {
  introduction: "Introduction",
  recognition: "Recognition",
  active_recall: "Active Recall",
  context_mastery: "Context & Mastery",
};

/** Minimum exposures per new concept within a single lesson (spiral repetition). */
export const SPIRAL_MIN_EXPOSURES_PER_CONCEPT = 4;

/** Maximum exposures per new concept within a single lesson. */
export const SPIRAL_MAX_EXPOSURES_PER_CONCEPT = 6;

/** Stages where hints and choice scaffolding are disabled. */
export const NO_HINT_STAGES = new Set<LessonStage>([
  "active_recall",
  "mastery_challenge",
]);

export const STAGE_TO_PHASE: Readonly<Record<LessonStage, LessonPhase>> = {
  introduction: "introduction",
  recognition: "introduction",
  guided_practice: "recognition",
  active_recall: "active_recall",
  listening: "recognition",
  context_application: "context_mastery",
  review_injection: "context_mastery",
  mastery_challenge: "context_mastery",
};

export function resolvePhaseFromStage(stage?: LessonStage): LessonPhase | null {
  if (!stage) return null;
  return STAGE_TO_PHASE[stage] ?? null;
}

export function shouldDisableDrillHints(stage?: LessonStage): boolean {
  if (!stage) return false;
  return NO_HINT_STAGES.has(stage);
}
