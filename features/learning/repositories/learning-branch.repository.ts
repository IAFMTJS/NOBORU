import { createClient } from "@/lib/supabase/server";

import type {
  LearningBranchRow,
  LearningBranchWithCategory,
} from "@/features/learning/types/learning-branch.types";

class LearningBranchRepository {
  async listPublishedByRegionSlug(regionSlug: string): Promise<LearningBranchWithCategory[]> {
    const supabase = await createClient();
    const { data: region, error: regionError } = await supabase
      .from("regions")
      .select("id")
      .eq("slug", regionSlug)
      .maybeSingle();

    if (regionError) throw new Error(regionError.message);
    if (!region) return [];

    const { data, error } = await supabase
      .from("learning_branches")
      .select(
        `
        *,
        category:vocabulary_categories (
          id,
          slug,
          name
        )
      `,
      )
      .eq("region_id", region.id)
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const category = row.category as
        | { id: string; slug: string; name: string }
        | Array<{ id: string; slug: string; name: string }>
        | null;
      const resolvedCategory = Array.isArray(category) ? category[0] ?? null : category;

      return {
        ...(row as LearningBranchRow),
        category: resolvedCategory,
      };
    });
  }

  async findByUnitId(unitId: string): Promise<LearningBranchWithCategory | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("learning_branches")
      .select(
        `
        *,
        category:vocabulary_categories (
          id,
          slug,
          name
        )
      `,
      )
      .eq("unit_id", unitId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const category = data.category as
      | { id: string; slug: string; name: string }
      | Array<{ id: string; slug: string; name: string }>
      | null;
    const resolvedCategory = Array.isArray(category) ? category[0] ?? null : category;

    return {
      ...(data as LearningBranchRow),
      category: resolvedCategory,
    };
  }
}

export const learningBranchRepository = new LearningBranchRepository();
