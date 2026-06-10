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
  VocabularyExampleRow,
  VocabularyInput,
  VocabularyListFilters,
  VocabularyRow,
} from "@/features/vocabulary/types/vocabulary.types";

class VocabularyRepository {
  async list(
    filters: VocabularyListFilters = {},
  ): Promise<PaginatedResult<VocabularyRow>> {
    const { page, limit, offset } = normalizePagination({
      page: filters.page,
      limit: filters.limit,
    });
    const supabase = await createClient();
    let query = supabase
      .from("vocabulary")
      .select("*", { count: "exact" })
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

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return buildPaginatedResult(
      (data ?? []) as VocabularyRow[],
      count ?? 0,
      page,
      limit,
    );
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

  async findByIds(ids: string[]): Promise<VocabularyRow[]> {
    if (ids.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);
    return (data ?? []) as VocabularyRow[];
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

  async listPublishedExamplesByVocabularyIds(
    vocabularyIds: string[],
  ): Promise<VocabularyExampleRow[]> {
    if (vocabularyIds.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary_examples")
      .select("*")
      .in("vocabulary_id", vocabularyIds)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as VocabularyExampleRow[];
  }

  async listLearnedVocabularyIds(userId: string): Promise<string[]> {
    return learnedContentRepository.getLearnedIdsByContentType(
      userId,
      "vocabulary",
    );
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
