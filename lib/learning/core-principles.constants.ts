/**
 * Six core principles from docs/NOBORU LEARNING ARCHITECTURE BIBLE.md
 */
export const LEARNING_CORE_PRINCIPLES = [
  "small_chunks",
  "constant_reinforcement",
  "contextual_learning",
  "progressive_difficulty",
  "long_term_retention",
  "meaningful_application",
] as const;

export type LearningCorePrinciple = (typeof LEARNING_CORE_PRINCIPLES)[number];

export const RETENTION_DESIGN_QUESTION =
  "Does this help the player remember and use Japanese six months from now?" as const;
