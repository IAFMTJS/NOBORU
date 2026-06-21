import { createClient } from "@/lib/supabase/server";
import { getPublishedRegionsWithCurriculum, getJourneyRegionsWithCurriculum } from "@/lib/cache/content-cache";

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
    return getPublishedRegionsWithCurriculum();
  }

  /** Published regions plus draft units/lessons for the World Tree journey canvas. */
  async listJourneyRegionsWithCurriculum(): Promise<RegionWithUnits[]> {
    return getJourneyRegionsWithCurriculum();
  }

  async findPublishedRegionBySlug(slug: string): Promise<RegionWithUnits | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("regions")
      .select(
        `
        id,
        slug,
        name,
        description,
        order_index,
        unlock_requirement,
        theme_id,
        status,
        created_at,
        updated_at,
        units (
          id,
          region_id,
          name,
          description,
          order_index,
          estimated_duration,
          status,
          created_at,
          updated_at,
          lessons (
            id,
            unit_id,
            type,
            title,
            description,
            order_index,
            difficulty,
            xp_reward,
            estimated_duration,
            checkpoint_activity_mix,
            status,
            created_at,
            updated_at
          )
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
            .sort((a, b) => a.order_index - b.order_index),
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

  async countPublishedLessons(): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    if (error) throw new Error(error.message);
    return count ?? 0;
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
