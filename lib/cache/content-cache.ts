import { unstable_cache } from "next/cache";

import { createClientUncached } from "@/lib/supabase/create-client-uncached";
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
  const supabase = await createClientUncached();
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

async function fetchPublishedHiragana(): Promise<HiraganaRow[]> {
  const supabase = await createClientUncached();
  const { data, error } = await supabase
    .from("hiragana")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as HiraganaRow[];
}

async function fetchPublishedKatakana(): Promise<KatakanaRow[]> {
  const supabase = await createClientUncached();
  const { data, error } = await supabase
    .from("katakana")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as KatakanaRow[];
}

export const getPublishedRegionsWithCurriculum = unstable_cache(
  fetchPublishedRegionsWithCurriculum,
  ["published-regions-curriculum"],
  { revalidate: 3600, tags: ["published-curriculum"] },
);

export const getPublishedHiraganaChart = unstable_cache(
  fetchPublishedHiragana,
  ["published-hiragana-chart"],
  { revalidate: 3600, tags: ["published-hiragana"] },
);

export const getPublishedKatakanaChart = unstable_cache(
  fetchPublishedKatakana,
  ["published-katakana-chart"],
  { revalidate: 3600, tags: ["published-katakana"] },
);

export type { RegionWithUnits };
