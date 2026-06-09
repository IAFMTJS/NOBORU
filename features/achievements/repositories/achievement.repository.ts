import { createClient } from "@/lib/supabase/server";

import type {
  AchievementInput,
  AchievementRow,
} from "@/features/achievements/types/achievement.types";

class AchievementRepository {
  async list(): Promise<AchievementRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as AchievementRow[];
  }

  async findById(id: string): Promise<AchievementRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as AchievementRow | null;
  }

  async create(input: AchievementInput): Promise<AchievementRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .insert({
        name: input.name.trim(),
        slug: input.slug.trim(),
        description: input.description?.trim() || null,
        rarity: input.rarity ?? "common",
        reward_type: input.rewardType?.trim() || null,
        reward_value: input.rewardValue ?? null,
        status: input.status ?? "draft",
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as AchievementRow;
  }

  async update(id: string, input: AchievementInput): Promise<AchievementRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .update({
        name: input.name.trim(),
        slug: input.slug.trim(),
        description: input.description?.trim() || null,
        rarity: input.rarity ?? "common",
        reward_type: input.rewardType?.trim() || null,
        reward_value: input.rewardValue ?? null,
        status: input.status ?? "draft",
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as AchievementRow;
  }

  async remove(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export const achievementRepository = new AchievementRepository();
