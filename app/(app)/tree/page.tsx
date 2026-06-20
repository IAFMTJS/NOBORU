import { WorldTreeScreen } from "@/features/journey/components/world-tree-screen";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import { resolveWorldTreeScrollFocus } from "@/features/journey/utils/world-tree-scroll-focus.utils";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type TreePageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
    zone?: string;
  }>;
};

const WORLD_TREE_ZONE_IDS = new Set<string>([
  "deep_roots",
  "n5_roots",
  "n4_foothills",
  "n3_trunk_1",
  "n3_trunk_2",
  "n3_trunk_3",
  "n2_canopy",
  "n1_celestial",
]);

export default async function TreePage({ searchParams }: TreePageProps) {
  await requireAuthenticatedUserId();
  const params = await searchParams;
  const { journey, profileStats } = await getJourneyPathWithContext();

  const layout = buildWorldTreeLayout(journey);
  const zoneId =
    params.zone && WORLD_TREE_ZONE_IDS.has(params.zone)
      ? (params.zone as WorldTreeZoneId)
      : null;

  const scrollFocus = resolveWorldTreeScrollFocus(journey, layout, {
    highlightNodeId: params.node ?? null,
    regionSlug: params.region ?? null,
    zoneId,
  });

  return (
    <WorldTreeScreen
      journey={journey}
      regionName="World Tree"
      focusYPercent={scrollFocus.focusYPercent}
      focusZoneId={scrollFocus.focusZoneId}
      anchorScrollToBottom={scrollFocus.anchorScrollToBottom}
      highlightNodeId={scrollFocus.highlightNodeId}
      profileStats={profileStats}
    />
  );
}