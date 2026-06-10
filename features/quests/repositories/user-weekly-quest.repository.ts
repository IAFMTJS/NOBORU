import { createClient } from "@/lib/supabase/server";

import type {
  QuestTemplateRow,
  UserWeeklyQuestRow,
  UserWeeklyQuestWithTemplate,
} from "@/features/quests/types/quest.types";

class UserWeeklyQuestRepository {
  async listForWeek(
    userId: string,
    weekStart: string,
  ): Promise<UserWeeklyQuestWithTemplate[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_weekly_quests")
      .select("*, template:quest_templates(*)")
      .eq("user_id", userId)
      .eq("week_start", weekStart)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as UserWeeklyQuestRow),
      template: (row as { template: QuestTemplateRow }).template,
    }));
  }

  async insertQuest(input: {
    userId: string;
    questTemplateId: string;
    weekStart: string;
    targetValue: number;
  }): Promise<UserWeeklyQuestRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_weekly_quests")
      .insert({
        user_id: input.userId,
        quest_template_id: input.questTemplateId,
        week_start: input.weekStart,
        target_value: input.targetValue,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserWeeklyQuestRow;
  }

  async updateProgress(input: {
    id: string;
    progress: number;
    completed: boolean;
    completedAt: string | null;
    epAwarded: number | null;
  }): Promise<UserWeeklyQuestRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_weekly_quests")
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
    return data as UserWeeklyQuestRow;
  }
}

export const userWeeklyQuestRepository = new UserWeeklyQuestRepository();
