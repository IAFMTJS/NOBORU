"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { EventTrailBranch } from "@/components/visual/world/event-trail-branch";
import { JourneyHud } from "@/features/journey/components/journey-hud";
import { JourneyWorldScroll } from "@/features/journey/components/journey-world-scroll";
import { RegionUnlockOverlay } from "@/features/journey/components/region-unlock-overlay";
import { useJourneyLessonSummary } from "@/features/journey/hooks/use-journey-lesson-summary";
import { getNarrativeArcForRegion } from "@/lib/design-system/narrative-regions";
import type { RegionSlug } from "@/lib/design-system/regions";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import { LessonNodeDetailSheet } from "@/features/learning/components/trail/lesson-node-detail-sheet";
import { RegionSelectSheet } from "@/features/learning/components/trail/region-select-sheet";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/types/trail.types";
import { seasonalEventService } from "@/features/events/services/seasonal-event.service";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import {
  resolveGlobalCurrentRegion,
} from "@/features/journey/utils/journey-world.utils";

type JourneyScreenProps = {
  journey: JourneyPathViewModel;
  profileStats?: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
  companionEvolutionSlug?: CompanionEvolutionSlug | null;
};

function toRegionSelectItems(
  regions: JourneyPathViewModel["regions"],
): RegionPathViewModel[] {
  return regions.map((region) => ({
    id: region.id,
    slug: region.slug,
    name: region.name,
    description: region.description,
    lessonCount: region.lessonCount,
    completedCount: region.completedCount,
    progressPercent: region.progressPercent,
    availability: region.availability,
    lockReason: region.lockReason,
    units: [],
  }));
}

function journeyNodeToTrailNode(node: JourneyNode): TrailNodeViewModel {
  return {
    id: node.lessonId ?? node.id,
    label: node.label,
    subtitle: node.subtitle,
    href: node.href,
    state: node.state,
    xpReward: node.xpReward ?? 0,
    nodeKind:
      node.kind === "trial"
        ? "application"
        : node.kind === "checkpoint"
          ? "checkpoint"
          : "lesson",
  };
}

function countLessonPosition(
  nodes: JourneyNode[],
  nodeId: string,
): { index: number; total: number } | null {
  const lessonNodes = nodes.filter(
    (node) => node.kind !== "landmark" && node.lessonId !== null,
  );
  const index = lessonNodes.findIndex((node) => node.id === nodeId);
  if (index === -1) return null;
  return { index: index + 1, total: lessonNodes.length };
}

