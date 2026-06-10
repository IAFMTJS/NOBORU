import { createClient } from "@/lib/supabase/server";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";
import {
  buildPaginatedResult,
  normalizePagination,
  type PaginationOptions,
  type PaginatedResult,
} from "@/lib/api/pagination";

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
  async list(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<KanjiRow>> {
    const { page, limit, offset } = normalizePagination(pagination);
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("kanji")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(error.message);
    return buildPaginatedResult(
      (data ?? []) as KanjiRow[],
      count ?? 0,
      page,
      limit,
    );
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

  async findByIds(ids: string[]): Promise<KanjiWithReadings[]> {
    if (ids.length === 0) return [];
    const supabase = await createClient();
    const { data: kanjiRows, error } = await supabase
      .from("kanji")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);
    if (!kanjiRows || kanjiRows.length === 0) return [];

    const { data: readings, error: readingsError } = await supabase
      .from("kanji_readings")
      .select("*")
      .in("kanji_id", ids);

    if (readingsError) throw new Error(readingsError.message);

    const readingsByKanji = new Map<string, KanjiReadingRow[]>();
    for (const reading of readings ?? []) {
      const kanjiId = (reading as KanjiReadingRow).kanji_id;
      const list = readingsByKanji.get(kanjiId) ?? [];
      list.push(reading as KanjiReadingRow);
      readingsByKanji.set(kanjiId, list);
    }

    return (kanjiRows as KanjiRow[]).map((kanji) => ({
      ...kanji,
      readings: readingsByKanji.get(kanji.id) ?? [],
    }));
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

  async listPublishedExamplesByKanjiIds(
    kanjiIds: string[],
  ): Promise<KanjiExampleRow[]> {
    if (kanjiIds.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kanji_examples")
      .select("*")
      .in("kanji_id", kanjiIds)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as KanjiExampleRow[];
  }

  async listLearnedKanjiIds(userId: string): Promise<string[]> {
    return learnedContentRepository.getLearnedIdsByContentType(userId, "kanji");
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
