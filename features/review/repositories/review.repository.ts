import { createClient } from "@/lib/supabase/server";
import type { Json, SubmitReviewRatingRpcResult } from "@/lib/supabase/database.types";
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
  client_event_id?: string | null;
  gamification_applied_at?: string | null;
  gamification_result?: Record<string, unknown> | null;
};

export type SubmitRatingResult = {
  item: ReviewItemRow;
  alreadyApplied: boolean;
  historyId: string | null;
};

export type ReviewAggregatedStats = {
  totalCount: number;
  learningCount: number;
  masteredCount: number;
  dueCount: number;
  weakAreas: Array<{ content_type: string; count: number }>;
};

const REVIEW_ITEM_COLUMNS =
  "id, user_id, content_type, content_id, state, next_review_at, review_count, mastery_score, interval_days, streak_count, created_at, updated_at";

class ReviewRepository {
  async listDue(
    userId: string,
    limit = 20,
    options?: { contentType?: string; weakOnly?: boolean },
  ): Promise<ReviewItemRow[]> {
    const supabase = await createClient();
    let query = supabase
      .from("review_items")
      .select(REVIEW_ITEM_COLUMNS)
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString())
      .order("next_review_at", { ascending: true });

    if (options?.contentType) {
      query = query.eq("content_type", options.contentType);
    }

    if (options?.weakOnly) {
      query = query.or("state.in.(new,learning),mastery_score.lt.60");
    }

    const { data, error } = await query.limit(limit);

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
      console.error("get_review_stats RPC failed:", error.message);
      return {
        totalCount: 0,
        learningCount: 0,
        masteredCount: 0,
        dueCount: 0,
        weakAreas: [],
      };
    }

    const payload = data as {
      total_count: number;
      learning_count: number;
      mastered_count: number;
      due_count?: number;
      weak_areas: Array<{ content_type: string; count: number }> | null;
    };

    return {
      totalCount: payload.total_count ?? 0,
      learningCount: payload.learning_count ?? 0,
      masteredCount: payload.mastered_count ?? 0,
      dueCount: payload.due_count ?? 0,
      weakAreas: payload.weak_areas ?? [],
    };
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

  async seedKnownItemsBatch(
    userId: string,
    items: Array<{ contentType: string; contentId: string }>,
  ): Promise<void> {
    if (items.length === 0) return;

    const supabase = await createClient();
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + 30);

    const { error } = await supabase.from("review_items").upsert(
      items.map((item) => ({
        user_id: userId,
        content_type: item.contentType,
        content_id: item.contentId,
        state: "mastered",
        mastery_score: 90,
        next_review_at: nextReviewAt.toISOString(),
        interval_days: 30,
        streak_count: 3,
        review_count: 0,
      })),
      { onConflict: "user_id,content_type,content_id" },
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

  async listByContentIds(
    userId: string,
    contentType: string,
    contentIds: string[],
  ): Promise<ReviewItemRow[]> {
    if (contentIds.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("review_items")
      .select(REVIEW_ITEM_COLUMNS)
      .eq("user_id", userId)
      .eq("content_type", contentType)
      .in("content_id", contentIds);

    if (error) throw new Error(error.message);
    return (data ?? []) as ReviewItemRow[];
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

  async findHistoryByClientEventId(
    userId: string,
    clientEventId: string,
  ): Promise<(ReviewHistoryRow & { review_item_id: string }) | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("review_history")
      .select(
        "id, user_id, review_item_id, rating, previous_state, new_state, mastery_score, interval_days, created_at, client_event_id, gamification_applied_at, gamification_result",
      )
      .eq("user_id", userId)
      .eq("client_event_id", clientEventId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ReviewHistoryRow & { review_item_id: string }) ?? null;
  }

  async saveGamificationResult(
    userId: string,
    clientEventId: string,
    result: Record<string, unknown>,
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("review_history")
      .update({
        gamification_applied_at: new Date().toISOString(),
        gamification_result: result as Json,
      })
      .eq("user_id", userId)
      .eq("client_event_id", clientEventId)
      .is("gamification_applied_at", null);

    if (error) throw new Error(error.message);
  }

  async submitRating(
    userId: string,
    reviewItemId: string,
    rating: ReviewRating,
    clientEventId?: string,
  ): Promise<SubmitRatingResult> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_review_rating", {
      p_user_id: userId,
      p_review_item_id: reviewItemId,
      p_rating: rating,
      p_client_event_id: clientEventId ?? null,
    });

    if (error) throw new Error(error.message);

    const payload = data as SubmitReviewRatingRpcResult;

    return {
      item: payload.item as ReviewItemRow,
      alreadyApplied: payload.already_applied,
      historyId: payload.history_id,
    };
  }
}

export const reviewRepository = new ReviewRepository();
