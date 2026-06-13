import { progressRepository } from "@/features/learning/repositories/learning-path.repository";
import { progressService } from "@/features/learning/services/progress.service";
import { reviewServerService } from "@/features/review/services/review-server.service";
import {
  conflictMessage,
  resolveSyncConflict,
} from "@/lib/offline/conflict-resolver";
import type {
  OfflineLessonCompletePayload,
  OfflineLessonStartPayload,
  OfflineReviewSubmitPayload,
  OfflineSyncBatchRequest,
  OfflineSyncBatchResponse,
  OfflineSyncResultItem,
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

        await progressService.completeLesson({
          userId,
          lessonId: payload.lessonId,
          score: payload.score,
        });

        return {
          mutationId: mutation.id,
          resolution: "applied",
          message: conflictMessage("applied"),
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

        if (fast.gamificationPending) {
          await reviewServerService.processReviewGamification({
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
        };
      }
      default:
        throw new Error(`Unsupported offline mutation type.`);
    }
  }
}

export const offlineSyncServerService = new OfflineSyncServerService();
