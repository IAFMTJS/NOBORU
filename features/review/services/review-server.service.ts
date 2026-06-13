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
import { achievementService } from "@/features/achievements/services/achievement.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";
import {
  formatNextReviewLabel,
  formatReviewStateLabel,
} from "@/features/review/services/srs.service";
import type {
  ReviewCardViewModel,
  ReviewContentType,
  ReviewGamificationViewModel,
  ReviewHistoryEntryViewModel,
  ReviewRating,
  ReviewSessionViewModel,
  ReviewStatsViewModel,
  ReviewSubmitDeltaViewModel,
  WeakAreaViewModel,
} from "@/features/review/types/review.types";
import { REVIEW_CONTENT_LABELS } from "@/features/review/types/review.types";

class ReviewEnqueueService {
  async enqueueFromLesson(userId: string, lessonId: string): Promise<number> {
    const items = await learningPathRepository.listLessonItems(lessonId);
    const reviewItems = items
      .filter(
        (item) =>
          item.content_type === "hiragana" ||
          item.content_type === "katakana" ||
          item.content_type === "vocabulary" ||
          item.content_type === "grammar" ||
          item.content_type === "kanji",
      )
      .map((item) => ({
        contentType: item.content_type,
        contentId: item.content_id,
      }));

    if (reviewItems.length === 0) return 0;
    await reviewRepository.upsertReviewItemsBatch(userId, reviewItems);
    return reviewItems.length;
  }
}

class ReviewServerService {
  private async buildSessionFromDue(
    userId: string,
    dueItems: Awaited<ReturnType<typeof reviewRepository.listDue>>,
  ): Promise<ReviewSessionViewModel> {
    const [stats, recentHistoryRows] = await Promise.all([
      this.getStats(userId),
      reviewRepository.listRecentHistory(userId, 5),
    ]);

    const contentLookup = await this.resolveContentBatch([
      ...recentHistoryRows.map((entry) => ({
        contentType: entry.content_type as ReviewContentType,
        contentId: entry.content_id,
      })),
      ...(dueItems[0]
        ? [
            {
              contentType: dueItems[0].content_type as ReviewContentType,
              contentId: dueItems[0].content_id,
            },
          ]
        : []),
    ]);

    const current = dueItems[0];
    const currentCard = current
      ? this.buildCard(current, contentLookup)
      : null;
    const recentHistory = recentHistoryRows.map((entry) =>
      this.buildHistoryEntry(entry, contentLookup),
    );

    return {
      dueCount: stats.dueCount,
      stats,
      currentCard,
      recentHistory,
    };
  }

  async getSession(userId: string): Promise<ReviewSessionViewModel> {
    const dueItems = await reviewRepository.listDue(userId, 1);
    return this.buildSessionFromDue(userId, dueItems);
  }

  async getOfflineBundle(
    userId: string,
    limit = 25,
    options?: { contentType?: string; weakOnly?: boolean },
  ) {
    const dueItems = await reviewRepository.listDue(userId, limit, options);
    const session = await this.buildSessionFromDue(userId, dueItems);

    const contentLookup = await this.resolveContentBatch(
      dueItems.map((item) => ({
        contentType: item.content_type as ReviewContentType,
        contentId: item.content_id,
      })),
    );

    const dueCards = dueItems
      .map((item) => this.buildCard(item, contentLookup))
      .filter((card): card is ReviewCardViewModel => card !== null);

    return {
      userId,
      session,
      dueCards,
      cachedAt: new Date().toISOString(),
    };
  }

  async getStats(userId: string): Promise<ReviewStatsViewModel> {
    const [dueCount, aggregated] = await Promise.all([
      reviewRepository.countDue(userId),
      reviewRepository.getAggregatedStats(userId),
    ]);

    const weakAreas: WeakAreaViewModel[] = aggregated.weakAreas
      .filter(
        (area): area is { content_type: ReviewContentType; count: number } =>
          area.content_type in REVIEW_CONTENT_LABELS,
      )
      .map((area) => ({
        contentType: area.content_type,
        label: REVIEW_CONTENT_LABELS[area.content_type],
        count: area.count,
      }))
      .sort((left, right) => right.count - left.count);

    return {
      dueCount,
      learningCount: aggregated.learningCount,
      masteredCount: aggregated.masteredCount,
      totalCount: aggregated.totalCount,
      weakAreas,
    };
  }

