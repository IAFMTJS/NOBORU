import { reviewEnqueueService } from "@/features/review/services/review-server.service";
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

  async completeLesson(input: CompleteProgressInput): Promise<UserProgressRow> {
    const lesson = await learningPathRepository.findPublishedLessonById(
      input.lessonId,
    );
    if (!lesson) {
      throw new Error("Lesson not found.");
    }

    const score = Math.max(0, Math.min(100, Math.round(input.score)));

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

    await reviewEnqueueService.enqueueFromLesson(input.userId, input.lessonId);

    return result;
  }
}

export const progressService = new ProgressService();
