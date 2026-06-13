import { createClient } from "@/lib/supabase/server";

import type { LevelRewardRow } from "@/features/elevation/types/elevation.types";

class TitleRepository {
  async listUnlockedTitles(userId: string): Promise<LevelRewardRow[]> {
    const supabase = await createClient();
    const { data: elevation } = await supabase
      .from("user_elevation")
      .select("current_level")
      .eq("user_id", userId)
      .maybeSingle();

    const level = (elevation as { current_level: number } | null)?.current_level ?? 1;

    const { data, error } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("reward_type", "title")
      .lte("level", level)
      .eq("status", "published")
      .order("level");

    if (error) throw new Error(error.message);
    return (data as LevelRewardRow[]) ?? [];
  }

  async getEquippedTitleId(userId: string): Promise<string | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("title_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as { title_id: string | null } | null)?.title_id ?? null;
  }

  async setEquippedTitle(userId: string, titleId: string | null): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ title_id: titleId })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  }

  async findTitleById(id: string): Promise<LevelRewardRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as LevelRewardRow | null) ?? null;
  }
}

export const titleRepository = new TitleRepository();