  async submitReview(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
    clientEventId?: string,
  ): Promise<ReviewSubmitDeltaViewModel> {
    const fast = await this.submitReviewFast(
      userId,
      reviewItemId,
      rating,
      clientEventId,
    );

    if (!clientEventId || fast.gamificationPending) {
      return fast;
    }

    const gamification = await this.processReviewGamification({
      userId,
      reviewItemId,
      rating,
      clientEventId,
    });

    return {
      ...fast,
      stats: gamification.stats ?? fast.stats,
      elevation: gamification.elevation,
      achievements: gamification.achievements,
      quests: gamification.quests,
      gamificationPending: false,
    };
  }

  async submitReviewFast(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
    clientEventId?: string,
  ): Promise<ReviewSubmitDeltaViewModel> {
    const { item: ratedItem, alreadyApplied } = await reviewRepository.submitRating(
      userId,
      reviewItemId,
      rating,
      clientEventId,
    );

    const [dueCount, dueItems] = await Promise.all([
      reviewRepository.countDue(userId),
      reviewRepository.listDue(userId, 1),
    ]);

    const contentLookup = await this.resolveContentBatch([
      {
        contentType: ratedItem.content_type as ReviewContentType,
        contentId: ratedItem.content_id,
      },
      ...(dueItems[0]
        ? [
            {
              contentType: dueItems[0].content_type as ReviewContentType,
              contentId: dueItems[0].content_id,
            },
          ]
        : []),
    ]);

    const historyEntry = this.buildHistoryEntry(
      {
        id: `${ratedItem.id}-${ratedItem.review_count}`,
        content_type: ratedItem.content_type,
        content_id: ratedItem.content_id,
        rating,
        new_state: ratedItem.state,
        created_at: new Date().toISOString(),
      },
      contentLookup,
    );

    const currentCard = dueItems[0]
      ? this.buildCard(dueItems[0], contentLookup)
      : null;

    return {
      dueCount,
      stats: {
        dueCount,
        learningCount: 0,
        masteredCount: 0,
        totalCount: 0,
        weakAreas: [],
      },
      currentCard,
      recentHistoryEntry: historyEntry,
      elevation: null,
      achievements: [],
      quests: [],
      clientEventId,
      gamificationPending: Boolean(clientEventId) && !alreadyApplied,
      alreadyApplied,
    };
  }

  async processReviewGamification(input: {
    userId: string;
    reviewItemId: string;
    rating: ReviewRating;
    clientEventId: string;
  }): Promise<ReviewGamificationViewModel> {
    const existing = await reviewRepository.findHistoryByClientEventId(
      input.userId,
      input.clientEventId,
    );

    if (existing?.gamification_applied_at && existing.gamification_result) {
      return this.parseStoredGamification(
        input.clientEventId,
        existing.gamification_result,
      );
    }

    const [elevation, achievements, stats] = await Promise.all([
      elevationService.awardReviewRating(
        input.userId,
        input.reviewItemId,
        input.rating,
        input.clientEventId,
      ),
      achievementService.afterStudyActivity(input.userId),
      this.getStats(input.userId),
    ]);

    const quests = await questService.recordActivities(input.userId, [
      { type: "review_item", amount: 1 },
      ...(elevation
        ? [{ type: "ep_earned" as const, amount: elevation.epAwarded }]
        : []),
    ]);

    const payload: ReviewGamificationViewModel = {
      clientEventId: input.clientEventId,
      ready: true,
      elevation,
      achievements,
      quests,
      stats,
    };

    await reviewRepository.saveGamificationResult(
      input.userId,
      input.clientEventId,
      payload as unknown as Record<string, unknown>,
    );

    return payload;
  }

