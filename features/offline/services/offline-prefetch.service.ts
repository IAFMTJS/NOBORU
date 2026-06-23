import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { OFFLINE_PREFETCH_LESSON_LIMIT } from "@/lib/offline/constants";
import { getLessonAudioPrefetchPlan } from "@/lib/learning/lesson-audio-prefetch";
import type { OfflineReviewBundle } from "@/lib/offline/types";

export type OfflinePrefetchResult = {
  lessonsCached: number;
  reviewCardsCached: number;
  audioFilesCached: number;
  errors: string[];
};

function collectUpcomingLessonIds(
  path: LearningPathViewModel,
  limit: number,
): string[] {
  const ids: string[] = [];

  for (const region of path.regions) {
    if (region.availability !== "available") continue;

    for (const unit of region.units) {
      for (const lesson of unit.lessons) {
        if (lesson.contentStatus !== "published") continue;
        if (lesson.progress === "completed") continue;
        ids.push(lesson.id);
        if (ids.length >= limit) return ids;
      }
    }
  }

  return ids;
}

async function fetchLearningPath(): Promise<LearningPathViewModel> {
  const response = await fetch("/api/learning/regions");
  const result = (await response.json()) as {
    success: boolean;
    data?: LearningPathViewModel;
    error?: string;
  };
  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Failed to load learning path.");
  }
  return result.data;
}

async function fetchReviewBundle(userId: string): Promise<OfflineReviewBundle> {
  const response = await fetch("/api/review/session");
  const result = (await response.json()) as {
    success: boolean;
    data?: OfflineReviewBundle;
    error?: string;
  };
  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Failed to load review bundle.");
  }

  await offlineClient.cacheReviewBundle({
    ...result.data,
    cachedAt: new Date().toISOString(),
  });

  return result.data;
}

export async function prepareForOffline(
  userId: string,
): Promise<OfflinePrefetchResult> {
  const errors: string[] = [];
  let lessonsCached = 0;
  let audioFilesCached = 0;
  let reviewCardsCached = 0;

  const path = await fetchLearningPath();
  const lessonIds = collectUpcomingLessonIds(path, OFFLINE_PREFETCH_LESSON_LIMIT);

  for (const lessonId of lessonIds) {
    try {
      const session = await offlineClient.fetchLessonSession(lessonId);
      lessonsCached += 1;
      const audioUrls = getLessonAudioPrefetchPlan(session);
      await offlineClient.prefetchAudioBatch(audioUrls);
      audioFilesCached += audioUrls.length;
    } catch (error) {
      errors.push(
        error instanceof Error
          ? `Lesson ${lessonId}: ${error.message}`
          : `Lesson ${lessonId}: failed to cache.`,
      );
    }
  }

  try {
    const bundle = await fetchReviewBundle(userId);
    reviewCardsCached = bundle.dueCards.length;
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Review bundle: ${error.message}`
        : "Review bundle: failed to cache.",
    );
  }

  return {
    lessonsCached,
    reviewCardsCached,
    audioFilesCached,
    errors,
  };
}

export const offlinePrefetchService = {
  prepareForOffline,
};
