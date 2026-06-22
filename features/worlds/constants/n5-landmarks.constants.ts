import type { JourneyLandmarkContent } from "@/features/journey/types/journey-content.types";

/**
 * Fallback N5 landmarks when CMS rows are not yet seeded.
 * Matches supabase/migrations/20260622140000_n5_landmarks_and_trial_copy.sql
 */
export const N5_LANDMARK_FALLBACKS: readonly Omit<
  JourneyLandmarkContent,
  "id" | "regionId"
>[] = [
  {
    slug: "ember-threshold",
    label: "Ember Threshold",
    subtitle: "灯の境 · Hi no Sakai",
    kind: "shrine",
    triggerAfterLessonCount: 1,
    pathPosition: 0.02,
    orderIndex: 0,
  },
  {
    slug: "script-sanctum",
    label: "Script Sanctum",
    subtitle: "文字の社 · Moji no Yashiro",
    kind: "shrine",
    triggerAfterLessonCount: 12,
    pathPosition: 0.12,
    orderIndex: 1,
  },
  {
    slug: "kana-bridge",
    label: "Kana Bridge",
    subtitle: "かな橋 · Kana-bashi",
    kind: "bridge",
    triggerAfterLessonCount: 28,
    pathPosition: 0.26,
    orderIndex: 2,
  },
  {
    slug: "lantern-hamlet",
    label: "Lantern Hamlet",
    subtitle: "灯里 · Tōri",
    kind: "village",
    triggerAfterLessonCount: 38,
    pathPosition: 0.38,
    orderIndex: 3,
  },
  {
    slug: "market-bend",
    label: "Market Bend",
    subtitle: "曲がり市 · Magari-ichi",
    kind: "village",
    triggerAfterLessonCount: 52,
    pathPosition: 0.5,
    orderIndex: 4,
  },
  {
    slug: "forest-torii",
    label: "Forest Torii",
    subtitle: "森の鳥居 · Mori no Torii",
    kind: "torii",
    triggerAfterLessonCount: 68,
    pathPosition: 0.62,
    orderIndex: 5,
  },
  {
    slug: "kanji-grove",
    label: "Kanji Grove",
    subtitle: "漢字の林 · Kanji no Hayashi",
    kind: "overlook",
    triggerAfterLessonCount: 78,
    pathPosition: 0.72,
    orderIndex: 6,
  },
  {
    slug: "first-slope-shrine",
    label: "First Slope Shrine",
    subtitle: "初坂の祠 · Hatsu-saka no Hokora",
    kind: "shrine",
    triggerAfterLessonCount: 92,
    pathPosition: 0.84,
    orderIndex: 7,
  },
] as const;

/** Resolve N5 landmark slug from journey node label (CMS or fallback). */
export function resolveN5LandmarkSlugByLabel(label: string): string | null {
  return N5_LANDMARK_FALLBACKS.find((landmark) => landmark.label === label)?.slug ?? null;
}

export function materializeN5LandmarkFallbacks(
  regionId: string,
): JourneyLandmarkContent[] {
  return N5_LANDMARK_FALLBACKS.map((landmark, index) => ({
    ...landmark,
    id: `n5-landmark-fallback-${index}`,
    regionId,
  }));
}
