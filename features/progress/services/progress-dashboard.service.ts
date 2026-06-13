import { elevationRepository } from "@/features/elevation/repositories/elevation.repository";
import {
  getCachedElevationSummary,
  getCachedReviewStats,
} from "@/lib/cache/dashboard-cache";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { grammarProgressService } from "@/features/grammar/services/grammar-progress.service";
import { hiraganaProgressService } from "@/features/hiragana/services/hiragana-progress.service";
import { katakanaProgressService } from "@/features/katakana/services/katakana-progress.service";
import { kanjiProgressService } from "@/features/kanji/services/kanji-progress.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import {
  learningPathRepository,
  progressRepository,
} from "@/features/learning/repositories/learning-path.repository";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";
import type {
  DomainMasteryViewModel,
  LearningStatsViewModel,
  ProgressDashboardViewModel,
  RegionProgressSummaryViewModel,
} from "@/features/progress/types/progress-dashboard.types";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import type { UserProgressRow } from "@/features/learning/types/progress.types";
import { vocabularyProgressService } from "@/features/vocabulary/services/vocabulary-progress.service";

function buildDomain(
  domain: string,
  label: string,
  learnedCount: number,
  totalCount: number,
): DomainMasteryViewModel {
  return {
    domain,
    label,
    learnedCount,
    totalCount,
    progressPercent:
      totalCount === 0 ? 0 : Math.round((learnedCount / totalCount) * 100),
  };
}

function averageDomainMastery(domains: DomainMasteryViewModel[]): number {
  const active = domains.filter((domain) => domain.totalCount > 0);
  if (active.length === 0) return 0;
  const sum = active.reduce((total, domain) => total + domain.progressPercent, 0);
  return Math.round(sum / active.length);
}

type DashboardPreload = {
  learningPath?: LearningPathViewModel;
  progressRows?: UserProgressRow[];
};

class ProgressDashboardService {
  async getOverallMasteryPercent(userId: string): Promise<number> {
    const [
      hiragana,
      katakana,
      vocabulary,
      grammar,
      kanji,
      reading,
      listening,
    ] = await Promise.all([
      hiraganaProgressService.getChart(userId),
      katakanaProgressService.getChart(userId),
      vocabularyProgressService.getN5List(userId),
      grammarProgressService.getN5List(userId),
      kanjiProgressService.getN5List(userId),
      readingProgressService.getHub(userId),
      listeningProgressService.getHub(userId),
    ]);

    const domains: DomainMasteryViewModel[] = [
      buildDomain("hiragana", "Hiragana", hiragana.learnedCount, hiragana.totalCount),
      buildDomain("katakana", "Katakana", katakana.learnedCount, katakana.totalCount),
      buildDomain(
        "vocabulary",
        "Vocabulary",
        vocabulary.learnedCount,
        vocabulary.totalCount,
      ),
      buildDomain("grammar", "Grammar", grammar.learnedCount, grammar.totalCount),
      buildDomain("kanji", "Kanji", kanji.learnedCount, kanji.totalCount),
      buildDomain("reading", "Reading", reading.completedCount, reading.totalCount),
      buildDomain(
        "listening",
        "Listening",
        listening.completedCount,
        listening.totalCount,
      ),
    ];

    return averageDomainMastery(domains);
  }

  async getDashboard(
    userId: string,
    preload?: DashboardPreload,
  ): Promise<ProgressDashboardViewModel> {
    const needsProgressRows = !preload?.progressRows;
    const needsLearningPath = !preload?.learningPath;

    const [
      hiragana,
      katakana,
      vocabulary,
      grammar,
      kanji,
      reading,
      listening,
      learningPath,
      progressRows,
      reviewStats,
      elevation,
    ] = await Promise.all([
      hiraganaProgressService.getChart(userId),
      katakanaProgressService.getChart(userId),
      vocabularyProgressService.getN5List(userId),
      grammarProgressService.getN5List(userId),
      kanjiProgressService.getN5List(userId),
      readingProgressService.getHub(userId),
      listeningProgressService.getHub(userId),
      needsLearningPath
        ? learningPathService.getLearningPath(userId)
        : Promise.resolve(preload!.learningPath!),
      needsProgressRows
        ? getCachedProgressRows(userId)
        : Promise.resolve(preload!.progressRows!),
      getCachedReviewStats(userId),
      getCachedElevationSummary(userId),
    ]);

    const domains: DomainMasteryViewModel[] = [
      buildDomain("hiragana", "Hiragana", hiragana.learnedCount, hiragana.totalCount),
      buildDomain("katakana", "Katakana", katakana.learnedCount, katakana.totalCount),
      buildDomain(
        "vocabulary",
        "Vocabulary",
        vocabulary.learnedCount,
        vocabulary.totalCount,
      ),
      buildDomain("grammar", "Grammar", grammar.learnedCount, grammar.totalCount),
      buildDomain("kanji", "Kanji", kanji.learnedCount, kanji.totalCount),
      buildDomain("reading", "Reading", reading.completedCount, reading.totalCount),
      buildDomain(
        "listening",
        "Listening",
        listening.completedCount,
        listening.totalCount,
      ),
    ];

    const regions: RegionProgressSummaryViewModel[] = learningPath.regions.map(
      (region) => ({
        id: region.id,
        slug: region.slug,
        name: region.name,
        lessonCount: region.lessonCount,
        completedCount: region.completedCount,
        progressPercent: region.progressPercent,
        units: region.units.map((unit) => ({
          id: unit.id,
          name: unit.name,
          lessonCount: unit.lessonCount,
          completedCount: unit.completedCount,
          progressPercent:
            unit.lessonCount === 0
              ? 0
              : Math.round((unit.completedCount / unit.lessonCount) * 100),
        })),
      }),
    );

    const completedLessons = progressRows.filter((row) => row.status === "completed");
    const inProgressLessons = progressRows.filter(
      (row) => row.status === "in_progress",
    );
    const lessonsTotal = learningPath.regions.reduce(
      (total, region) => total + region.lessonCount,
      0,
    );
    const averageScore =
      completedLessons.length === 0
        ? 0
        : Math.round(
            completedLessons.reduce((sum, row) => sum + row.score, 0) /
              completedLessons.length,
          );

    const learningStats: LearningStatsViewModel = {
      lessonsCompleted: completedLessons.length,
      lessonsTotal,
      lessonsInProgress: inProgressLessons.length,
      averageScore,
      readingCompleted: reading.completedCount,
      readingTotal: reading.totalCount,
      listeningCompleted: listening.completedCount,
      listeningTotal: listening.totalCount,
    };

    return {
      overallMasteryPercent: averageDomainMastery(domains),
      domains,
      regions,
      learningStats,
      reviewStats,
      elevation,
    };
  }

  async getProfileSummaryStats(userId: string): Promise<
    Array<{ label: string; value: string }>
  > {
    const [elevation, progressRows, lessonsTotal] = await Promise.all([
      elevationRepository.ensureElevation(userId),
      getCachedProgressRows(userId),
      learningPathRepository.countPublishedLessons(),
    ]);

    const lessonsCompleted = progressRows.filter(
      (row) => row.status === "completed",
    ).length;

    return [
      {
        label: "Level",
        value: String(elevation.current_level),
      },
      {
        label: "Lessons",
        value: `${lessonsCompleted}/${lessonsTotal}`,
      },
      {
        label: "EP",
        value: elevation.total_ep.toLocaleString(),
      },
    ];
  }
}

export const progressDashboardService = new ProgressDashboardService();

export type { DashboardPreload };
