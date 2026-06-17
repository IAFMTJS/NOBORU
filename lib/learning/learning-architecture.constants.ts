import type { JlptLevel } from "@/lib/content/types";

/**
 * Authoritative constants from docs/NOBORU LEARNING ARCHITECTURE BIBLE.md (v1.0).
 * Cross-feature learning orchestration must import from here — never duplicate.
 */

export const LEARNING_ARCHITECTURE_VERSION = "1.0" as const;

export const LEARNING_FLOW_STAGES = [
  "discover",
  "practice",
  "reinforce",
  "apply",
  "test",
  "master",
  "review_forever",
] as const;

export type LearningFlowStage = (typeof LEARNING_FLOW_STAGES)[number];

export const VOCABULARY_LIFECYCLE_STAGES = [
  "unknown",
  "discovered",
  "recognized",
  "applied",
  "reinforced",
  "mastered",
  "maintained",
] as const;

export type VocabularyLifecycleStage = (typeof VOCABULARY_LIFECYCLE_STAGES)[number];

export const WORLD_TREE_NODE_TYPES = [
  "jlpt_level",
  "branch",
  "mini_chapter",
  "checkpoint",
  "boss_examination",
] as const;

export type WorldTreeNodeType = (typeof WORLD_TREE_NODE_TYPES)[number];

/** New vocabulary introduced per mini chapter by JLPT level. */
export const VOCAB_INTRO_LIMITS_BY_JLPT: Readonly<Record<JlptLevel, number>> = {
  n5: 6,
  n4: 8,
  n3: 10,
  n2: 12,
  n1: 15,
};

/** Review vs new content ratio for every learning session. */
export const REVIEW_CONTENT_RATIO = 0.7;
export const NEW_CONTENT_RATIO = 0.3;

/** Checkpoint cadence after mini chapters. */
export const CHECKPOINT_MINI_CHAPTERS_MIN = 4;
export const CHECKPOINT_MINI_CHAPTERS_MAX = 5;

/** SRS review intervals — bible-aligned (includes 60-day step). */
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30, 60, 90, 180, 365] as const;

export type ReviewIntervalDays = (typeof REVIEW_INTERVAL_DAYS)[number];

/** Per-word mastery requirements from the bible. */
export const MASTERY_MIN_CORRECT_ANSWERS = 15;
export const MASTERY_MIN_EXERCISE_TYPES = 2;
export const MASTERY_MIN_SESSIONS = 2;
export const MASTERY_MIN_DISTINCT_DAYS = 2;

/**
 * Maps current CMS entities to bible World Tree concepts.
 * `learning_branches.unit_id` aliases units; `lessons` remain mini chapters.
 */
export const WORLD_TREE_CMS_ALIASES = {
  jlptLevel: "region",
  branch: "unit",
  miniChapter: "lesson",
  checkpoint: "practice_lesson",
  bossExamination: "trial",
} as const;

export function getVocabIntroLimit(jlptLevel: JlptLevel): number {
  return VOCAB_INTRO_LIMITS_BY_JLPT[jlptLevel];
}

export function isWithinVocabIntroLimit(
  jlptLevel: JlptLevel,
  newWordCount: number,
): boolean {
  return newWordCount <= VOCAB_INTRO_LIMITS_BY_JLPT[jlptLevel];
}
