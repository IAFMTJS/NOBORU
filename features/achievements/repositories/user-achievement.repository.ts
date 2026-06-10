import { createClient } from "@/lib/supabase/server";

import type {
  AchievementRow,
  UserAchievementRow,
} from "@/features/achievements/types/achievement.types";

export type UserAchievementWithDefinition = UserAchievementRow & {
  achievement: AchievementRow;
};

class UserAchievementRepository {
  async listUnlockedAchievementIds(userId: string): Promise<Set<string>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return new Set((data ?? []).map((row) => row.achievement_id as string));
  }

  async hasUnlocked(userId: string, achievementId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return Boolean(data);
  }

  async insertUnlock(
    userId: string,
    achievementId: string,
  ): Promise<UserAchievementRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserAchievementRow;
  }

  async listRecentWithDefinitions(
    userId: string,
    limit: number,
  ): Promise<UserAchievementWithDefinition[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*, achievement:achievements(*)")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as UserAchievementRow),
      achievement: (row as { achievement: AchievementRow }).achievement,
    }));
  }

  async listAllWithDefinitions(
    userId: string,
  ): Promise<UserAchievementWithDefinition[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*, achievement:achievements(*)")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      ...(row as UserAchievementRow),
      achievement: (row as { achievement: AchievementRow }).achievement,
    }));
  }
}

export const userAchievementRepository = new UserAchievementRepository();
