import { WorldTreeScreen } from "@/features/journey/components/world-tree-screen";
import { isWorldTreeJlptBandId } from "@/features/journey/constants/world-tree-jlpt-band.constants";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import { resolveWorldTreeScrollFocus } from "@/features/journey/utils/world-tree-scroll-focus.utils";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";

type TreePageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
    zone?: string;
    jlpt?: string;
  }>;
};

/** Tree tab — full N5→N1 World Tree overview with art stack and every major region. */
export default async function TreePage({ searchParams }: TreePageProps) {
  const params = await searchParams;
  const { journey, currentRegionSlug, profileStats } = await getJourneyPathWithContext();
  const layout = buildWorldTreeLayout(journey);

  const scrollFocus = resolveWorldTreeScrollFocus(journey, layout, {
    highlightNodeId: params.node ?? null,
    regionSlug: params.region ?? null,
    zoneId: (params.zone as WorldTreeZoneId | undefined) ?? null,
    jlptBandId:
      params.jlpt && isWorldTreeJlptBandId(params.jlpt) ? params.jlpt : null,
  });

  const currentRegion =
    journey.regions.find((region) => region.slug === currentRegionSlug) ??
    journey.regions[0];

  return (
    <WorldTreeScreen
      journey={journey}
      regionName={currentRegion?.name ?? "World Tree"}
      focusYPercent={scrollFocus.focusYPercent}
      anchorScrollToBottom={scrollFocus.anchorScrollToBottom}
      highlightNodeId={scrollFocus.highlightNodeId}
      focusJlptBandId={scrollFocus.focusJlptBandId}
      profileStats={profileStats}
    />
  );
}
