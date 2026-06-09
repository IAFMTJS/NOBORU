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

export type ReviewSessionViewModel = {
  dueCount: number;
  stats: ReviewStatsViewModel;
  currentCard: ReviewCardViewModel | null;
  recentHistory: ReviewHistoryEntryViewModel[];
};

export type ReviewRating = "again" | "good" | "strong";

export const REVIEW_CONTENT_LABELS: Record<ReviewContentType, string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  vocabulary: "Vocabulary",
  kanji: "Kanji",
  grammar: "Grammar",
};
