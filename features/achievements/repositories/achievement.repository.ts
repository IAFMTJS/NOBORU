import { createClient } from "@/lib/supabase/server";
import {
  buildPaginatedResult,
  normalizePagination,
  type PaginationOptions,
  type PaginatedResult,
} from "@/lib/api/pagination";

import type {
  AchievementInput,
  AchievementRow,
} from "@/features/achievements/types/achievement.types";

class AchievementRepository {
  async list(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<AchievementRow>> {
    const { page, limit, offset } = normalizePagination(pagination);
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("achievements")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return buildPaginatedResult(
      (data ?? []) as AchievementRow[],
      count ?? 0,
      page,
      limit,
    );
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

  async findBySlug(slug: string): Promise<AchievementRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as AchievementRow | null;
  }

  async listPublished(): Promise<AchievementRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("status", "published")
      .order("rarity", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as AchievementRow[];
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
