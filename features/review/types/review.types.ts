import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import type { ReviewState } from "@/features/review/repositories/review.repository";

export type ReviewContentType =
  | "hiragana"
  | "katakana"
  | "vocabulary"
  | "kanji"
  | "grammar";

export type ReviewCardViewModel = {
  id: string;
  contentType: ReviewContentType;
  term: string;
  reading: string;
  meaning: string;
  state: ReviewState;
  masteryScore: number;
  nextReviewLabel: string;
};

export type WeakAreaViewModel = {
  contentType: ReviewContentType;
  label: string;
  count: number;
};

export type ReviewStatsViewModel = {
  dueCount: number;
  learningCount: number;
  masteredCount: number;
  totalCount: number;
  weakAreas: WeakAreaViewModel[];
};

export type ReviewHistoryEntryViewModel = {
  id: string;
  contentType: ReviewContentType;
  term: string;
  rating: ReviewRating;
  state: ReviewState;
  reviewedAt: string;
};

export type ReviewSubmitDeltaViewModel = {
  dueCount: number;
  stats: ReviewStatsViewModel;
  currentCard: ReviewCardViewModel | null;
  recentHistoryEntry: ReviewHistoryEntryViewModel;
  elevation: ElevationAwardViewModel | null;
  achievements: AchievementUnlockViewModel[];
  quests: QuestCompletionViewModel[];
  clientEventId?: string;
  gamificationPending?: boolean;
  alreadyApplied?: boolean;
};

export type ReviewGamificationViewModel = {
  clientEventId: string;
  ready: boolean;
  elevation: ElevationAwardViewModel | null;
  achievements: AchievementUnlockViewModel[];
  quests: QuestCompletionViewModel[];
  stats: ReviewStatsViewModel | null;
};

export type ReviewSessionViewModel = {
  dueCount: number;
  stats: ReviewStatsViewModel;
  currentCard: ReviewCardViewModel | null;
  recentHistory: ReviewHistoryEntryViewModel[];
};

export type ReviewRating = "again" | "hard" | "good" | "easy" | "strong";

export type ReviewBatchSubmitItem = {
  reviewItemId: string;
  rating: ReviewRating;
  clientEventId: string;
};

export type ReviewBatchSubmitResult = {
  results: ReviewSubmitDeltaViewModel[];
  lastDelta: ReviewSubmitDeltaViewModel;
  gamificationJobs: ReviewBatchSubmitItem[];
};

export const REVIEW_CONTENT_LABELS: Record<ReviewContentType, string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  vocabulary: "Vocabulary",
  kanji: "Kanji",
  grammar: "Grammar",
};
