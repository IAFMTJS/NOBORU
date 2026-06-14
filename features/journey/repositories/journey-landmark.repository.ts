import { createClient } from "@/lib/supabase/server";

import type {
  JourneyLandmarkContent,
  JourneyLandmarkRow,
} from "@/features/journey/types/journey-content.types";
import type { JourneyLandmarkKind } from "@/features/journey/types/journey.types";

function mapLandmarkRow(row: JourneyLandmarkRow): JourneyLandmarkContent {
  return {
    id: row.id,
    regionId: row.region_id,
    slug: row.slug,
    label: row.label,
    subtitle: row.subtitle,
    kind: row.kind as JourneyLandmarkKind,
    triggerAfterLessonCount: row.trigger_after_lesson_count,
    pathPosition: row.path_position,
    orderIndex: row.order_index,
  };
}

class JourneyLandmarkRepository {
  async listPublishedByRegionIds(
    regionIds: readonly string[],
  ): Promise<JourneyLandmarkContent[]> {
    if (regionIds.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("journey_landmarks")
      .select("*")
      .in("region_id", [...regionIds])
      .eq("status", "published")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return ((data ?? []) as JourneyLandmarkRow[]).map(mapLandmarkRow);
  }
}

export const journeyLandmarkRepository = new JourneyLandmarkRepository();
