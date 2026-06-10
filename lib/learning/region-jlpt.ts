import type { JlptLevel } from "@/lib/content/types";

const REGION_JLPT: Record<string, JlptLevel> = {
  "mount-n4": "n4",
  "mount-n5": "n5",
};

export function getJlptLevelForRegion(regionSlug: string): JlptLevel {
  return REGION_JLPT[regionSlug] ?? "n5";
}
