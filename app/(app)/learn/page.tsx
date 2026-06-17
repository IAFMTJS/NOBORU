import { JourneyScreen } from "@/features/journey/components/journey-screen";
import {
  findPlottedNode,
  plotJourneyNodesOnSkeleton,
} from "@/features/journey/utils/world-tree-layout.utils";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function LearnPage() {
  await requireAuthenticatedUserId();
  const { journey, profileStats } = await getJourneyPathWithContext();

  const currentRegion =
    journey.regions.find((region) => region.slug === journey.position.currentRegionSlug) ??
    journey.regions[0];

  const plotted = plotJourneyNodesOnSkeleton(journey);
  const focusNode = findPlottedNode(plotted, journey.position.currentNodeId);

  return (
    <JourneyScreen
      journey={journey}
      regionName={currentRegion?.name ?? "Foothills"}
      focusYPercent={focusNode?.yPercent ?? null}
      profileStats={profileStats}
    />
  );
}
