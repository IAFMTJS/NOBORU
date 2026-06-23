import { isBlueprintLessonId } from "@/features/journey/utils/journey-blueprint-merge.utils";
import { getPublishedRegionsWithCurriculum, getJourneyRegionsWithCurriculum } from "@/lib/cache/content-cache";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

import type { LessonItemRow } from "@/features/learning/types/lesson.types";
import type { UserProgressRow } from "@/features/learning/types/progress.types";
import type {
  LessonRow,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type LessonWithUnitRow = LessonRow & {
  unit: (UnitRow & { region: RegionRow | null }) | null;
};

type DbClient = SupabaseClient<Database>;

type RegionWithUnits = RegionRow & {
  units: Array<
    UnitRow & {
      lessons: LessonRow[];
    }
  >;
};

type ResolvedPublishedLesson = LessonRow & {
  unit: UnitRow & { region: RegionRow };
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

  private async queryPublishedLessonOnly(
    client: DbClient,
    lessonId: string,
  ): Promise<LessonRow | null> {
    const { data, error } = await client
      .from("lessons")
      .select(
        "id, unit_id, type, title, description, order_index, difficulty, xp_reward, estimated_duration, checkpoint_activity_mix, status, created_at, updated_at",
      )
      .eq("id", lessonId)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as LessonRow | null) ?? null;
  }

  private async queryPublishedLessonRow(
    client: DbClient,
    lessonId: string,
  ): Promise<LessonWithUnitRow | null> {
    const lesson = await this.queryPublishedLessonOnly(client, lessonId);
    if (!lesson) return null;

    const { data: unit, error: unitError } = await client
      .from("units")
      .select("*")
      .eq("id", lesson.unit_id)
      .maybeSingle();

    if (unitError) throw new Error(unitError.message);
    const unitRow = unit as UnitRow | null;
    if (!unitRow) {
      return { ...lesson, unit: null };
    }

    const { data: region, error: regionError } = await client
      .from("regions")
      .select("*")
      .eq("id", unitRow.region_id)
      .maybeSingle();

    if (regionError) throw new Error(regionError.message);

    return {
      ...lesson,
      unit: {
        ...unitRow,
        region: (region as RegionRow | null) ?? null,
      },
    };
  }

  private normalizeResolvedRegion(region: RegionRow): RegionRow {
    const worldSlug = normalizeRegionSlug(region.slug);
    if (worldSlug === region.slug) return region;

    return {
      ...region,
      slug: worldSlug,
    };
  }

  private resolvePublishedLessonShape(
    lesson: LessonRow,
    unit: UnitRow,
    region: RegionRow,
  ): ResolvedPublishedLesson {
    return {
      ...lesson,
      unit: {
        ...unit,
        region: this.normalizeResolvedRegion(region),
      },
    };
  }

  private findPublishedLessonInCurriculum(
    regions: RegionWithUnits[],
    lessonId: string,
  ): ResolvedPublishedLesson | null {
    for (const region of regions) {
      for (const unit of region.units) {
        const lesson = unit.lessons.find(
          (entry) => entry.id === lessonId && entry.status === "published",
        );
        if (!lesson) continue;

        return this.resolvePublishedLessonShape(lesson, unit, region);
      }
    }

    return null;
  }

  private async findPublishedLessonFromCurriculumCache(
    lessonId: string,
  ): Promise<ResolvedPublishedLesson | null> {
    const journeyMatch = this.findPublishedLessonInCurriculum(
      await getJourneyRegionsWithCurriculum(),
      lessonId,
    );
    if (journeyMatch) return journeyMatch;

    return this.findPublishedLessonInCurriculum(
      await getPublishedRegionsWithCurriculum(),
      lessonId,
    );
  }

  private async resolveLessonRegion(
    client: DbClient,
    lesson: LessonWithUnitRow,
  ): Promise<ResolvedPublishedLesson | null> {
    let unit = lesson.unit;
    if (!unit) {
      const { data, error } = await client
        .from("units")
        .select("*")
        .eq("id", lesson.unit_id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;
      unit = { ...(data as UnitRow), region: null };
    }

    let region = unit.region;
    if (!region?.slug) {
      const { data, error } = await client
        .from("regions")
        .select("*")
        .eq("id", unit.region_id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      region = (data as RegionRow | null) ?? null;
    }

    if (!region?.slug) return null;

    return this.resolvePublishedLessonShape(lesson, unit, region);
  }

  async findPublishedLessonById(lessonId: string): Promise<ResolvedPublishedLesson | null> {
    if (isBlueprintLessonId(lessonId)) return null;

    const clients: DbClient[] = [];
    if (isAdminClientConfigured()) {
      clients.push(createAdminClient());
    }
    clients.push(await createClient());

    for (const client of clients) {
      const lesson = await this.queryPublishedLessonRow(client, lessonId);
      if (!lesson) continue;

      const resolved = await this.resolveLessonRegion(client, lesson);
      if (resolved) return resolved;
    }

    return this.findPublishedLessonFromCurriculumCache(lessonId);
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
      .select(
        "id, lesson_id, content_type, content_id, order_index, created_at, updated_at",
      )
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
