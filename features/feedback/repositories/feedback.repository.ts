import { createClient } from "@/lib/supabase/server";

import type {
  FeedbackRow,
  FeedbackStatus,
  SubmitFeedbackInput,
} from "@/features/feedback/types/feedback.types";

class FeedbackRepository {
  async create(input: {
    userId: string;
    category: SubmitFeedbackInput["category"];
    message: string;
    rating: number | null;
    route: string | null;
    context: Record<string, unknown> | null;
  }): Promise<FeedbackRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_feedback")
      .insert({
        user_id: input.userId,
        category: input.category,
        message: input.message,
        rating: input.rating,
        route: input.route,
        context: input.context,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as FeedbackRow;
  }

  async listRecent(limit = 100): Promise<FeedbackRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []) as FeedbackRow[];
  }

  async updateStatus(id: string, status: FeedbackStatus): Promise<FeedbackRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_feedback")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as FeedbackRow;
  }
}

export const feedbackRepository = new FeedbackRepository();
