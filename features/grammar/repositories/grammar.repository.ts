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
  GrammarExampleRow,
  GrammarInput,
  GrammarRow,
} from "@/features/grammar/types/grammar.types";

class GrammarRepository {
  async list(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<GrammarRow>> {
    const { page, limit, offset } = normalizePagination(pagination);
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("grammar_points")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(error.message);
    return buildPaginatedResult(
      (data ?? []) as GrammarRow[],
      count ?? 0,
      page,
      limit,
    );
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

  async findByIds(ids: string[]): Promise<GrammarRow[]> {
    if (ids.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_points")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);
    return (data ?? []) as GrammarRow[];
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

  async listPublishedExamplesByGrammarIds(
    grammarIds: string[],
  ): Promise<GrammarExampleRow[]> {
    if (grammarIds.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grammar_examples")
      .select("*")
      .in("grammar_id", grammarIds)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as GrammarExampleRow[];
  }

  async listLearnedGrammarIds(userId: string): Promise<string[]> {
    return learnedContentRepository.getLearnedIdsByContentType(userId, "grammar");
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