  async getGamificationResult(
    userId: string,
    clientEventId: string,
  ): Promise<ReviewGamificationViewModel> {
    const history = await reviewRepository.findHistoryByClientEventId(
      userId,
      clientEventId,
    );

    if (!history) {
      return {
        clientEventId,
        ready: false,
        elevation: null,
        achievements: [],
        quests: [],
        stats: null,
      };
    }

    if (history.gamification_applied_at && history.gamification_result) {
      return this.parseStoredGamification(
        clientEventId,
        history.gamification_result,
      );
    }

    return {
      clientEventId,
      ready: false,
      elevation: null,
      achievements: [],
      quests: [],
      stats: null,
    };
  }

  private parseStoredGamification(
    clientEventId: string,
    raw: Record<string, unknown>,
  ): ReviewGamificationViewModel {
    return {
      clientEventId,
      ready: true,
      elevation: (raw.elevation as ReviewGamificationViewModel["elevation"]) ?? null,
      achievements:
        (raw.achievements as ReviewGamificationViewModel["achievements"]) ?? [],
      quests: (raw.quests as ReviewGamificationViewModel["quests"]) ?? [],
      stats: (raw.stats as ReviewGamificationViewModel["stats"]) ?? null,
    };
  }

  private buildCard(
    item: ReviewItemRow,
    contentLookup: Map<string, { term: string; reading: string; meaning: string }>,
  ): ReviewCardViewModel | null {
    const content = contentLookup.get(
      `${item.content_type}:${item.content_id}`,
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

  private buildHistoryEntry(
    entry: {
      id: string;
      content_type: string;
      content_id: string;
      rating: ReviewRating;
      new_state: ReviewItemRow["state"];
      created_at: string;
    },
    contentLookup: Map<string, { term: string; reading: string; meaning: string }>,
  ): ReviewHistoryEntryViewModel {
    const content = contentLookup.get(
      `${entry.content_type}:${entry.content_id}`,
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

  private async resolveContentBatch(
    entries: Array<{ contentType: ReviewContentType; contentId: string }>,
  ): Promise<Map<string, { term: string; reading: string; meaning: string }>> {
    const uniqueByType = new Map<ReviewContentType, Set<string>>();
    for (const entry of entries) {
      const ids = uniqueByType.get(entry.contentType) ?? new Set<string>();
      ids.add(entry.contentId);
      uniqueByType.set(entry.contentType, ids);
    }

    const [
      hiraganaRows,
      katakanaRows,
      vocabularyRows,
      grammarRows,
      kanjiRows,
    ] = await Promise.all([
      hiraganaRepository.findByIds(
        Array.from(uniqueByType.get("hiragana") ?? []),
      ),
      katakanaRepository.findByIds(
        Array.from(uniqueByType.get("katakana") ?? []),
      ),
      vocabularyRepository.findByIds(
        Array.from(uniqueByType.get("vocabulary") ?? []),
      ),
      grammarRepository.findByIds(
        Array.from(uniqueByType.get("grammar") ?? []),
      ),
      kanjiRepository.findByIds(Array.from(uniqueByType.get("kanji") ?? [])),
    ]);

    const lookup = new Map<string, { term: string; reading: string; meaning: string }>();

    for (const row of hiraganaRows) {
      lookup.set(`hiragana:${row.id}`, {
        term: row.character,
        reading: row.romaji,
        meaning: row.row_label,
      });
    }
    for (const row of katakanaRows) {
      lookup.set(`katakana:${row.id}`, {
        term: row.character,
        reading: row.romaji,
        meaning: row.row_label,
      });
    }
    for (const row of vocabularyRows) {
      lookup.set(`vocabulary:${row.id}`, {
        term: row.kanji ?? row.kana,
        reading: row.kanji ? row.kana : (row.part_of_speech ?? ""),
        meaning: row.meaning,
      });
    }
    for (const row of grammarRows) {
      lookup.set(`grammar:${row.id}`, {
        term: row.title,
        reading: row.meaning,
        meaning: row.explanation ?? row.meaning,
      });
    }
    for (const row of kanjiRows) {
      lookup.set(`kanji:${row.id}`, {
        term: row.character,
        reading: [
          ...row.readings
            .filter((reading) => reading.reading_type === "onyomi")
            .map((reading) => reading.reading),
          ...row.readings
            .filter((reading) => reading.reading_type === "kunyomi")
            .map((reading) => reading.reading),
        ].join(" · "),
        meaning: row.meaning,
      });
    }

    return lookup;
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
