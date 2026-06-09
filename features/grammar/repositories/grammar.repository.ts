import { createClient } from "@/lib/supabase/server";

import type { JlptLevel } from "@/lib/content/types";
import type {
  GrammarExampleRow,
  GrammarInput,
  GrammarRow,
} from "@/features/grammar/types/grammar.types";

class GrammarRepository {
  async list(): Promise<GrammarRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as GrammarRow[];
  }

  async listPublishedByJlpt(jlptLevel: JlptLevel): Promise<GrammarRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .select("*")
      .eq("status", "published")
      .eq("jlpt_level", jlptLevel)
      .order("title", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as GrammarRow[];
  }

  async findById(id: string): Promise<GrammarRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as GrammarRow | null;
  }

  async listPublishedExamplesByGrammarId(
    grammarId: string,
  ): Promise<GrammarExampleRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_examples")
      .select("*")
      .eq("grammar_id", grammarId)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as GrammarExampleRow[];
  }

  async listLearnedGrammarIds(userId: string): Promise<string[]> {
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
      .eq("content_type", "grammar");

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
      .eq("content_type", "grammar")
      .in("lesson_id", lessonIds);

    if (itemsError) throw new Error(itemsError.message);

    for (const item of items ?? []) {
      learned.add(item.content_id as string);
    }

    return Array.from(learned);
  }

  async create(input: GrammarInput): Promise<GrammarRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .insert({
        title: input.title.trim(),
        meaning: input.meaning.trim(),
        explanation: input.explanation?.trim() || null,
        jlpt_level: input.jlptLevel ?? null,
        difficulty: input.difficulty ?? 1,
        status: input.status ?? "draft",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as GrammarRow;
  }

  async update(id: string, input: GrammarInput): Promise<GrammarRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .update({
        title: input.title.trim(),
        meaning: input.meaning.trim(),
        explanation: input.explanation?.trim() || null,
        jlpt_level: input.jlptLevel ?? null,
        difficulty: input.difficulty ?? 1,
        status: input.status ?? "draft",
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as GrammarRow;
  }

  async remove(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("grammar_points").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export const grammarRepository = new GrammarRepository();
