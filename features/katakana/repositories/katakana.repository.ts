import { createClient } from "@/lib/supabase/server";
import { getPublishedKatakanaChart } from "@/lib/cache/content-cache";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";

import type { KatakanaRow } from "@/features/katakana/types/katakana.types";

class KatakanaRepository {
  async listPublished(): Promise<KatakanaRow[]> {
    return getPublishedKatakanaChart();
  }

  async findById(id: string): Promise<KatakanaRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("katakana")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as KatakanaRow | null;
  }

  async findByIds(ids: string[]): Promise<KatakanaRow[]> {
    if (ids.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("katakana")
      .select(
        "id, character, romaji, row_name, row_label, order_index, variant_type, status, created_at, updated_at",
      )
      .in("id", ids);

    if (error) throw new Error(error.message);
    return (data ?? []) as KatakanaRow[];
  }

  async listLearnedKatakanaIds(userId: string): Promise<string[]> {
    return learnedContentRepository.getLearnedIdsByContentType(userId, "katakana");
  }
}

export const katakanaRepository = new KatakanaRepository();
