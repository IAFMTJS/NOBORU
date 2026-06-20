"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { JourneyHud } from "@/features/journey/components/journey-hud";
import { JourneyWorldCanvas } from "@/features/journey/components/journey-world-canvas";
import type { JourneyWorldCanvasHandle } from "@/features/journey/components/journey-world-canvas";
import { WorldTreeJlptLegend } from "@/features/journey/components/world-tree-jlpt-legend";
import { WorldTreeJlptScrollRail } from "@/features/journey/components/world-tree-jlpt-scroll-rail";
import { WorldTreeMapFab } from "@/features/journey/components/world-tree-map-fab";
import {
  resolveJlptBandForRegion,
  resolveJlptBandFromY,
  resolveJlptBandLabel,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeScreenProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  focusYPercent?: number | null;
  anchorScrollToBottom?: boolean;
  highlightNodeId?: string | null;
  focusJlptBandId?: WorldTreeJlptBandId | null;
  profileStats?: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
  /** Flatten scroll — full canvas height for screenshot export. */
  exportMode?: boolean;
};

function countTotalNodes(journey: JourneyPathViewModel): number {
  return journey.regions.reduce((sum, region) => sum + region.nodes.length, 0);
}

/** Full World Tree overview — JLPT bands, transparent art, trail, and nodes. */
export function WorldTreeScreen({
  journey,
  regionName,
  focusYPercent = null,
  anchorScrollToBottom = false,
  highlightNodeId = null,
  focusJlptBandId = null,
  profileStats,
  exportMode = false,
}: WorldTreeScreenProps) {
  const canvasRef = useRef<JourneyWorldCanvasHandle>(null);
  const layout = useMemo(() => buildWorldTreeLayout(journey), [journey]);
  const [activeJlptBandId, setActiveJlptBandId] = useState<WorldTreeJlptBandId | null>(
    focusJlptBandId,
  );

  const resolvedJlptLabel = resolveJlptBandLabel(
    activeJlptBandId ??
      focusJlptBandId ??
      resolveJlptBandForRegion(journey.position.currentRegionSlug) ??
      "n5",
  );

  const totalNodes = countTotalNodes(journey);
  const continueHref =
    journey.nextLessonHref ??
    (journey.position.currentNodeId
      ? `/learn?node=${encodeURIComponent(journey.position.currentNodeId)}`
      : "/learn");

  const handleBandSelect = useCallback((_bandId: WorldTreeJlptBandId, centerYPercent: number) => {
    setActiveJlptBandId(_bandId);
    canvasRef.current?.scrollToYPercent(centerYPercent);
  }, []);

  const handleViewportYChange = useCallback((yPercent: number) => {
    setActiveJlptBandId((current) => {
      const next = resolveJlptBandFromY(yPercent);
      return current === next ? current : next;
    });
  }, []);

  return (
    <div
      className={cn(
        "relative isolate bg-[#E9E1D0] dark:bg-[#0D1320]",
        exportMode ? "min-h-0" : "h-content min-h-0 overflow-hidden",
      )}
      data-world-tree-export={exportMode ? "true" : undefined}
    >
      <JourneyWorldCanvas
        ref={canvasRef}
        className={exportMode ? "relative" : "absolute inset-0"}
        journey={journey}
        regionName={regionName}
        layout={layout}
        variant="overview"
        focusYPercent={focusYPercent}
        anchorScrollToBottom={anchorScrollToBottom}
        highlightNodeId={highlightNodeId}
        exportMode={exportMode}
        onViewportCenterYChange={exportMode ? undefined : handleViewportYChange}
      />

      {exportMode ? null : (
        <>
          <WorldTreeJlptLegend journey={journey} />

          <WorldTreeJlptScrollRail
            activeBandId={activeJlptBandId ?? focusJlptBandId}
            onBandSelect={handleBandSelect}
          />

          <WorldTreeMapFab href={continueHref} label="Continue climb" />

          <p
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-[calc(var(--nav-clearance)+3.75rem)] z-20",
              "text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#6B5344]/45 dark:text-[#D6A85F]/35",
            )}
          >
            Scroll the World Tree · N5 at the roots → N1 at the crown
          </p>
        </>
      )}

      {profileStats && !exportMode ? (
        <JourneyHud
          displayName={profileStats.displayName}
          levelLabel={profileStats.levelLabel}
          regionName="World Tree"
          zoneLabel={resolvedJlptLabel}
          globalNodeIndex={journey.position.globalNodeIndex}
          totalNodes={totalNodes}
          currentStreak={profileStats.currentStreak}
          totalXp={profileStats.totalXp}
          onRegionOverview={() => undefined}
          treeOverviewHref={null}
        />
      ) : null}
    </div>
  );
}
