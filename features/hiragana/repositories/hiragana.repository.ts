import { createClient } from "@/lib/supabase/server";
import { getPublishedHiraganaChart } from "@/lib/cache/content-cache";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";

import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";

class HiraganaRepository {
  async listPublished(): Promise<HiraganaRow[]> {
    return getPublishedHiraganaChart();
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

  async findByIds(ids: string[]): Promise<HiraganaRow[]> {
    if (ids.length === 0) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hiragana")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);
    return (data ?? []) as HiraganaRow[];
  }

  async listLearnedHiraganaIds(userId: string): Promise<string[]> {
    return learnedContentRepository.getLearnedIdsByContentType(userId, "hiragana");
  }
}

export const hiraganaRepository = new HiraganaRepository();
