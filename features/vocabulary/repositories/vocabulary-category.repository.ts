import { createClient } from "@/lib/supabase/server";

import type { VocabularyCategoryRow } from "@/features/vocabulary/types/vocabulary-category.types";

class VocabularyCategoryRepository {
  async listPublished(): Promise<VocabularyCategoryRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary_categories")
      .select("*")
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as VocabularyCategoryRow[];
  }

  async findBySlug(slug: string): Promise<VocabularyCategoryRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary_categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as VocabularyCategoryRow) ?? null;
  }

  async listCategoryIdsForVocabulary(vocabularyId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary_category_assignments")
      .select("category_id")
      .eq("vocabulary_id", vocabularyId);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => row.category_id as string);
  }
}

export const vocabularyCategoryRepository = new VocabularyCategoryRepository();
