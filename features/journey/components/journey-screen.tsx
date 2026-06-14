"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Map, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TRAIL_MAP_IMMERSIVE_HEADER_SCRIM_CLASS } from "@/lib/assets/image-presentation";
import { JourneyWorldScroll } from "@/features/journey/components/journey-world-scroll";
import { ClimbElevationIndicator } from "@/features/learning/components/trail/climb-elevation-indicator";
import { LessonNodeDetailSheet } from "@/features/learning/components/trail/lesson-node-detail-sheet";
import { RegionSelectSheet } from "@/features/learning/components/trail/region-select-sheet";
import { useJourneyLessonSummary } from "@/features/journey/hooks/use-journey-lesson-summary";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/types/trail.types";
import { regionTrailHref } from "@/features/learning/utils/trail-navigation";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";
import { glassClass, resolveVisualTier } from "@/lib/performance/visual-tier";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";

type JourneyScreenProps = {
  journey: JourneyPathViewModel;
  initialRegionSlug: string;
  trials?: TrialListEntryViewModel[];
  companionEvolutionSlug?: CompanionEvolutionSlug;
  soundEnabled?: boolean;
};

function resolveRegionTrial(
  trials: TrialListEntryViewModel[],
  regionSlug: string,
): { href: string; title: string } | null {
  const trial = trials.find(
    (entry) =>
      entry.regionSlug === regionSlug &&
      entry.availability === "available" &&
      !entry.progress?.passed,
  );
  return trial ? { href: `/trials/${trial.slug}`, title: trial.title } : null;
}

function resolveInitialRegion(
  journey: JourneyPathViewModel,
  initialRegionSlug: string,
) {
  const preferred = journey.regions.find((region) => region.slug === initialRegionSlug);
  if (preferred) {
    return preferred;
  }

  return (
    journey.regions.find((region) => region.availability !== "locked") ??
    journey.regions[0] ??
    null
  );
}

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

function resolveActiveRegion(
  journey: JourneyPathViewModel,
  selectedSlug: string,
): JourneyRegionViewModel | null {
  return (
    journey.regions.find((region) => region.slug === selectedSlug) ??
    journey.regions.find(
      (region) => region.slug === journey.position.currentRegionSlug,
    ) ??
    journey.regions[0] ??
    null
  );
}

