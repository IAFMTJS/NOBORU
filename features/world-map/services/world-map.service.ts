import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { regionTrailHref } from "@/features/learning/utils/trail-navigation";
import { REGION_SLUGS, type RegionSlug } from "@/lib/design-system/regions";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { getWorldJourneySpine } from "@/lib/design-system/journey-path-contracts";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";
import type {
  WorldMapRegionAvailability,
  WorldMapRegionViewModel,
  WorldMapViewModel,
} from "@/features/world-map/types/world-map.types";

function resolveRegionAvailability(
  slug: RegionSlug,
  journeyRegion: { availability: "available" | "locked"; progressPercent: number } | null,
): WorldMapRegionAvailability {
  if (!journeyRegion || journeyRegion.availability === "locked") return "locked";
  if (journeyRegion.progressPercent >= 100) return "completed";
  return "available";
}

export function buildWorldMapViewModel(
  journey: JourneyPathViewModel,
  passedTrialSlugs: ReadonlySet<string> = new Set(),
): WorldMapViewModel {
  const currentRegionSlug = normalizeRegionSlug(journey.position.currentRegionSlug);
  const worldSpine = getWorldJourneySpine("dark");
  const journeyBySlug = new Map(
    journey.regions.map((region) => [normalizeRegionSlug(region.slug), region]),
  );

  const regions: WorldMapRegionViewModel[] = REGION_SLUGS.map((slug, index) => {
    const journeyRegion = journeyBySlug.get(slug);
    const access = resolveRegionAccess(slug, passedTrialSlugs);
    const visuals = getRegionVisuals(slug);
    const spineIndex =
      REGION_SLUGS.length <= 1
        ? 0
        : Math.round((index / (REGION_SLUGS.length - 1)) * (worldSpine.length - 1));
    const spatial = worldSpine[spineIndex] ?? { x: 50, y: 50 };

    const progressPercent = journeyRegion?.progressPercent ?? 0;
    const availability =
      access.availability === "locked"
        ? "locked"
        : resolveRegionAvailability(slug, journeyRegion ?? null);

    return {
      slug,
      name: journeyRegion?.name ?? visuals.label,
      progressPercent,
      availability,
      isCurrent: slug === currentRegionSlug,
      href: slug === "n5" || availability !== "locked" ? regionTrailHref(slug) : "/tree",
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
