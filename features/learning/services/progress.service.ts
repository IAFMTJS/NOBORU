import { reviewEnqueueService } from "@/features/review/services/review-server.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
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
    UserProgressRow & { elevation: ElevationAwardViewModel | null }
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

    const elevation = await elevationService.awardLessonCompletion(
      input.userId,
      input.lessonId,
      lesson.title,
      lesson.xp_reward,
      isFirstCompletion,
    );

    return { ...result, elevation };
  }
}

export const progressService = new ProgressService();
