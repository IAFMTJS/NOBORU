import { createClient } from "@/lib/supabase/server";

import type { QuestPeriod } from "@/features/quests/constants/quest.constants";
import type { QuestTemplateRow } from "@/features/quests/types/quest.types";

class QuestTemplateRepository {
  async listByPeriod(period: QuestPeriod): Promise<QuestTemplateRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quest_templates")
      .select("*")
      .eq("status", "published")
      .eq("period", period)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as QuestTemplateRow[];
  }

  async listDailyTemplates(): Promise<QuestTemplateRow[]> {
    return this.listByPeriod("daily");
  }

  async listWeeklyTemplates(): Promise<QuestTemplateRow[]> {
    return this.listByPeriod("weekly");
  }

  async findBySlug(slug: string): Promise<QuestTemplateRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quest_templates")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as QuestTemplateRow | null;
  }
}

export const questTemplateRepository = new QuestTemplateRepository();
