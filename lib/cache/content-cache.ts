import { unstable_cache } from "next/cache";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import type {
  LessonRow,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";
import type { HiraganaRow } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaRow } from "@/features/katakana/types/katakana.types";

type RegionWithUnits = RegionRow & {
  units: Array<
    UnitRow & {
      lessons: LessonRow[];
    }
  >;
};

const REGION_CURRICULUM_SELECT = `
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
`;

function mapRegionWithUnits(
  data: RegionWithUnits[],
  includeDraftUnits: boolean,
): RegionWithUnits[] {
  const allowedUnitStatus = includeDraftUnits
    ? new Set(["published", "draft"])
    : new Set(["published"]);
  const allowedLessonStatus = includeDraftUnits
    ? new Set(["published", "draft"])
    : new Set(["published"]);

  return data.map((region) => ({
    ...region,
    units: (region.units ?? [])
      .filter((unit) => allowedUnitStatus.has(unit.status))
      .sort((a, b) => a.order_index - b.order_index)
      .map((unit) => ({
        ...unit,
        lessons: (unit.lessons ?? [])
          .filter((lesson) => allowedLessonStatus.has(lesson.status))
          .sort((a, b) => a.order_index - b.order_index),
      })),
  }));
}

async function fetchRegionsWithCurriculumFromUserClient(
  includeDraftUnits: boolean,
): Promise<RegionWithUnits[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_CURRICULUM_SELECT)
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return mapRegionWithUnits((data ?? []) as RegionWithUnits[], includeDraftUnits);
}

async function fetchRegionsWithCurriculumFromAdmin(
  includeDraftUnits: boolean,
): Promise<RegionWithUnits[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_CURRICULUM_SELECT)
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return mapRegionWithUnits((data ?? []) as RegionWithUnits[], includeDraftUnits);
}

async function fetchPublishedRegionsUncached(): Promise<RegionWithUnits[]> {
  if (isAdminClientConfigured()) {
    return fetchRegionsWithCurriculumFromAdmin(false);
  }
  return fetchRegionsWithCurriculumFromUserClient(false);
}

async function fetchJourneyRegionsUncached(): Promise<RegionWithUnits[]> {
  if (isAdminClientConfigured()) {
    return fetchRegionsWithCurriculumFromAdmin(true);
  }
  return fetchRegionsWithCurriculumFromUserClient(true);
}

const getPublishedRegionsCrossRequest = unstable_cache(
  fetchPublishedRegionsUncached,
  ["published-regions-curriculum"],
  { tags: ["published-curriculum"], revalidate: 3600 },
);

const getJourneyRegionsCrossRequest = unstable_cache(
  fetchJourneyRegionsUncached,
  ["journey-regions-curriculum"],
  { tags: ["published-curriculum"], revalidate: 3600 },
);

async function fetchPublishedHiragana(): Promise<HiraganaRow[]> {
  const supabase = isAdminClientConfigured()
    ? createAdminClient()
    : await createClient();
  const { data, error } = await supabase
    .from("hiragana")
    .select(
      "id, character, romaji, row_name, row_label, order_index, variant_type, status, created_at, updated_at",
    )
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as HiraganaRow[];
}

async function fetchPublishedKatakana(): Promise<KatakanaRow[]> {
  const supabase = isAdminClientConfigured()
    ? createAdminClient()
    : await createClient();
  const { data, error } = await supabase
    .from("katakana")
    .select(
      "id, character, romaji, row_name, row_label, order_index, variant_type, status, created_at, updated_at",
    )
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as KatakanaRow[];
}

const getPublishedHiraganaCrossRequest = unstable_cache(
  fetchPublishedHiragana,
  ["published-hiragana-chart"],
  { tags: ["published-hiragana"], revalidate: 3600 },
);

const getPublishedKatakanaCrossRequest = unstable_cache(
  fetchPublishedKatakana,
  ["published-katakana-chart"],
  { tags: ["published-katakana"], revalidate: 3600 },
);

/** Journey tree includes draft placeholder lessons for upcoming content. */
export const getJourneyRegionsWithCurriculum = cache(async () =>
  getJourneyRegionsCrossRequest(),
);

/** Request-scoped dedupe layered on cross-request published curriculum cache. */
export const getPublishedRegionsWithCurriculum = cache(async () =>
  getPublishedRegionsCrossRequest(),
);

export const getPublishedHiraganaChart = cache(async () =>
  getPublishedHiraganaCrossRequest(),
);

export const getPublishedKatakanaChart = cache(async () =>
  getPublishedKatakanaCrossRequest(),
);

export type { RegionWithUnits };
