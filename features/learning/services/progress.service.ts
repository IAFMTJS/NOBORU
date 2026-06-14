import { achievementService } from "@/features/achievements/services/achievement.service";
import { reviewEnqueueService } from "@/features/review/services/review-server.service";
import { companionService } from "@/features/companion/services/companion.service";
import { chestService } from "@/features/chests/services/chest.service";
import { friendsService } from "@/features/friends/services/friends.service";
import { leagueService } from "@/features/leagues/services/league.service";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { elevationService } from "@/features/elevation/services/elevation.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import {
  countNewVocabularyInLesson,
  questService,
} from "@/features/quests/services/quest.service";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import {
  getLessonPassScore,
  isLessonScorePassing,
} from "@/features/learning/constants/lesson.constants";
import { LessonPassThresholdError } from "@/features/learning/errors/lesson.errors";
import { journeyService } from "@/features/learning/services/journey.service";
import {
  learningPathRepository,
  progressRepository,
} from "@/features/learning/repositories/learning-path.repository";
import type {
  CompleteProgressInput,
  StartProgressInput,
  UserProgressRow,
} from "@/features/learning/types/progress.types";

class ProgressService {
  async startLesson(input: StartProgressInput): Promise<UserProgressRow> {
    const lesson = await learningPathRepository.findPublishedLessonById(
      input.lessonId,
    );
    if (!lesson) {
      throw new Error("Lesson not found.");
    }

    const existing = await progressRepository.findByUserAndLesson(
      input.userId,
      input.lessonId,
    );

    if (existing?.status === "completed") {
      return existing;
    }

    return progressRepository.upsertInProgress({
      userId: input.userId,
      lessonId: input.lessonId,
      regionId: lesson.unit.region.id,
      unitId: lesson.unit.id,
    });
  }

  async completeLesson(input: CompleteProgressInput): Promise<
    UserProgressRow & {
      elevation: ElevationAwardViewModel | null;
      achievements: AchievementUnlockViewModel[];
      quests: QuestCompletionViewModel[];
      reviewItemsEnqueued: number;
    }
  > {
    const lesson = await learningPathRepository.findPublishedLessonById(
      input.lessonId,
    );
    if (!lesson) {
      throw new Error("Lesson not found.");
    }

    const existing = await progressRepository.findByUserAndLesson(
      input.userId,
      input.lessonId,
    );
    const isFirstCompletion = existing?.status !== "completed";
    const score = Math.max(0, Math.min(100, Math.round(input.score)));

    if (
      isFirstCompletion &&
      !isLessonScorePassing(lesson.type, score)
    ) {
      throw new LessonPassThresholdError(score, getLessonPassScore(lesson.type));
    }

    const newVocabularyCount = await countNewVocabularyInLesson(
      input.userId,
      input.lessonId,
      learningPathRepository.listLessonItems.bind(learningPathRepository),
      vocabularyRepository.listLearnedVocabularyIds.bind(vocabularyRepository),
    );

    await progressRepository.upsertInProgress({
      userId: input.userId,
      lessonId: input.lessonId,
      regionId: lesson.unit.region.id,
      unitId: lesson.unit.id,
    });

    const result = await progressRepository.markCompleted({
      userId: input.userId,
      lessonId: input.lessonId,
      score,
    });

    const reviewItemsEnqueued = await reviewEnqueueService.enqueueFromLesson(
      input.userId,
      input.lessonId,
    );

    const [elevation, achievements] = await Promise.all([
      elevationService.awardLessonCompletion(
        input.userId,
        input.lessonId,
        lesson.title,
        lesson.xp_reward,
        isFirstCompletion,
      ),
      achievementService.afterStudyActivity(input.userId),
    ]);

    const questEvents = [
      { type: "lesson_complete" as const, amount: 1 },
      ...(newVocabularyCount > 0
        ? [{ type: "vocabulary_learned" as const, amount: newVocabularyCount }]
        : []),
      ...(elevation
        ? [{ type: "ep_earned" as const, amount: elevation.epAwarded }]
        : []),
    ];

    const quests = await questService.recordActivities(input.userId, questEvents);

    void companionService.awardBondXp(input.userId, "lesson_complete");
    void chestService.claimDailyOnStudy(input.userId);
    void friendsService.recordActivity(
      input.userId,
      "lesson_complete",
      `Completed ${lesson.title}`,
    );
    if (elevation?.epAwarded) {
      void leagueService.addWeeklyEp(input.userId, elevation.epAwarded);
    }

    void journeyService.syncCurrentRegionToProfile(input.userId);

    return { ...result, elevation, achievements, quests, reviewItemsEnqueued };
  }
}

export const progressService = new ProgressService();
