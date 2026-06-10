import { grammarRepository } from "@/features/grammar/repositories/grammar.repository";
import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import {
  reviewRepository,
  type ReviewItemRow,
} from "@/features/review/repositories/review.repository";
import { elevationService } from "@/features/elevation/services/elevation.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import {
  formatNextReviewLabel,
  formatReviewStateLabel,
} from "@/features/review/services/srs.service";
import type {
  ReviewCardViewModel,
  ReviewContentType,
  ReviewHistoryEntryViewModel,
  ReviewRating,
  ReviewSessionViewModel,
  ReviewStatsViewModel,
  WeakAreaViewModel,
} from "@/features/review/types/review.types";
import { REVIEW_CONTENT_LABELS } from "@/features/review/types/review.types";

class ReviewEnqueueService {
  async enqueueFromLesson(userId: string, lessonId: string): Promise<void> {
    const items = await learningPathRepository.listLessonItems(lessonId);

    for (const item of items) {
      if (
        item.content_type === "hiragana" ||
        item.content_type === "katakana" ||
        item.content_type === "vocabulary" ||
        item.content_type === "grammar" ||
        item.content_type === "kanji"
      ) {
        await reviewRepository.upsertReviewItem(
          userId,
          item.content_type,
          item.content_id,
        );
      }
    }
  }
}

class ReviewServerService {
  async getSession(userId: string): Promise<ReviewSessionViewModel> {
    const [dueCount, dueItems, stats, recentHistoryRows] = await Promise.all([
      reviewRepository.countDue(userId),
      reviewRepository.listDue(userId, 1),
      this.getStats(userId),
      reviewRepository.listRecentHistory(userId, 5),
    ]);

    const current = dueItems[0];
    const currentCard = current
      ? await this.buildCard(current)
      : null;
    const recentHistory = await Promise.all(
      recentHistoryRows.map((entry) => this.buildHistoryEntry(entry)),
    );

    return {
      dueCount,
      stats,
      currentCard,
      recentHistory,
    };
  }

  async getStats(userId: string): Promise<ReviewStatsViewModel> {
    const [dueCount, rows] = await Promise.all([
      reviewRepository.countDue(userId),
      reviewRepository.listSummary(userId),
    ]);

    const weakAreaCounts = new Map<ReviewContentType, number>();
    let learningCount = 0;
    let masteredCount = 0;

    for (const row of rows) {
      const contentType = row.content_type as ReviewContentType;
      const isWeak =
        row.state === "learning" ||
        row.state === "new" ||
        row.mastery_score < 60;

      if (row.state === "learning" || row.state === "new") {
        learningCount += 1;
      }

      if (row.state === "mastered" || row.state === "legendary") {
        masteredCount += 1;
      }

      if (isWeak && contentType in REVIEW_CONTENT_LABELS) {
        weakAreaCounts.set(
          contentType,
          (weakAreaCounts.get(contentType) ?? 0) + 1,
        );
      }
    }

    const weakAreas: WeakAreaViewModel[] = Array.from(weakAreaCounts.entries())
      .map(([contentType, count]) => ({
        contentType,
        label: REVIEW_CONTENT_LABELS[contentType],
        count,
      }))
      .sort((left, right) => right.count - left.count);

    return {
      dueCount,
      learningCount,
      masteredCount,
      totalCount: rows.length,
      weakAreas,
    };
  }

  async submitReview(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
  ): Promise<ReviewSessionViewModel & { elevation: ElevationAwardViewModel | null }> {
    await reviewRepository.submitRating(userId, reviewItemId, rating);
    const [session, elevation] = await Promise.all([
      this.getSession(userId),
      elevationService.awardReviewRating(userId, reviewItemId, rating),
    ]);
    return { ...session, elevation };
  }

  private async buildCard(item: ReviewItemRow): Promise<ReviewCardViewModel | null> {
    const content = await this.resolveContent(
      item.content_type as ReviewContentType,
      item.content_id,
    );

    if (!content) return null;

    return {
      id: item.id,
      contentType: item.content_type as ReviewContentType,
      term: content.term,
      reading: content.reading,
      meaning: content.meaning,
      state: item.state,
      masteryScore: item.mastery_score,
      nextReviewLabel: formatNextReviewLabel(item.next_review_at, item.interval_days),
    };
  }

  private async buildHistoryEntry(entry: {
    id: string;
    content_type: string;
    content_id: string;
    rating: ReviewRating;
    new_state: ReviewItemRow["state"];
    created_at: string;
  }): Promise<ReviewHistoryEntryViewModel> {
    const content = await this.resolveContent(
      entry.content_type as ReviewContentType,
      entry.content_id,
    );

    return {
      id: entry.id,
      contentType: entry.content_type as ReviewContentType,
      term: content?.term ?? "Review item",
      rating: entry.rating,
      state: entry.new_state,
      reviewedAt: entry.created_at,
    };
  }

  private async resolveContent(
    contentType: ReviewContentType,
    contentId: string,
  ): Promise<{ term: string; reading: string; meaning: string } | null> {
    if (contentType === "hiragana") {
      const hiragana = await hiraganaRepository.findById(contentId);
      if (!hiragana) return null;
      return {
        term: hiragana.character,
        reading: hiragana.romaji,
        meaning: hiragana.row_label,
      };
    }

    if (contentType === "katakana") {
      const katakana = await katakanaRepository.findById(contentId);
      if (!katakana) return null;
      return {
        term: katakana.character,
        reading: katakana.romaji,
        meaning: katakana.row_label,
      };
    }

    if (contentType === "vocabulary") {
      const vocabulary = await vocabularyRepository.findById(contentId);
      if (!vocabulary) return null;
      return {
        term: vocabulary.kanji ?? vocabulary.kana,
        reading: vocabulary.kanji ? vocabulary.kana : (vocabulary.part_of_speech ?? ""),
        meaning: vocabulary.meaning,
      };
    }

    if (contentType === "grammar") {
      const grammar = await grammarRepository.findById(contentId);
      if (!grammar) return null;
      return {
        term: grammar.title,
        reading: grammar.meaning,
        meaning: grammar.explanation ?? grammar.meaning,
      };
    }

    if (contentType === "kanji") {
      const kanji = await kanjiRepository.findById(contentId);
      if (!kanji) return null;
      return {
        term: kanji.character,
        reading: [
          ...kanji.readings
            .filter((reading) => reading.reading_type === "onyomi")
            .map((reading) => reading.reading),
          ...kanji.readings
            .filter((reading) => reading.reading_type === "kunyomi")
            .map((reading) => reading.reading),
        ].join(" · "),
        meaning: kanji.meaning,
      };
    }

    return null;
  }
}

export const reviewEnqueueService = new ReviewEnqueueService();
export const reviewServerService = new ReviewServerService();

export { formatReviewStateLabel };
