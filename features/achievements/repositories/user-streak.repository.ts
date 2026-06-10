import { createClient } from "@/lib/supabase/server";

import type { UserStreakRow } from "@/features/achievements/types/achievement.types";

class UserStreakRepository {
  async findByUserId(userId: string): Promise<UserStreakRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as UserStreakRow | null;
  }

  async upsertStreak(input: {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
  }): Promise<UserStreakRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_streaks")
      .upsert(
        {
          user_id: input.userId,
          current_streak: input.currentStreak,
          longest_streak: input.longestStreak,
          last_study_date: input.lastStudyDate,
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserStreakRow;
  }
}

export const userStreakRepository = new UserStreakRepository();
