import { createClient } from "@/lib/supabase/server";

import type {
  ElevationEventRow,
  LevelRewardRow,
  UserElevationRow,
} from "@/features/elevation/types/elevation.types";

class ElevationRepository {
  async ensureElevation(userId: string): Promise<UserElevationRow> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_elevation")
      .insert({ user_id: userId })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserElevationRow;
  }

  async findByUserId(userId: string): Promise<UserElevationRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_elevation")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserElevationRow | null) ?? null;
  }

  async updateElevation(input: {
    userId: string;
    currentLevel: number;
    currentEp: number;
    totalEp: number;
  }): Promise<UserElevationRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_elevation")
      .update({
        current_level: input.currentLevel,
        current_ep: input.currentEp,
        total_ep: input.totalEp,
      })
      .eq("user_id", input.userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserElevationRow;
  }

  async insertEvent(input: {
    userId: string;
    sourceType: string;
    sourceId: string | null;
    epAmount: number;
    description: string;
  }): Promise<ElevationEventRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("elevation_events")
      .insert({
        user_id: input.userId,
        source_type: input.sourceType,
        source_id: input.sourceId,
        ep_amount: input.epAmount,
        description: input.description,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ElevationEventRow;
  }

  async listRecentEvents(userId: string, limit = 5): Promise<ElevationEventRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("elevation_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []) as ElevationEventRow[];
  }

  async findRewardForLevel(level: number): Promise<LevelRewardRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("level", level)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as LevelRewardRow | null) ?? null;
  }

  async listRewardsUpToLevel(level: number): Promise<LevelRewardRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("status", "published")
      .lte("level", level)
      .order("level", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as LevelRewardRow[];
  }

  async findNextRewardAboveLevel(level: number): Promise<LevelRewardRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("status", "published")
      .gt("level", level)
      .order("level", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as LevelRewardRow | null) ?? null;
  }
}

export const elevationRepository = new ElevationRepository();
