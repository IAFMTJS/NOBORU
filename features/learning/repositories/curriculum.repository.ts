import { createClient } from "@/lib/supabase/server";

import type {
  LessonInput,
  LessonRow,
  RegionInput,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";

class CurriculumRepository {
  async listRegions(): Promise<RegionRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as RegionRow[];
  }

  async findRegionById(id: string): Promise<RegionRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as RegionRow | null;
  }

  async createRegion(input: RegionInput): Promise<RegionRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .insert({
        slug: input.slug.trim(),
        name: input.name.trim(),
        description: input.description?.trim() || null,
        order_index: input.orderIndex ?? 0,
        unlock_requirement: input.unlockRequirement?.trim() || null,
        theme_id: input.themeId?.trim() || null,
        status: input.status ?? "draft",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as RegionRow;
  }

  async updateRegion(id: string, input: RegionInput): Promise<RegionRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .update({
        slug: input.slug.trim(),
        name: input.name.trim(),
        description: input.description?.trim() || null,
        order_index: input.orderIndex ?? 0,
        unlock_requirement: input.unlockRequirement?.trim() || null,
        theme_id: input.themeId?.trim() || null,
        status: input.status ?? "draft",
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as RegionRow;
  }

  async removeRegion(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("regions").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async listUnits(): Promise<UnitRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as UnitRow[];
  }

  async listLessons(): Promise<LessonRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as LessonRow[];
  }

  async findLessonById(id: string): Promise<LessonRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as LessonRow | null;
  }

  async createLesson(input: LessonInput): Promise<LessonRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        unit_id: input.unitId,
        type: input.type?.trim() || "mixed",
        title: input.title.trim(),
        description: input.description?.trim() || null,
        difficulty: input.difficulty ?? 1,
        xp_reward: input.xpReward ?? 0,
        estimated_duration: input.estimatedDuration ?? null,
        status: input.status ?? "draft",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as LessonRow;
  }

  async updateLesson(id: string, input: LessonInput): Promise<LessonRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .update({
        unit_id: input.unitId,
        type: input.type?.trim() || "mixed",
        title: input.title.trim(),
        description: input.description?.trim() || null,
        difficulty: input.difficulty ?? 1,
        xp_reward: input.xpReward ?? 0,
        estimated_duration: input.estimatedDuration ?? null,
        status: input.status ?? "draft",
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as LessonRow;
  }

  async removeLesson(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export const curriculumRepository = new CurriculumRepository();
