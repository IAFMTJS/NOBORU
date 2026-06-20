import { JourneyScreen } from "@/features/journey/components/journey-screen";
import {
  REGION_SLUG_TO_WORLD_TREE_ZONE,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  buildWorldTreeLayout,
  findPlottedNode,
  findZoneBandCenterY,
} from "@/features/journey/utils/world-tree-layout.utils";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import type { RegionSlug } from "@/lib/design-system/regions";

type LearnPageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
  }>;
};

export default async function LearnPage({ searchParams }: LearnPageProps) {
  await requireAuthenticatedUserId();
  const params = await searchParams;
  const { journey, profileStats } = await getJourneyPathWithContext();

  const currentRegion =
    journey.regions.find((region) => region.slug === journey.position.currentRegionSlug) ??
    journey.regions[0];

  const layout = buildWorldTreeLayout(journey);

  let focusYPercent: number | null = null;
  let anchorScrollToBottom = false;
  const highlightNodeId = params.node ?? null;

  if (highlightNodeId) {
    focusYPercent = findPlottedNode(layout.nodes, highlightNodeId)?.yPercent ?? null;
  } else if (params.region) {
    const zoneId = REGION_SLUG_TO_WORLD_TREE_ZONE[params.region as RegionSlug];
    if (zoneId) {
      focusYPercent = findZoneBandCenterY(zoneId);
    }
  } else {
    focusYPercent =
      findPlottedNode(layout.nodes, journey.position.currentNodeId)?.yPercent ?? null;
    anchorScrollToBottom = journey.position.globalNodeIndex === 0;
  }

  return (
    <JourneyScreen
      journey={journey}
      regionName={currentRegion?.name ?? "Foothills"}
      focusYPercent={focusYPercent}
      anchorScrollToBottom={anchorScrollToBottom}
      highlightNodeId={highlightNodeId}
      profileStats={profileStats}
    />
  );
}
