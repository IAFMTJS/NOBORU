import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
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

async function fetchPublishedRegionsWithCurriculum(): Promise<RegionWithUnits[]> {
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
          .sort((a, b) => a.order_index - b.order_index),
      })),
  }));
}

async function fetchPublishedHiragana(): Promise<HiraganaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hiragana")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as HiraganaRow[];
}

async function fetchPublishedKatakana(): Promise<KatakanaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("katakana")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as KatakanaRow[];
}

async function fetchJourneyRegionsWithCurriculum(): Promise<RegionWithUnits[]> {
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
      .filter((unit) => unit.status === "published" || unit.status === "draft")
      .sort((a, b) => a.order_index - b.order_index)
      .map((unit) => ({
        ...unit,
        lessons: (unit.lessons ?? [])
          .filter(
            (lesson) => lesson.status === "published" || lesson.status === "draft",
          )
          .sort((a, b) => a.order_index - b.order_index),
      })),
  }));
}

/** Journey tree includes draft placeholder lessons for upcoming content. */
export const getJourneyRegionsWithCurriculum = cache(fetchJourneyRegionsWithCurriculum);

/** Request-scoped dedupe. Do not use unstable_cache here — it cannot access cookies(). */
export const getPublishedRegionsWithCurriculum = cache(
  fetchPublishedRegionsWithCurriculum,
);

export const getPublishedHiraganaChart = cache(fetchPublishedHiragana);

export const getPublishedKatakanaChart = cache(fetchPublishedKatakana);

export type { RegionWithUnits };
