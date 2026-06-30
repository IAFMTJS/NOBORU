import { buildDailyChallengeSession } from "@/lib/learning/daily-challenge.service";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";
import {
  playerKnowledgeService,
  resolveDefaultLessonScope,
} from "@/features/learning/services/player-knowledge.service";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import { reviewRepository } from "@/features/review/repositories/review.repository";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import { contentMasteryService } from "@/features/vocabulary/services/content-mastery.service";
import { dailyChallengeRepository } from "@/features/daily-challenges/repositories/daily-challenge.repository";
import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";
import type {
  DailyChallengeCompleteInput,
  DailyChallengeCompleteViewModel,
  DailyChallengeCompletionViewModel,
  DailyChallengeSessionViewModel,
} from "@/features/daily-challenges/types/daily-challenge.types";

function resolveChallengeDate(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
      new Date(),
    );
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function mapCompletionRow(input: {
  correct_count: number;
  total_count: number;
  completed_at: string;
}): DailyChallengeCompletionViewModel {
  return {
    correctCount: input.correct_count,
    totalCount: input.total_count,
    scorePercent: Math.round((input.correct_count / input.total_count) * 100),
    completedAt: input.completed_at,
  };
}

class DailyChallengeService {
  async getChallengeDateForUser(userId: string): Promise<string> {
    const profile = await profileServerRepository.findByUserId(userId);
    return resolveChallengeDate(profile?.timezone ?? "UTC");
  }

  async getRetentionSession(
    userId: string,
    limit = 15,
  ): Promise<DailyChallengeSessionViewModel> {
    const challengeDate = await this.getChallengeDateForUser(userId);
    const existingCompletion = await dailyChallengeRepository.findByDate(
      userId,
      challengeDate,
    );

    if (existingCompletion) {
      return {
        goal: "retention",
        items: [],
        totalCount: existingCompletion.total_count,
        completedToday: 1,
        challengeDate,
        todayCompletion: mapCompletionRow(existingCompletion),
      };
    }

    const scope = await resolveDefaultLessonScope(userId);
    if (!scope) {
      return {
        goal: "retention",
        items: [],
        totalCount: 0,
        completedToday: 0,
        challengeDate,
        todayCompletion: null,
      };
    }

    const [context, scheduledReviewIds] = await Promise.all([
      playerKnowledgeService.getContext(scope),
      learnedContentRepository.getScheduledReviewIdsByContentType(
        userId,
        "vocabulary",
      ),
    ]);

    const session = buildDailyChallengeSession(context, scheduledReviewIds, limit);
    const vocabularyIds = session.items.map((item) => item.vocabularyId);
    const [vocabularyRows, reviewItems] = await Promise.all([
      vocabularyRepository.findByIds(vocabularyIds),
      reviewRepository.listByContentIds(userId, "vocabulary", vocabularyIds),
    ]);
    const vocabularyById = new Map(vocabularyRows.map((row) => [row.id, row]));
    const reviewItemIdByVocabularyId = new Map(
      reviewItems.map((item) => [item.content_id, item.id]),
    );

    const items = session.items
      .map((item) => {
        const row = vocabularyById.get(item.vocabularyId);
        if (!row) return null;
        return {
          vocabularyId: item.vocabularyId,
          reviewItemId: reviewItemIdByVocabularyId.get(item.vocabularyId) ?? null,
          priority: item.priority,
          display: row.kanji ?? row.kana,
          reading: row.kanji ? row.kana : null,
          romaji: deriveKanaRomaji(row.kana) || null,
          meaning: row.meaning,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      goal: "retention",
      items,
      totalCount: items.length,
      completedToday: 0,
      challengeDate,
      todayCompletion: null,
    };
  }

  async completeRetentionSession(
    userId: string,
    input: DailyChallengeCompleteInput,
  ): Promise<DailyChallengeCompleteViewModel> {
    if (input.totalCount <= 0) {
      throw new Error("Daily challenge must include at least one item.");
    }
    if (input.correctCount < 0 || input.correctCount > input.totalCount) {
      throw new Error("Daily challenge score is invalid.");
    }
    if (input.vocabularyIds.length === 0) {
      throw new Error("Daily challenge vocabulary list is required.");
    }

    const challengeDate = await this.getChallengeDateForUser(userId);

    if (input.clientEventId) {
      const byEvent = await dailyChallengeRepository.findByClientEventId(
        userId,
        input.clientEventId,
      );
      if (byEvent) {
        return {
          alreadyApplied: true,
          completion: mapCompletionRow(byEvent),
        };
      }
    }

    const existing = await dailyChallengeRepository.findByDate(userId, challengeDate);
    if (existing) {
      return {
        alreadyApplied: true,
        completion: mapCompletionRow(existing),
      };
    }

    const row = await dailyChallengeRepository.insertCompletion({
      userId,
      challengeDate,
      correctCount: input.correctCount,
      totalCount: input.totalCount,
      vocabularyIds: input.vocabularyIds,
      clientEventId: input.clientEventId,
    });

    await Promise.all(
      input.correctVocabularyIds.map((vocabularyId) =>
        contentMasteryService
          .recordCorrectAnswer({
            userId,
            contentType: "vocabulary",
            contentId: vocabularyId,
            exerciseType: "daily_retention",
            sessionId: input.clientEventId,
          })
          .catch(() => undefined),
      ),
    );

    return {
      alreadyApplied: false,
      completion: mapCompletionRow(row),
    };
  }
}

export const dailyChallengeService = new DailyChallengeService();
