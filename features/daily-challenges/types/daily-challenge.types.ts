export type DailyChallengeItemViewModel = {
  vocabularyId: string;
  reviewItemId: string | null;
  priority: string;
  display: string;
  meaning: string;
};

export type DailyChallengeCompletionViewModel = {
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  completedAt: string;
};

export type DailyChallengeSessionViewModel = {
  goal: "retention";
  items: DailyChallengeItemViewModel[];
  totalCount: number;
  completedToday: number;
  challengeDate: string;
  todayCompletion: DailyChallengeCompletionViewModel | null;
};

export type DailyChallengeCompleteInput = {
  correctCount: number;
  totalCount: number;
  vocabularyIds: string[];
  correctVocabularyIds: string[];
  clientEventId?: string;
};

export type DailyChallengeCompleteViewModel = {
  alreadyApplied: boolean;
  completion: DailyChallengeCompletionViewModel;
};
