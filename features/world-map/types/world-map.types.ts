import type { RegionSlug } from "@/lib/design-system/region-tokens";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";

export type WorldMapRegionViewModel = {
  slug: RegionSlug;
  name: string;
  progressPercent: number;
  availability: "locked" | "available" | "completed";
  href: string;
};

export type WorldMapViewModel = {
  regions: WorldMapRegionViewModel[];
  currentRegionSlug: string;
};

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
