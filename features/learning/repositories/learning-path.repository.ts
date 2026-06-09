import { createClient } from "@/lib/supabase/server";

import type { LessonItemRow } from "@/features/learning/types/lesson.types";
import type { UserProgressRow } from "@/features/learning/types/progress.types";
import type {
  LessonRow,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";

type RegionWithUnits = RegionRow & {
  units: Array<
    UnitRow & {
      lessons: LessonRow[];
    }
  >;
};

class LearningPathRepository {
  async listPublishedRegionsWithCurriculum(): Promise<RegionWithUnits[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .select(
        `
        *,
        units (
          *,
          lessons (*)
        )
      `,
      )
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);

    return ((data ?? []) as RegionWithUnits[]).map((region) => ({
      ...region,
      units: (region.units ?? [])
        .filter((unit) => unit.status === "published")
        .sort((a, b) => a.order_index - b.order_index)
        .map((unit) => ({
          ...unit,
          lessons: (unit.lessons ?? [])
            .filter((lesson) => lesson.status === "published")
            .sort((a, b) => a.title.localeCompare(b.title)),
        })),
    }));
  }

  async findPublishedRegionBySlug(slug: string): Promise<RegionWithUnits | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .select(
        `
        *,
        units (
          *,
          lessons (*)
        )
      `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const region = data as RegionWithUnits;
    return {
      ...region,
      units: (region.units ?? [])
        .filter((unit) => unit.status === "published")
        .sort((a, b) => a.order_index - b.order_index)
        .map((unit) => ({
          ...unit,
          lessons: (unit.lessons ?? [])
            .filter((lesson) => lesson.status === "published")
            .sort((a, b) => a.title.localeCompare(b.title)),
        })),
    };
  }

  async findPublishedLessonById(lessonId: string): Promise<
    | (LessonRow & {
        unit: UnitRow & { region: RegionRow };
      })
    | null
  > {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select(
        `
        *,
        unit:units (
          *,
          region:regions (*)
        )
      `,
      )
      .eq("id", lessonId)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return data as LessonRow & {
      unit: UnitRow & { region: RegionRow };
    };
  }

  async listLessonItems(lessonId: string): Promise<LessonItemRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lesson_items")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as LessonItemRow[];
  }
}

class ProgressRepository {
  async listByUserId(userId: string): Promise<UserProgressRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as UserProgressRow[];
  }

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserProgressRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as UserProgressRow | null;
  }

  async upsertInProgress(input: {
    userId: string;
    lessonId: string;
    regionId: string | null;
    unitId: string;
  }): Promise<UserProgressRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: input.userId,
          lesson_id: input.lessonId,
          region_id: input.regionId,
          unit_id: input.unitId,
          status: "in_progress",
        },
        { onConflict: "user_id,lesson_id" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserProgressRow;
  }

  async markCompleted(input: {
    userId: string;
    lessonId: string;
    score: number;
  }): Promise<UserProgressRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_progress")
      .update({
        status: "completed",
        score: input.score,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", input.userId)
      .eq("lesson_id", input.lessonId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserProgressRow;
  }
}

export const learningPathRepository = new LearningPathRepository();
export const progressRepository = new ProgressRepository();
