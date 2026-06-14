import type { JourneyPathViewModel } from "@/features/learning/types/journey.types";
import { regionTrailHref } from "@/features/learning/utils/trail-navigation";
import type { RegionSlug } from "@/lib/design-system/regions";
import { getWorldJourneySpine } from "@/lib/design-system/journey-path-contracts";
import type {
  WorldMapRegionAvailability,
  WorldMapRegionViewModel,
  WorldMapViewModel,
} from "@/features/world-map/types/world-map.types";

function resolveRegionAvailability(
  availability: "available" | "locked",
  progressPercent: number,
): WorldMapRegionAvailability {
  if (availability === "locked") return "locked";
  if (progressPercent >= 100) return "completed";
  return "available";
}

export function buildWorldMapViewModel(
  journey: JourneyPathViewModel,
): WorldMapViewModel {
  const currentRegionSlug = journey.position.currentRegionSlug;
  const worldSpine = getWorldJourneySpine("dark");

  const regions: WorldMapRegionViewModel[] = journey.regions.map((region, index, all) => {
    const spineIndex =
      all.length <= 1
        ? 0
        : Math.round((index / (all.length - 1)) * (worldSpine.length - 1));
    const spatial = worldSpine[spineIndex] ?? { x: 50, y: 50 };

    return {
      slug: region.slug as RegionSlug,
      name: region.name,
      progressPercent: region.progressPercent,
      availability: resolveRegionAvailability(
        region.availability,
        region.progressPercent,
      ),
      isCurrent: region.slug === currentRegionSlug,
      href: regionTrailHref(region.slug),
      position: {
        x: spatial.x,
        y: spatial.y,
      },
    };
  });

  const returnTrailHref =
    journey.nextLessonHref ?? regionTrailHref(currentRegionSlug);

  return {
    regions,
    currentRegionSlug,
    returnTrailHref,
  };
}
