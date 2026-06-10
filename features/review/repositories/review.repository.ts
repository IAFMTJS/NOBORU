import { createClient } from "@/lib/supabase/server";

import { applySrsRating } from "@/features/review/services/srs.service";
import type { ReviewRating } from "@/features/review/types/review.types";

export type ReviewState =
  | "new"
  | "learning"
  | "good"
  | "strong"
  | "mastered"
  | "legendary";

export type ReviewItemRow = {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  state: ReviewState;
  next_review_at: string;
  review_count: number;
  mastery_score: number;
  interval_days: number;
  streak_count: number;
  created_at: string;
  updated_at: string;
};

export type ReviewHistoryRow = {
  id: string;
  user_id: string;
  review_item_id: string;
  rating: ReviewRating;
  previous_state: ReviewState;
  new_state: ReviewState;
  mastery_score: number;
  interval_days: number;
  created_at: string;
};

export type ReviewSummaryRow = {
  state: ReviewState;
  mastery_score: number;
  content_type: string;
};

export type ReviewAggregatedStats = {
  totalCount: number;
  learningCount: number;
  masteredCount: number;
  weakAreas: Array<{ content_type: string; count: number }>;
};

class ReviewRepository {
  async listDue(userId: string, limit = 20): Promise<ReviewItemRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("review_items")
      .select("*")
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString())
      .order("next_review_at", { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []) as ReviewItemRow[];
  }

  async countDue(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("review_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString());

    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  async getAggregatedStats(userId: string): Promise<ReviewAggregatedStats> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_review_stats", {
      p_user_id: userId,
    });

    if (error) {
      return this.getAggregatedStatsFallback(userId);
    }

    const payload = data as {
      total_count: number;
      learning_count: number;
      mastered_count: number;
      weak_areas: Array<{ content_type: string; count: number }> | null;
    };

    return {
      totalCount: payload.total_count ?? 0,
      learningCount: payload.learning_count ?? 0,
      masteredCount: payload.mastered_count ?? 0,
      weakAreas: payload.weak_areas ?? [],
    };
  }

  private async getAggregatedStatsFallback(
    userId: string,
  ): Promise<ReviewAggregatedStats> {
    const rows = await this.listSummary(userId);
    const weakAreaCounts = new Map<string, number>();
    let learningCount = 0;
    let masteredCount = 0;

    for (const row of rows) {
      if (row.state === "learning" || row.state === "new") {
        learningCount += 1;
      }
      if (row.state === "mastered" || row.state === "legendary") {
        masteredCount += 1;
      }
      const isWeak =
        row.state === "learning" ||
        row.state === "new" ||
        row.mastery_score < 60;
      if (isWeak) {
        weakAreaCounts.set(
          row.content_type,
          (weakAreaCounts.get(row.content_type) ?? 0) + 1,
        );
      }
    }

    return {
      totalCount: rows.length,
      learningCount,
      masteredCount,
      weakAreas: Array.from(weakAreaCounts.entries()).map(
        ([content_type, count]) => ({ content_type, count }),
      ),
    };
  }

  async listSummary(userId: string): Promise<ReviewSummaryRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("review_items")
      .select("state, mastery_score, content_type")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as ReviewSummaryRow[];
  }

  async listRecentHistory(
    userId: string,
    limit = 5,
  ): Promise<Array<ReviewHistoryRow & { content_type: string; content_id: string }>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("review_history")
      .select(
        "id, user_id, review_item_id, rating, previous_state, new_state, mastery_score, interval_days, created_at, review_items!inner(content_type, content_id)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const joinedRaw = row.review_items as
        | { content_type: string; content_id: string }
        | Array<{ content_type: string; content_id: string }>;
      const joined = Array.isArray(joinedRaw) ? joinedRaw[0] : joinedRaw;
      if (!joined) {
        throw new Error("Review history row missing linked review item.");
      }
      return {
        id: row.id as string,
        user_id: row.user_id as string,
        review_item_id: row.review_item_id as string,
        rating: row.rating as ReviewRating,
        previous_state: row.previous_state as ReviewState,
        new_state: row.new_state as ReviewState,
        mastery_score: row.mastery_score as number,
        interval_days: row.interval_days as number,
        created_at: row.created_at as string,
        content_type: joined.content_type,
        content_id: joined.content_id,
      };
    });
  }

  async upsertReviewItemsBatch(
    userId: string,
    items: Array<{ contentType: string; contentId: string }>,
  ): Promise<void> {
    if (items.length === 0) return;

    const supabase = await createClient();
    const { error } = await supabase.from("review_items").upsert(
      items.map((item) => ({
        user_id: userId,
        content_type: item.contentType,
        content_id: item.contentId,
        state: "new",
        next_review_at: new Date().toISOString(),
        interval_days: 0,
        streak_count: 0,
      })),
      { onConflict: "user_id,content_type,content_id", ignoreDuplicates: true },
    );

    if (error) throw new Error(error.message);
  }

  async upsertReviewItem(
    userId: string,
    contentType: string,
    contentId: string,
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("review_items").upsert(
      {
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        state: "new",
        next_review_at: new Date().toISOString(),
        interval_days: 0,
        streak_count: 0,
      },
      { onConflict: "user_id,content_type,content_id", ignoreDuplicates: true },
    );

    if (error) throw new Error(error.message);
  }

  async upsertHiraganaItem(userId: string, contentId: string): Promise<void> {
    return this.upsertReviewItem(userId, "hiragana", contentId);
  }

  async upsertKatakanaItem(userId: string, contentId: string): Promise<void> {
    return this.upsertReviewItem(userId, "katakana", contentId);
  }

  async upsertVocabularyItem(userId: string, contentId: string): Promise<void> {
    return this.upsertReviewItem(userId, "vocabulary", contentId);
  }

  async upsertGrammarItem(userId: string, contentId: string): Promise<void> {
    return this.upsertReviewItem(userId, "grammar", contentId);
  }

  async upsertKanjiItem(userId: string, contentId: string): Promise<void> {
    return this.upsertReviewItem(userId, "kanji", contentId);
  }

  async submitRating(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
  ): Promise<ReviewItemRow> {
    const supabase = await createClient();

    const { data: current, error: currentError } = await supabase
      .from("review_items")
      .select("*")
      .eq("id", reviewItemId)
      .eq("user_id", userId)
      .maybeSingle();

    if (currentError) throw new Error(currentError.message);
    if (!current) throw new Error("Review item not found.");

    const item = current as ReviewItemRow;
    const schedule = applySrsRating({
      state: item.state,
      rating,
      masteryScore: item.mastery_score,
      streakCount: item.streak_count,
    });

    const { data, error } = await supabase
      .from("review_items")
      .update({
        state: schedule.state,
        next_review_at: schedule.nextReviewAt.toISOString(),
        review_count: item.review_count + 1,
        mastery_score: schedule.masteryScore,
        interval_days: schedule.intervalDays,
        streak_count: schedule.streakCount,
      })
      .eq("id", reviewItemId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const { error: historyError } = await supabase.from("review_history").insert({
      user_id: userId,
      review_item_id: reviewItemId,
      rating,
      previous_state: item.state,
      new_state: schedule.state,
      mastery_score: schedule.masteryScore,
      interval_days: schedule.intervalDays,
    });

    if (historyError) throw new Error(historyError.message);

    return data as ReviewItemRow;
  }
}

export const reviewRepository = new ReviewRepository();
