import type { ElevationSummaryViewModel } from "@/features/elevation/types/elevation.types";
import type { ReviewStatsViewModel } from "@/features/review/types/review.types";

export type DomainMasteryViewModel = {
  domain: string;
  label: string;
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type UnitProgressSummaryViewModel = {
  id: string;
  name: string;
  lessonCount: number;
  completedCount: number;
  progressPercent: number;
};

export type RegionProgressSummaryViewModel = {
  id: string;
  slug: string;
  name: string;
  lessonCount: number;
  completedCount: number;
  progressPercent: number;
  units: UnitProgressSummaryViewModel[];
};

export type LearningStatsViewModel = {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonsInProgress: number;
  averageScore: number;
  readingCompleted: number;
  readingTotal: number;
  listeningCompleted: number;
  listeningTotal: number;
};

export type ProgressDashboardViewModel = {
  overallMasteryPercent: number;
  domains: DomainMasteryViewModel[];
  regions: RegionProgressSummaryViewModel[];
  learningStats: LearningStatsViewModel;
  reviewStats: ReviewStatsViewModel;
  elevation: ElevationSummaryViewModel;
  currentStreak: number;
};
