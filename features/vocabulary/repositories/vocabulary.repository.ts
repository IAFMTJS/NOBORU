import { createClient } from "@/lib/supabase/server";

import type { JlptLevel } from "@/lib/content/types";
import type {
  VocabularyExampleRow,
  VocabularyInput,
  VocabularyListFilters,
  VocabularyRow,
} from "@/features/vocabulary/types/vocabulary.types";

class VocabularyRepository {
  async list(filters: VocabularyListFilters = {}): Promise<VocabularyRow[]> {
    const supabase = await createClient();
    let query = supabase
      .from("vocabulary")
      .select("*")
      .order("updated_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.jlptLevel) {
      query = query.eq("jlpt_level", filters.jlptLevel);
    }

    if (filters.search) {
      query = query.or(
        `kana.ilike.%${filters.search}%,meaning.ilike.%${filters.search}%,kanji.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as VocabularyRow[];
  }

  async listPublishedByJlpt(jlptLevel: JlptLevel): Promise<VocabularyRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("status", "published")
      .eq("jlpt_level", jlptLevel)
      .order("kana", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as VocabularyRow[];
  }

  async findById(id: string): Promise<VocabularyRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as VocabularyRow | null;
  }

  async listPublishedExamplesByVocabularyId(
    vocabularyId: string,
  ): Promise<VocabularyExampleRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary_examples")
      .select("*")
      .eq("vocabulary_id", vocabularyId)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as VocabularyExampleRow[];
  }

  async listLearnedVocabularyIds(userId: string): Promise<string[]> {
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
      .eq("content_type", "vocabulary");

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
      .eq("content_type", "vocabulary")
      .in("lesson_id", lessonIds);

    if (itemsError) throw new Error(itemsError.message);

    for (const item of items ?? []) {
      learned.add(item.content_id as string);
    }

    return Array.from(learned);
  }

  async create(input: Record<string, unknown>): Promise<VocabularyRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as VocabularyRow;
  }

  async update(
    id: string,
    input: Record<string, unknown>,
  ): Promise<VocabularyRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as VocabularyRow;
  }

  async remove(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("vocabulary").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export const vocabularyRepository = new VocabularyRepository();

function mapInputToRow(input: VocabularyInput): Record<string, unknown> {
  return {
    kanji: input.kanji?.trim() || null,
    kana: input.kana.trim(),
    meaning: input.meaning.trim(),
    part_of_speech: input.partOfSpeech?.trim() || null,
    jlpt_level: input.jlptLevel ?? null,
    frequency_rank: input.frequencyRank ?? null,
    difficulty: input.difficulty ?? 1,
    audio_url: input.audioUrl?.trim() || null,
    status: input.status ?? "draft",
  };
}

export { mapInputToRow as mapVocabularyInputToRow };
