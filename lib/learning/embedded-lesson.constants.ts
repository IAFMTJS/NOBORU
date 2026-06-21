/** Lesson types that use the full 4-phase spiral pipeline with teach cards. */
export const ARCHITECTURE_LESSON_TYPES = [
  "vocabulary",
  "grammar",
  "kanji",
  "hiragana",
  "katakana",
  "practice",
] as const;

export type ArchitectureLessonType = (typeof ARCHITECTURE_LESSON_TYPES)[number];

/**
 * Lesson types whose primary activity is an embedded player (story, listening, etc.).
 * These still run the 4-phase drill pipeline first, then the embedded capstone.
 */
export const EMBEDDED_LESSON_TYPES = [
  "reading",
  "story",
  "dialogue",
  "listening",
  "listening_challenge",
  "application",
] as const;

export type EmbeddedLessonType = (typeof EMBEDDED_LESSON_TYPES)[number];

export const ALL_STAGED_LESSON_TYPES = [
  ...ARCHITECTURE_LESSON_TYPES,
  ...EMBEDDED_LESSON_TYPES,
] as const;

export function isArchitectureLessonType(type: string): type is ArchitectureLessonType {
  return (ARCHITECTURE_LESSON_TYPES as readonly string[]).includes(type);
}

export function isEmbeddedLessonType(type: string): type is EmbeddedLessonType {
  return (EMBEDDED_LESSON_TYPES as readonly string[]).includes(type);
}

export function usesStagedLessonPipeline(type: string): boolean {
  return isArchitectureLessonType(type) || isEmbeddedLessonType(type);
}
