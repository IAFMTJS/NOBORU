import type { JourneyLandmarkContent } from "@/features/journey/types/journey-content.types";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

import { materializeN5LandmarkFallbacks } from "@/features/worlds/constants/n5-landmarks.constants";

/** CMS landmarks for a world, with N5 fallbacks when the table is empty. */
export function resolveWorldLandmarks(
  regionSlug: string,
  regionId: string,
  cmsLandmarks: JourneyLandmarkContent[],
): JourneyLandmarkContent[] {
  if (cmsLandmarks.length > 0) {
    return cmsLandmarks;
  }
  if (normalizeRegionSlug(regionSlug) === "n5") {
    return materializeN5LandmarkFallbacks(regionId);
  }
  return [];
}