export function JourneyScreen({
  journey,
  initialRegionSlug,
  trials = [],
  companionEvolutionSlug,
  soundEnabled = true,
}: JourneyScreenProps) {
  const router = useRouter();
  const defaultRegion = resolveInitialRegion(journey, initialRegionSlug);
  const [selectedSlug, setSelectedSlug] = useState(
    defaultRegion?.slug ?? initialRegionSlug,
  );
  const [focusRegionSlug, setFocusRegionSlug] = useState<string | null>(null);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [regionsOverviewOpen, setRegionsOverviewOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);
  const [selectedNodeRegion, setSelectedNodeRegion] =
    useState<JourneyRegionViewModel | null>(null);
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);
  const visualTier = resolveVisualTier();
  const headerGlass = glassClass(visualTier);

  const activeRegion = resolveActiveRegion(journey, selectedSlug);

  useEffect(() => {
    const resolved = resolveInitialRegion(journey, initialRegionSlug);
    if (resolved?.slug) {
      setSelectedSlug(resolved.slug);
    }
  }, [initialRegionSlug, journey]);

  useEffect(() => {
    if (!selectedSlug || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("region") !== selectedSlug) {
      router.replace(regionTrailHref(selectedSlug), { scroll: false });
    }
  }, [router, selectedSlug]);

  const regionTrial = activeRegion
    ? resolveRegionTrial(trials, activeRegion.slug)
    : null;

  const regionSelectItems = useMemo(
    () => toRegionSelectItems(journey.regions),
    [journey.regions],
  );

  const selectedTrailNode = selectedNode ? journeyNodeToTrailNode(selectedNode) : null;
  const selectedLessonPosition =
    selectedNodeRegion && selectedNode
      ? countLessonPosition(selectedNodeRegion.nodes, selectedNode.id)
      : null;

  const { lesson: selectedLessonSummary } = useJourneyLessonSummary(
    selectedNode?.lessonId ?? null,
    nodeDetailOpen,
  );

  const handleNodeSelect = (
    node: JourneyNode,
    region: JourneyRegionViewModel,
  ) => {
    setSelectedNode(node);
    setSelectedNodeRegion(region);
    setNodeDetailOpen(true);
  };

  const handleSelectRegion = (slug: string) => {
    setSelectedSlug(slug);
    setFocusRegionSlug(slug);
  };

  const totalLessons = journey.regions.reduce(
    (sum, region) => sum + region.lessonCount,
    0,
  );
  const totalCompleted = journey.regions.reduce(
    (sum, region) => sum + region.completedCount,
    0,
  );

  if (!activeRegion) {
    return (
      <YamaEmptyState
        surface="trail"
        title="Trail not ready"
        description="No learning regions are available yet. Check back soon or explore other areas."
        actionHref="/camp"
        actionLabel="Return home"
        className="p-4"
      />
    );
  }

  return (
    <>
      <div className="relative -mx-[max(0px,calc((100vw-100%)/2))] flex h-[calc(100dvh-6rem)] min-h-0 flex-col">
        <div className={TRAIL_MAP_IMMERSIVE_HEADER_SCRIM_CLASS} aria-hidden />

        <header className="absolute inset-x-0 top-0 z-30 flex shrink-0 items-center justify-between gap-2 px-4 pb-2 pt-4">
          <h1 className="text-heading-4 text-foreground">Learn</h1>
          <button
            type="button"
            onClick={() => setRegionPickerOpen(true)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-body-sm font-medium text-white",
              headerGlass,
            )}
          >
            {activeRegion.name}
            <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="text-foreground hover:bg-black/20 hover:text-foreground"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </header>

        <JourneyWorldScroll
          journey={journey}
          focusRegionSlug={focusRegionSlug}
          trialHref={regionTrial?.href ?? null}
          trialTitle={regionTrial?.title ?? null}
          companionEvolutionSlug={companionEvolutionSlug}
          soundEnabled={soundEnabled}
          onNodeSelect={handleNodeSelect}
          className="min-h-0 flex-1"
        />

        <ClimbElevationIndicator
          completedCount={activeRegion.completedCount}
          lessonCount={activeRegion.lessonCount}
        />

        <Link
          href="/learn/world"
          aria-label="View mountain world map"
          className={cn(
            "fixed bottom-[5.5rem] left-4 z-20 flex h-11 w-11 items-center justify-center",
            "rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md",
          )}
        >
          <Map className="h-5 w-5" aria-hidden />
        </Link>

        <div
          className={cn(
            "fixed bottom-[5.5rem] right-4 z-20 rounded-full border border-white/10",
            "bg-black/50 px-3 py-1.5 text-caption text-white backdrop-blur-md",
          )}
        >
          {totalCompleted}/{totalLessons} lessons
        </div>
      </div>

      <RegionSelectSheet
        open={regionPickerOpen}
        onOpenChange={setRegionPickerOpen}
        regions={regionSelectItems}
        selectedSlug={selectedSlug}
        onSelectRegion={handleSelectRegion}
        mode="picker"
      />

      <RegionSelectSheet
        open={regionsOverviewOpen}
        onOpenChange={setRegionsOverviewOpen}
        regions={regionSelectItems}
        selectedSlug={selectedSlug}
        onSelectRegion={handleSelectRegion}
        mode="overview"
      />

      <LessonNodeDetailSheet
        open={nodeDetailOpen}
        onOpenChange={setNodeDetailOpen}
        node={selectedTrailNode}
        lesson={selectedLessonSummary}
        lessonNumber={selectedLessonPosition?.index ?? null}
        lessonCount={
          selectedLessonPosition?.total ?? selectedNodeRegion?.lessonCount ?? 0
        }
        regionName={selectedNodeRegion?.name ?? activeRegion.name}
      />
    </>
  );
}
