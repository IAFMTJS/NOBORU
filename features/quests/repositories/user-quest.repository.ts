import { createClient } from "@/lib/supabase/server";

import type {
  QuestTemplateRow,
  UserDailyQuestRow,
  UserDailyQuestWithTemplate,
} from "@/features/quests/types/quest.types";

class UserQuestRepository {
  async listForDate(
    userId: string,
    questDate: string,
  ): Promise<UserDailyQuestWithTemplate[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_quests")
      .select("*, template:quest_templates(*)")
      .eq("user_id", userId)
      .eq("quest_date", questDate)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as UserDailyQuestRow),
      template: (row as { template: QuestTemplateRow }).template,
    }));
  }

  async insertQuest(input: {
    userId: string;
    questTemplateId: string;
    questDate: string;
    targetValue: number;
  }): Promise<UserDailyQuestRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_quests")
      .insert({
        user_id: input.userId,
        quest_template_id: input.questTemplateId,
        quest_date: input.questDate,
        target_value: input.targetValue,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserDailyQuestRow;
  }

  async updateProgress(input: {
    id: string;
    progress: number;
    completed: boolean;
    completedAt: string | null;
    epAwarded: number | null;
  }): Promise<UserDailyQuestRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_daily_quests")
      .update({
        progress: input.progress,
        completed: input.completed,
        completed_at: input.completedAt,
        ep_awarded: input.epAwarded,
      })
      .eq("id", input.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserDailyQuestRow;
  }
}

export const userQuestRepository = new UserQuestRepository();
