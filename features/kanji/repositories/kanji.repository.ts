import { createClient } from "@/lib/supabase/server";

import type { JlptLevel } from "@/lib/content/types";
import type {
  KanjiExampleRow,
  KanjiInput,
  KanjiReadingRow,
  KanjiRow,
  KanjiWithReadings,
} from "@/features/kanji/types/kanji.types";

function splitReadings(value?: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,、\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

class KanjiRepository {
  async list(): Promise<KanjiRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as KanjiRow[];
  }

  async listPublishedByJlpt(jlptLevel: JlptLevel): Promise<KanjiRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji")
      .select("*")
      .eq("status", "published")
      .eq("jlpt_level", jlptLevel)
      .order("character", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as KanjiRow[];
  }

  async findById(id: string): Promise<KanjiWithReadings | null> {
    const supabase = await createClient();
    const { data: kanji, error } = await supabase
      .from("kanji")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!kanji) return null;

    const { data: readings, error: readingsError } = await supabase
      .from("kanji_readings")
      .select("*")
      .eq("kanji_id", id);
    if (readingsError) throw new Error(readingsError.message);

    return {
      ...(kanji as KanjiRow),
      readings: (readings ?? []) as KanjiReadingRow[],
    };
  }

  async listPublishedExamplesByKanjiId(
    kanjiId: string,
  ): Promise<KanjiExampleRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji_examples")
      .select("*")
      .eq("kanji_id", kanjiId)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as KanjiExampleRow[];
  }

  async listLearnedKanjiIds(userId: string): Promise<string[]> {
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
      .eq("content_type", "kanji");

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
      .eq("content_type", "kanji")
      .in("lesson_id", lessonIds);

    if (itemsError) throw new Error(itemsError.message);

    for (const item of items ?? []) {
      learned.add(item.content_id as string);
    }

    return Array.from(learned);
  }

  private async syncReadings(
    kanjiId: string,
    onyomi: string[],
    kunyomi: string[],
  ) {
    const supabase = await createClient();
    const { error: deleteError } = await supabase
      .from("kanji_readings")
      .delete()
      .eq("kanji_id", kanjiId);
    if (deleteError) throw new Error(deleteError.message);

    const rows = [
      ...onyomi.map((reading) => ({
        kanji_id: kanjiId,
        reading,
        reading_type: "onyomi" as const,
      })),
      ...kunyomi.map((reading) => ({
        kanji_id: kanjiId,
        reading,
        reading_type: "kunyomi" as const,
      })),
    ];

    if (rows.length === 0) return;

    const { error } = await supabase.from("kanji_readings").insert(rows);
    if (error) throw new Error(error.message);
  }

  async create(input: KanjiInput): Promise<KanjiRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji")
      .insert({
        character: input.character.trim(),
        meaning: input.meaning.trim(),
        jlpt_level: input.jlptLevel ?? null,
        grade_level: input.gradeLevel ?? null,
        frequency_rank: input.frequencyRank ?? null,
        stroke_count: input.strokeCount ?? null,
        status: input.status ?? "draft",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await this.syncReadings(
      data.id,
      splitReadings(input.onyomi),
      splitReadings(input.kunyomi),
    );

    return data as KanjiRow;
  }

  async update(id: string, input: KanjiInput): Promise<KanjiRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji")
      .update({
        character: input.character.trim(),
        meaning: input.meaning.trim(),
        jlpt_level: input.jlptLevel ?? null,
        grade_level: input.gradeLevel ?? null,
        frequency_rank: input.frequencyRank ?? null,
        stroke_count: input.strokeCount ?? null,
        status: input.status ?? "draft",
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await this.syncReadings(
      id,
      splitReadings(input.onyomi),
      splitReadings(input.kunyomi),
    );

    return data as KanjiRow;
  }

  async remove(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("kanji").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export const kanjiRepository = new KanjiRepository();
