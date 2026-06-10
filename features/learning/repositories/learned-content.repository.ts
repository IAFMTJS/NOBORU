import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";

type LearnedContentSnapshot = {
  completedLessonIds: string[];
  reviewIdsByType: Map<string, Set<string>>;
  lessonItemIdsByType: Map<string, Set<string>>;
};

async function loadLearnedContentSnapshot(
  userId: string,
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
    .select("content_type, content_id")
    .eq("user_id", userId);

  if (reviewError) throw new Error(reviewError.message);

  const reviewIdsByType = new Map<string, Set<string>>();
  for (const row of reviewRows ?? []) {
    const contentType = row.content_type as string;
    const ids = reviewIdsByType.get(contentType) ?? new Set<string>();
    ids.add(row.content_id as string);
    reviewIdsByType.set(contentType, ids);
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
  };
}

const getLearnedContentSnapshot = cache(loadLearnedContentSnapshot);

class LearnedContentRepository {
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
}

export const learnedContentRepository = new LearnedContentRepository();
