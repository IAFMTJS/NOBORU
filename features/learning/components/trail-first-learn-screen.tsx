"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Map, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LessonNodeDetailSheet } from "@/features/learning/components/trail/lesson-node-detail-sheet";
import { RegionSelectSheet } from "@/features/learning/components/trail/region-select-sheet";
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import {
  findLessonInRegion,
  getLessonPositionInRegion,
} from "@/features/learning/utils/region-lesson";
import { flattenRegionTrailLessons } from "@/features/learning/utils/trail-state";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";
import { cn } from "@/lib/utils";

type TrailFirstLearnScreenProps = {
  path: LearningPathViewModel;
  initialRegionSlug: string;
};

function resolveInitialRegion(
  path: LearningPathViewModel,
  initialRegionSlug: string,
) {
  const preferred = path.regions.find((region) => region.slug === initialRegionSlug);
  if (preferred && preferred.availability !== "locked") {
    return preferred;
  }

  return (
    path.regions.find((region) => region.availability !== "locked") ??
    path.regions[0] ??
    null
  );
}

export function TrailFirstLearnScreen({
  path,
  initialRegionSlug,
}: TrailFirstLearnScreenProps) {
  const defaultRegion = resolveInitialRegion(path, initialRegionSlug);
  const [selectedSlug, setSelectedSlug] = useState(
    defaultRegion?.slug ?? initialRegionSlug,
  );
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [regionsOverviewOpen, setRegionsOverviewOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TrailNodeViewModel | null>(null);
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);

  const selectedRegion =
    path.regions.find((region) => region.slug === selectedSlug) ?? defaultRegion;

  const trailNodes = useMemo(() => {
    if (!selectedRegion) return [];
    return flattenRegionTrailLessons(selectedRegion.units, {
      regionLocked: selectedRegion.availability === "locked",
    });
  }, [selectedRegion]);

  const selectedLesson = selectedRegion && selectedNode
    ? findLessonInRegion(selectedRegion, selectedNode.id)
    : null;
  const selectedLessonPosition =
    selectedRegion && selectedNode
      ? getLessonPositionInRegion(selectedRegion, selectedNode.id)
      : null;

  const handleNodeSelect = (node: TrailNodeViewModel) => {
    setSelectedNode(node);
    setNodeDetailOpen(true);
  };

  if (!selectedRegion) {
    return (
      <div className="p-4">
        <p className="text-body-sm text-muted-foreground">
          No learning regions are available yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100dvh-6rem)] flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 px-4 pb-2 pt-4">
          <h1 className="text-heading-4">Learn</h1>
          <button
            type="button"
            onClick={() => setRegionPickerOpen(true)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-border/60",
              "bg-card/80 px-3 py-1.5 text-body-sm font-medium backdrop-blur-sm",
            )}
          >
            {selectedRegion.name}
            <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
          </button>
          <Button variant="ghost" size="icon" aria-label="Settings" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </header>

        <TrailMap
          nodes={trailNodes}
          minimal
          labelsBelow
          immersive
          onNodeSelect={handleNodeSelect}
          className="min-h-0 flex-1"
        />

        <button
          type="button"
          aria-label="View all regions"
          onClick={() => setRegionsOverviewOpen(true)}
          className={cn(
            "fixed bottom-[5.5rem] left-4 z-20 flex h-11 w-11 items-center justify-center",
            "rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md",
          )}
        >
          <Map className="h-5 w-5" aria-hidden />
        </button>

        <div
          className={cn(
            "fixed bottom-[5.5rem] right-4 z-20 rounded-full border border-white/10",
            "bg-black/50 px-3 py-1.5 text-caption text-white backdrop-blur-md",
          )}
        >
          {selectedRegion.completedCount}/{selectedRegion.lessonCount} lessons
        </div>
      </div>

      <RegionSelectSheet
        open={regionPickerOpen}
        onOpenChange={setRegionPickerOpen}
        regions={path.regions}
        selectedSlug={selectedSlug}
        onSelectRegion={setSelectedSlug}
        mode="picker"
      />

      <RegionSelectSheet
        open={regionsOverviewOpen}
        onOpenChange={setRegionsOverviewOpen}
        regions={path.regions}
        selectedSlug={selectedSlug}
        onSelectRegion={setSelectedSlug}
        mode="overview"
      />

      <LessonNodeDetailSheet
        open={nodeDetailOpen}
        onOpenChange={setNodeDetailOpen}
        node={selectedNode}
        lesson={selectedLesson}
        lessonNumber={selectedLessonPosition?.index ?? null}
        lessonCount={selectedLessonPosition?.total ?? selectedRegion.lessonCount}
        regionName={selectedRegion.name}
      />
    </>
  );
}
