import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import type { RegionSlug } from "@/lib/design-system/regions";
import type {
  WorldMapRegionViewModel,
  WorldMapViewModel,
} from "@/features/world-map/types/world-map.types";

export function buildWorldMapViewModel(
  learningPath: LearningPathViewModel,
  currentRegionSlug: string,
): WorldMapViewModel {
  const regions: WorldMapRegionViewModel[] = learningPath.regions.map((region) => ({
    slug: region.slug as RegionSlug,
    name: region.name,
    progressPercent: region.progressPercent,
    availability:
      region.availability === "locked"
        ? "locked"
        : region.progressPercent >= 100
          ? "completed"
          : "available",
    href: `/learn/${region.slug}`,
  }));

  return { regions, currentRegionSlug };
}
