export type StudyDifficulty = "easy" | "normal" | "hard";

export const DEFAULT_STUDY_DIFFICULTY: StudyDifficulty = "normal";

export type HintPolicyFields = {
  hintPolicy?: {
    showKanji: boolean;
    showFurigana: boolean;
    showRomaji: boolean;
    showTranslation: boolean;
    romajiOnDemand: boolean;
  };
};
