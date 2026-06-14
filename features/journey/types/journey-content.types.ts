import type { JourneyLandmarkKind } from "@/features/journey/types/journey.types";

export type JourneyLandmarkRow = {
  id: string;
  region_id: string;
  slug: string;
  label: string;
  subtitle: string | null;
  kind: JourneyLandmarkKind;
  trigger_after_lesson_count: number;
  path_position: number | null;
  order_index: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type JourneyLandmarkContent = {
  id: string;
  regionId: string;
  slug: string;
  label: string;
  subtitle: string | null;
  kind: JourneyLandmarkKind;
  triggerAfterLessonCount: number;
  pathPosition: number | null;
  orderIndex: number;
};