export function JourneyScreen({
  journey,
  profileStats,
  companionEvolutionSlug,
}: JourneyScreenProps) {
  const searchParams = useSearchParams();
  const [regionsOverviewOpen, setRegionsOverviewOpen] = useState(false);
  const [scrollToRegionSlug, setScrollToRegionSlug] = useState<string | null>(
    () => searchParams?.get("region") ?? null,
  );
  const [scrollToNodeId, setScrollToNodeId] = useState<string | null>(
    () => searchParams?.get("node") ?? null,
  );
  const [unlockRegionName, setUnlockRegionName] = useState<string | null>(null);
  const [unlockRegionSlug, setUnlockRegionSlug] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);

  const currentRegion = resolveGlobalCurrentRegion(journey);
  const activeEvent = useMemo(() => seasonalEventService.getActiveEvent(), []);
  const regionSelectItems = useMemo(
    () => toRegionSelectItems(journey.regions),
    [journey.regions],
  );

  const selectedTrailNode = selectedNode ? journeyNodeToTrailNode(selectedNode) : null;
  const selectedNodeRegion = selectedNode
    ? journey.regions.find((region) =>
        region.nodes.some((node) => node.id === selectedNode.id),
      )
    : null;
  const selectedLessonPosition =
    selectedNodeRegion && selectedNode
      ? countLessonPosition(selectedNodeRegion.nodes, selectedNode.id)
      : null;

  const { lesson: selectedLessonSummary } = useJourneyLessonSummary(
    selectedNode?.lessonId ?? null,
    nodeDetailOpen,
  );

  const handleNodeSelect = (node: JourneyNode) => {
    setSelectedNode(node);
    setNodeDetailOpen(true);
  };

  const handleScrollToRegion = (slug: string) => {
    setScrollToRegionSlug(slug);
    setRegionsOverviewOpen(false);
    requestAnimationFrame(() => setScrollToRegionSlug(null));
  };

  useEffect(() => {
    if (!searchParams) return;
    const region = searchParams.get("region");
    const node = searchParams.get("node");
    const unlock = searchParams.get("unlock");
    if (region) setScrollToRegionSlug(region);
    if (node) setScrollToNodeId(node);
    if (unlock) {
      const region = journey.regions.find((entry) => entry.slug === unlock);
      setUnlockRegionName(region?.name ?? unlock);
      setUnlockRegionSlug(unlock);
      setScrollToRegionSlug(unlock);
    }
  }, [searchParams, journey.regions]);

  if (!currentRegion) {
    return (
      <YamaEmptyState
        surface="trail"
        title="Trail not ready"
        description="The trail ahead is still forming. Return to camp while the path is prepared."
        actionHref="/camp"
        actionLabel="Return to camp"
        className="p-4"
      />
    );
  }

  return (
    <>
      <div className="relative -mx-[max(0px,calc((100vw-100%)/2))] flex h-[calc(100dvh-5.5rem-env(safe-area-inset-bottom))] min-h-0 flex-col">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-background/70 to-transparent"
          aria-hidden
        />

        {profileStats ? (
          <JourneyHud
            displayName={profileStats.displayName}
            levelLabel={profileStats.levelLabel}
            regionName={currentRegion.name}
            onRegionOverview={() => setRegionsOverviewOpen(true)}
          />
        ) : (
          <header className="absolute inset-x-4 top-4 z-30 flex justify-center">
            <button
              type="button"
              onClick={() => setRegionsOverviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-body-sm font-medium text-white backdrop-blur-sm"
            >
              {currentRegion.name}
              <UiIconImage name="chevron_down" size={16} className="opacity-80" />
            </button>
          </header>
        )}

        <JourneyWorldScroll
          journey={journey}
          onNodeSelect={handleNodeSelect}
          companionEvolutionSlug={companionEvolutionSlug ?? undefined}
          scrollToRegionSlug={scrollToRegionSlug}
          scrollToNodeId={scrollToNodeId}
          selectedNodeId={nodeDetailOpen ? selectedNode?.id ?? null : null}
          className="min-h-0 flex-1"
        />

        <button
          type="button"
          aria-label="Region overview"
          onClick={() => setRegionsOverviewOpen(true)}
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-sm"
          title="Region overview"
        >
          <UiIconImage name="map" size={22} />
        </button>

        {activeEvent ? (
          <Link
            href="/world/events"
            className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-20 flex h-12 w-12 items-center justify-center"
            aria-label={`Seasonal event: ${activeEvent.title}`}
            title={activeEvent.title}
          >
            <EventTrailBranch />
          </Link>
        ) : null}
      </div>

      <RegionSelectSheet
        open={regionsOverviewOpen}
        onOpenChange={setRegionsOverviewOpen}
        regions={regionSelectItems}
        selectedSlug={currentRegion.slug}
        onSelectRegion={handleScrollToRegion}
        mode="overview"
      />

      <RegionUnlockOverlay
        regionName={unlockRegionName ?? ""}
        gateAsset={
          unlockRegionSlug
            ? getNarrativeArcForRegion(unlockRegionSlug as RegionSlug).gateIcon
            : undefined
        }
        open={Boolean(unlockRegionName)}
        onContinue={() => {
          setUnlockRegionName(null);
          setUnlockRegionSlug(null);
        }}
      />

      <LessonNodeDetailSheet
        open={nodeDetailOpen}
        onOpenChange={setNodeDetailOpen}
        node={selectedTrailNode}
        lesson={selectedLessonSummary}
        lessonNumber={selectedLessonPosition?.index ?? null}
        lessonCount={selectedLessonPosition?.total ?? selectedNodeRegion?.lessonCount ?? 0}
        regionName={selectedNodeRegion?.name ?? currentRegion.name}
      />
    </>
  );
}
