import { createClient } from "@/lib/supabase/server";

import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";

class HiraganaRepository {
  async listPublished(): Promise<HiraganaRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hiragana")
      .select("*")
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as HiraganaRow[];
  }

  async findById(id: string): Promise<HiraganaRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hiragana")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as HiraganaRow | null;
  }

  async listLearnedHiraganaIds(userId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (progressError) throw new Error(progressError.message);

    const lessonIds = (progress ?? []).map((row) => row.lesson_id as string);
    const learned = new Set<string>();

    const { data: reviewRows, error: reviewError } = await supabase
      .from("review_items")
      .select("content_id")
      .eq("user_id", userId)
      .eq("content_type", "hiragana");

    if (reviewError) throw new Error(reviewError.message);

    for (const row of reviewRows ?? []) {
      learned.add(row.content_id as string);
    }

    if (lessonIds.length === 0) {
      return Array.from(learned);
    }

    const { data: items, error: itemsError } = await supabase
      .from("lesson_items")
      .select("content_id")
      .eq("content_type", "hiragana")
      .in("lesson_id", lessonIds);

    if (itemsError) throw new Error(itemsError.message);

    for (const item of items ?? []) {
      learned.add(item.content_id as string);
    }

    return Array.from(learned);
  }
}

export const hiraganaRepository = new HiraganaRepository();
