import type { VocabularyLifecycleStage } from "@/lib/learning/learning-architecture.constants";

export type DifficultyProfile = {
  lifecycleStage: VocabularyLifecycleStage;
  maxSentenceLength: number;
  furiganaSupport: "full" | "partial" | "none";
  hintSupport: "full" | "reduced" | "minimal";
  choiceCount: number;
  recognitionTimePressure: "none" | "soft" | "firm";
};

const STAGE_PROFILES: Record<VocabularyLifecycleStage, DifficultyProfile> = {
  unknown: {
    lifecycleStage: "unknown",
    maxSentenceLength: 8,
    furiganaSupport: "full",
    hintSupport: "full",
    choiceCount: 4,
    recognitionTimePressure: "none",
  },
  discovered: {
    lifecycleStage: "discovered",
    maxSentenceLength: 10,
    furiganaSupport: "full",
    hintSupport: "full",
    choiceCount: 4,
    recognitionTimePressure: "none",
  },
  recognized: {
    lifecycleStage: "recognized",
    maxSentenceLength: 12,
    furiganaSupport: "partial",
    hintSupport: "full",
    choiceCount: 4,
    recognitionTimePressure: "soft",
  },
  applied: {
    lifecycleStage: "applied",
    maxSentenceLength: 16,
    furiganaSupport: "partial",
    hintSupport: "reduced",
    choiceCount: 3,
    recognitionTimePressure: "soft",
  },
  reinforced: {
    lifecycleStage: "reinforced",
    maxSentenceLength: 20,
    furiganaSupport: "partial",
    hintSupport: "reduced",
    choiceCount: 3,
    recognitionTimePressure: "firm",
  },
  mastered: {
    lifecycleStage: "mastered",
    maxSentenceLength: 24,
    furiganaSupport: "none",
    hintSupport: "minimal",
    choiceCount: 2,
    recognitionTimePressure: "firm",
  },
  maintained: {
    lifecycleStage: "maintained",
    maxSentenceLength: 28,
    furiganaSupport: "none",
    hintSupport: "minimal",
    choiceCount: 2,
    recognitionTimePressure: "firm",
  },
};

export function resolveDifficultyProfile(
  lifecycleStage: VocabularyLifecycleStage,
): DifficultyProfile {
  return STAGE_PROFILES[lifecycleStage];
}

export function clampSentenceToProfile(
  sentence: string,
  profile: DifficultyProfile,
): string {
  if (sentence.length <= profile.maxSentenceLength) return sentence;
  return `${sentence.slice(0, profile.maxSentenceLength)}…`;
}
