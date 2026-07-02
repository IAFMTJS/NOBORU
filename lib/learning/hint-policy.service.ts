import type { StudyDifficulty } from "@/lib/learning/hint-policy.types";
import type { DifficultyProfile } from "@/lib/learning/difficulty-scaling.service";

export type HintVisibility = {
  showKanji: boolean;
  showFurigana: boolean;
  showRomaji: boolean;
  showTranslation: boolean;
  romajiOnDemand: boolean;
};

export type HintPolicyInput = {
  studyDifficulty: StudyDifficulty;
  lifecycleProfile: DifficultyProfile;
};

const STUDY_DIFFICULTY_HINTS: Record<StudyDifficulty, HintVisibility> = {
  easy: {
    showKanji: true,
    showFurigana: true,
    showRomaji: true,
    showTranslation: true,
    romajiOnDemand: false,
  },
  normal: {
    showKanji: true,
    showFurigana: true,
    showRomaji: false,
    showTranslation: true,
    romajiOnDemand: true,
  },
  hard: {
    showKanji: true,
    showFurigana: false,
    showRomaji: false,
    showTranslation: false,
    romajiOnDemand: true,
  },
};

export function resolveHintPolicy(input: HintPolicyInput): HintVisibility {
  const base = STUDY_DIFFICULTY_HINTS[input.studyDifficulty];

  if (input.lifecycleProfile.furiganaSupport === "none") {
    return { ...base, showFurigana: false };
  }

  if (input.lifecycleProfile.furiganaSupport === "partial" && input.studyDifficulty !== "easy") {
    return { ...base, showFurigana: true };
  }

  if (input.lifecycleProfile.hintSupport === "minimal") {
    return {
      ...base,
      showRomaji: false,
      showTranslation: false,
      romajiOnDemand: true,
    };
  }

  if (input.lifecycleProfile.hintSupport === "reduced") {
    return {
      ...base,
      showRomaji: base.showRomaji && input.studyDifficulty === "easy",
      romajiOnDemand: true,
    };
  }

  return base;
}

export function shouldRevealRomaji(
  policy: HintVisibility,
  revealedByUser: boolean,
  afterAnswer: boolean,
): boolean {
  if (policy.showRomaji) return true;
  if (policy.romajiOnDemand && (revealedByUser || afterAnswer)) return true;
  return false;
}
