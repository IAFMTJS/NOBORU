import { JourneyScreen } from "@/features/journey/components/journey-screen";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import { resolveWorldTreeScrollFocus } from "@/features/journey/utils/world-tree-scroll-focus.utils";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

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
  const scrollFocus = resolveWorldTreeScrollFocus(journey, layout, {
    highlightNodeId: params.node ?? null,
    regionSlug: params.region ?? null,
  });

  return (
    <JourneyScreen
      journey={journey}
      regionName={currentRegion?.name ?? "Foothills"}
      focusYPercent={scrollFocus.focusYPercent}
      anchorScrollToBottom={scrollFocus.anchorScrollToBottom}
      highlightNodeId={scrollFocus.highlightNodeId}
      profileStats={profileStats}
    />
  );
}
