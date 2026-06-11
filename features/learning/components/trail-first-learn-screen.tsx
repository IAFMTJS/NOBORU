"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Map } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { LessonNodeDetailSheet } from "@/features/learning/components/trail/lesson-node-detail-sheet";
import { RegionContinueFooter } from "@/features/learning/components/region-continue-footer";
import { RegionSelectSheet } from "@/features/learning/components/trail/region-select-sheet";
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import {
  findLessonInRegion,
  getLessonPositionInRegion,
  getNextLessonInRegion,
} from "@/features/learning/utils/region-lesson";
import { flattenRegionTrailLessons } from "@/features/learning/utils/trail-state";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";

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

  const nextLesson = selectedRegion ? getNextLessonInRegion(selectedRegion) : null;
  const selectedLesson = selectedRegion && selectedNode
    ? findLessonInRegion(selectedRegion, selectedNode.id)
    : null;
  const selectedLessonPosition =
    selectedRegion && selectedNode
      ? getLessonPositionInRegion(selectedRegion, selectedNode.id)
      : null;
  const regionVisuals = selectedRegion
    ? getRegionVisuals(selectedRegion.slug)
    : null;

  const handleNodeSelect = (node: TrailNodeViewModel) => {
    setSelectedNode(node);
    setNodeDetailOpen(true);
  };

  if (!selectedRegion) {
    return (
      <PageContainer>
        <p className="text-body-sm text-muted-foreground">
          No learning regions are available yet.
        </p>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer className="pb-28">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-heading-4">Learn</h1>
            <p className="text-caption text-muted-foreground">Current trail</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="View all regions"
              onClick={() => setRegionsOverviewOpen(true)}
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => setRegionPickerOpen(true)}
            >
              {selectedRegion.name}
              <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-body-sm font-medium">{selectedRegion.name}</p>
            {regionVisuals ? (
              <p className="text-caption text-muted-foreground">{regionVisuals.label}</p>
            ) : null}
          </div>
          <p className="text-caption text-muted-foreground">
            {selectedRegion.completedCount}/{selectedRegion.lessonCount} lessons
          </p>
        </div>

        <TrailMap
          nodes={trailNodes}
          minimal
          onNodeSelect={handleNodeSelect}
        />
      </PageContainer>

      {nextLesson ? (
        <RegionContinueFooter
          lessonTitle={nextLesson.title}
          href={nextLesson.href}
          className="fixed bottom-[4.5rem] left-0 right-0 mx-auto max-w-lg"
        />
      ) : null}

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
