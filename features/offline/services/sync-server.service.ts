import { isPlayableGameSlug } from "@/features/games/constants/game.constants";
import { gameService } from "@/features/games/services/game.service";
import { progressRepository } from "@/features/learning/repositories/learning-path.repository";
import { progressService } from "@/features/learning/services/progress.service";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { trialService } from "@/features/trials/services/trial.service";
import {
  conflictMessage,
  resolveSyncConflict,
} from "@/lib/offline/conflict-resolver";
import { toSyncGamification } from "@/lib/offline/sync-gamification";
import type {
  OfflineGameCompletePayload,
  OfflineLessonCompletePayload,
  OfflineLessonStartPayload,
  OfflineListeningProgressPayload,
  OfflineReadingProgressPayload,
  OfflineReviewSubmitPayload,
  OfflineSyncBatchRequest,
  OfflineSyncBatchResponse,
  OfflineSyncResultItem,
  OfflineTrialCompletePayload,
} from "@/lib/offline/types";

class OfflineSyncServerService {
  async applyBatch(
    userId: string,
    request: OfflineSyncBatchRequest,
  ): Promise<OfflineSyncBatchResponse> {
    const applied: OfflineSyncResultItem[] = [];
    const failed: OfflineSyncBatchResponse["failed"] = [];

    for (const mutation of request.mutations) {
      try {
        const result = await this.applyMutation(userId, mutation);
        applied.push(result);
      } catch (error) {
        failed.push({
          mutationId: mutation.id,
          error: error instanceof Error ? error.message : "Sync mutation failed.",
        });
      }
    }

    return {
      applied,
      failed,
      pendingCount: failed.length,
    };
  }

  private async applyMutation(
    userId: string,
    mutation: OfflineSyncBatchRequest["mutations"][number],
  ): Promise<OfflineSyncResultItem> {
    switch (mutation.type) {
      case "lesson_start": {
        const payload = mutation.payload as OfflineLessonStartPayload;
        await progressService.startLesson({
          userId,
          lessonId: payload.lessonId,
        });
        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
        };
      }
      case "lesson_complete": {
        const payload = mutation.payload as OfflineLessonCompletePayload;
        const existing = await progressRepository.findByUserAndLesson(
          userId,
          payload.lessonId,
        );
        const resolution = resolveSyncConflict({
          type: mutation.type,
          alreadyApplied: false,
          serverCompleted: existing?.status === "completed",
        });

        if (resolution === "server_wins") {
          return {
            mutationId: mutation.id,
            resolution,
            message: conflictMessage(resolution),
          };
        }

        const completion = await progressService.completeLesson({
          userId,
          lessonId: payload.lessonId,
          score: payload.score,
        });

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
          gamification: toSyncGamification({
            elevation: completion.elevation,
            achievements: completion.achievements,
            quests: completion.quests,
          }),
        };
      }
      case "review_submit": {
        const payload = mutation.payload as OfflineReviewSubmitPayload;
        const clientEventId = payload.clientEventId ?? mutation.id;
        const fast = await reviewServerService.submitReviewFast(
          userId,
          payload.reviewItemId,
          payload.rating,
          clientEventId,
        );

        let gamification = null;
        if (fast.gamificationPending) {
          gamification = await reviewServerService.processReviewGamification({
            userId,
            reviewItemId: payload.reviewItemId,
            rating: payload.rating,
            clientEventId,
          });
        }

        const resolution = resolveSyncConflict({
          type: mutation.type,
          alreadyApplied: fast.alreadyApplied ?? false,
        });

        return {
          mutationId: mutation.id,
          resolution,
          message: conflictMessage(resolution),
          gamification: toSyncGamification(
            gamification
              ? {
                  elevation: gamification.elevation,
                  achievements: gamification.achievements,
                  quests: gamification.quests,
                }
              : undefined,
          ),
        };
      }
      case "reading_progress": {
        const payload = mutation.payload as OfflineReadingProgressPayload;

        if (payload.status === "in_progress") {
          await readingProgressService.markInProgress(
            userId,
            payload.contentType,
            payload.contentId,
          );
        } else if (payload.contentType === "story") {
          await readingProgressService.saveStoryProgress(
            userId,
            payload.contentId,
            payload.score,
          );
        } else {
          await readingProgressService.saveDialogueProgress(
            userId,
            payload.contentId,
            payload.score,
          );
        }

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
        };
      }
      case "listening_progress": {
        const payload = mutation.payload as OfflineListeningProgressPayload;

        if (payload.status === "in_progress") {
          await listeningProgressService.markInProgress(
            userId,
            payload.contentType,
            payload.contentId,
          );
        } else if (payload.contentType === "exercise") {
          await listeningProgressService.saveExerciseProgress(
            userId,
            payload.contentId,
            payload.score,
          );
        } else {
          await listeningProgressService.saveChallengeProgress(
            userId,
            payload.contentId,
            payload.score,
          );
        }

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
        };
      }
      case "game_complete": {
        const payload = mutation.payload as OfflineGameCompletePayload;
        if (!isPlayableGameSlug(payload.slug)) {
          throw new Error("Unknown game.");
        }

        const result = await gameService.completeGame(userId, payload.slug, {
          correctCount: payload.correctCount,
          totalCount: payload.totalCount,
          wrongAttempts: payload.wrongAttempts,
          durationMs: payload.durationMs,
        });

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
          gamification: toSyncGamification({
            elevation: result.elevation,
            quests: result.quests,
          }),
          gameComplete: result,
        };
      }
      case "trial_complete": {
        const payload = mutation.payload as OfflineTrialCompletePayload;
        const result = await trialService.completeTrial(userId, payload.slug, {
          correctCount: payload.correctCount,
          totalCount: payload.totalCount,
          timeSpentSeconds: payload.timeSpentSeconds,
          startedAt: payload.startedAt,
        });

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
          gamification: toSyncGamification({
            elevation: result.elevation,
            achievements: result.achievements,
            quests: result.quests,
          }),
          trialComplete: result,
        };
      }
      default:
        throw new Error(`Unsupported offline mutation type.`);
    }
  }
}

export const offlineSyncServerService = new OfflineSyncServerService();
