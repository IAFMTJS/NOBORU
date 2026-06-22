import type { JlptLevel } from "@/lib/content/types";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

export function getJlptLevelForRegion(regionSlug: string): JlptLevel {
  return normalizeRegionSlug(regionSlug);
}
