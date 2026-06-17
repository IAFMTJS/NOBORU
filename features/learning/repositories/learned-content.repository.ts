import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { ReviewState } from "@/features/review/repositories/review.repository";
import type {
  LearnedContentSnapshot,
  ReviewItemSnapshot,
} from "@/lib/learning/player-knowledge.utils";import {
  getKnownIdsFromSnapshot,
  getMasteredIdsFromSnapshot,
  getScheduledReviewIdsFromSnapshot,
  getWeakIdsFromSnapshot,
  prioritizeReviewContentIds,
} from "@/lib/learning/player-knowledge.utils";

async function loadLearnedContentSnapshot(  userId: string,
): Promise<LearnedContentSnapshot> {
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

  const { data: reviewRows, error: reviewError } = await supabase
    .from("review_items")
    .select("content_type, content_id, state, mastery_score, next_review_at")
    .eq("user_id", userId);

  if (reviewError) throw new Error(reviewError.message);

  const reviewIdsByType = new Map<string, Set<string>>();
  const reviewItems: ReviewItemSnapshot[] = [];

  for (const row of reviewRows ?? []) {
    const contentType = row.content_type as string;
    const contentId = row.content_id as string;
    const ids = reviewIdsByType.get(contentType) ?? new Set<string>();
    ids.add(contentId);
    reviewIdsByType.set(contentType, ids);
    reviewItems.push({
      contentType,
      contentId,
      state: row.state as ReviewState,
      masteryScore: row.mastery_score as number,
      nextReviewAt: row.next_review_at as string,
    });
  }

  const lessonItemIdsByType = new Map<string, Set<string>>();
  if (completedLessonIds.length > 0) {
    const { data: items, error: itemsError } = await supabase
      .from("lesson_items")
      .select("content_type, content_id")
      .in("lesson_id", completedLessonIds);

    if (itemsError) throw new Error(itemsError.message);

    for (const item of items ?? []) {
      const contentType = item.content_type as string;
      const ids = lessonItemIdsByType.get(contentType) ?? new Set<string>();
      ids.add(item.content_id as string);
      lessonItemIdsByType.set(contentType, ids);
    }
  }

  return {
    completedLessonIds,
    reviewIdsByType,
    lessonItemIdsByType,
    reviewItems,
  };
}

const getLearnedContentSnapshot = cache(loadLearnedContentSnapshot);

class LearnedContentRepository {
  async getSnapshot(userId: string): Promise<LearnedContentSnapshot> {
    return getLearnedContentSnapshot(userId);
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
    const snapshot = await getLearnedContentSnapshot(userId);
    const learned = new Set<string>();

    for (const id of snapshot.reviewIdsByType.get(contentType) ?? []) {
      learned.add(id);
    }

    for (const id of snapshot.lessonItemIdsByType.get(contentType) ?? []) {
      learned.add(id);
    }

    return Array.from(learned);
  }

  async getKnownIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const snapshot = await getLearnedContentSnapshot(userId);
    return getKnownIdsFromSnapshot(snapshot, contentType);
  }

  async getMasteredIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const snapshot = await getLearnedContentSnapshot(userId);
    return getMasteredIdsFromSnapshot(snapshot, contentType);
  }

  async getWeakIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const snapshot = await getLearnedContentSnapshot(userId);
    return getWeakIdsFromSnapshot(snapshot, contentType);
  }

  async getScheduledReviewIdsByContentType(
    userId: string,
    contentType: string,
  ): Promise<string[]> {
    const snapshot = await getLearnedContentSnapshot(userId);
    return getScheduledReviewIdsFromSnapshot(snapshot, contentType);
  }

  async getPrioritizedReviewIds(
    userId: string,
    contentType: string,
    options?: { excludeIds?: ReadonlySet<string>; limit?: number },
  ): Promise<string[]> {
    const snapshot = await getLearnedContentSnapshot(userId);
    return prioritizeReviewContentIds(snapshot, contentType, options);
  }
}

export const learnedContentRepository = new LearnedContentRepository();
