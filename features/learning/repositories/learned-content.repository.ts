import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { ReviewState } from "@/features/review/repositories/review.repository";
import type {
  LearnedContentSnapshot,
  ReviewItemSnapshot,
} from "@/lib/learning/player-knowledge.utils";
import {
  getKnownIdsFromSnapshot,
  getMasteredIdsFromSnapshot,
  getScheduledReviewIdsFromSnapshot,
  getWeakIdsFromSnapshot,
  prioritizeReviewContentIds,
} from "@/lib/learning/player-knowledge.utils";

type ContentTypeSlice = {
  reviewIds: Set<string>;
  lessonItemIds: Set<string>;
  reviewItems: ReviewItemSnapshot[];
};

async function fetchReviewItemsForType(
  userId: string,
  contentType: string,
): Promise<ReviewItemSnapshot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_items")
    .select("content_id, state, mastery_score, next_review_at")
    .eq("user_id", userId)
    .eq("content_type", contentType);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    contentType,
    contentId: row.content_id as string,
    state: row.state as ReviewState,
    masteryScore: row.mastery_score as number,
    nextReviewAt: row.next_review_at as string,
  }));
}

async function fetchLessonContentIdsForType(
  userId: string,
  contentType: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (progressError) throw new Error(progressError.message);

  const completedLessonIds = (progress ?? []).map(
    (row) => row.lesson_id as string,
  );
  if (completedLessonIds.length === 0) return [];

  const { data: items, error: itemsError } = await supabase
    .from("lesson_items")
    .select("content_id")
    .in("lesson_id", completedLessonIds)
    .eq("content_type", contentType);

  if (itemsError) throw new Error(itemsError.message);

  return (items ?? []).map((item) => item.content_id as string);
}

async function loadContentTypeSlice(
  userId: string,
  contentType: string,
): Promise<ContentTypeSlice> {
  const [reviewItems, lessonContentIds] = await Promise.all([
    fetchReviewItemsForType(userId, contentType),
    fetchLessonContentIdsForType(userId, contentType),
  ]);

  const reviewIds = new Set(reviewItems.map((item) => item.contentId));
  const lessonItemIds = new Set(lessonContentIds);

  return { reviewIds, lessonItemIds, reviewItems };
}

const getContentTypeSlice = cache(loadContentTypeSlice);

function sliceToSnapshot(
  contentType: string,
  slice: ContentTypeSlice,
): LearnedContentSnapshot {
  return {
    completedLessonIds: [],
    reviewIdsByType: new Map([[contentType, slice.reviewIds]]),
    lessonItemIdsByType: new Map([[contentType, slice.lessonItemIds]]),
    reviewItems: slice.reviewItems,
  };
}

class LearnedContentRepository {
  async getSnapshot(userId: string): Promise<LearnedContentSnapshot> {
    const contentTypes = [
      "vocabulary",
      "grammar",
      "kanji",
      "hiragana",
      "katakana",
    ] as const;

    const slices = await Promise.all(
      contentTypes.map((contentType) =>
        getContentTypeSlice(userId, contentType),
      ),
    );

    const reviewIdsByType = new Map<string, Set<string>>();
    const lessonItemIdsByType = new Map<string, Set<string>>();
    const reviewItems: ReviewItemSnapshot[] = [];

    for (let index = 0; index < contentTypes.length; index += 1) {
      const contentType = contentTypes[index];
      const slice = slices[index];
      if (!slice) continue;

      reviewIdsByType.set(contentType, slice.reviewIds);
      lessonItemIdsByType.set(contentType, slice.lessonItemIds);
      reviewItems.push(...slice.reviewItems);
    }

    return {
      completedLessonIds: [],
      reviewIdsByType,
      lessonItemIdsByType,
      reviewItems,
    };
  }

  async countLearnedByContentType(
    userId: string,
    contentType: string,
  ): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_learned_content_count", {
      p_user_id: userId,
      p_content_type: contentType,
    });

    if (error) throw new Error(error.message);
    return (data as number) ?? 0;
  }

  async getLearnedIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    const learned = new Set<string>();

    for (const id of slice.reviewIds) {
      learned.add(id);
    }

    for (const id of slice.lessonItemIds) {
      learned.add(id);
    }

    return Array.from(learned);
  }

  async getKnownIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    return getKnownIdsFromSnapshot(sliceToSnapshot(contentType, slice), contentType);
  }

  async getMasteredIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    return getMasteredIdsFromSnapshot(sliceToSnapshot(contentType, slice), contentType);
  }

  async getWeakIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    return getWeakIdsFromSnapshot(sliceToSnapshot(contentType, slice), contentType);
  }

  async getScheduledReviewIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    return getScheduledReviewIdsFromSnapshot(
      sliceToSnapshot(contentType, slice),
      contentType,
    );
  }

  async getPrioritizedReviewIds(
    userId: string,
    contentType: string,
    options?: { excludeIds?: ReadonlySet<string>; limit?: number },
  ): Promise<string[]> {
    const slice = await getContentTypeSlice(userId, contentType);
    return prioritizeReviewContentIds(
      sliceToSnapshot(contentType, slice),
      contentType,
      options,
    );
  }
}

export const learnedContentRepository = new LearnedContentRepository();
