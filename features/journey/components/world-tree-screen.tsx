"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { JourneyHud } from "@/features/journey/components/journey-hud";
import { JourneyWorldCanvas } from "@/features/journey/components/journey-world-canvas";
import type { JourneyWorldCanvasHandle } from "@/features/journey/components/journey-world-canvas";
import { WorldTreeMapFab } from "@/features/journey/components/world-tree-map-fab";
import { WorldTreeRegionLegend } from "@/features/journey/components/world-tree-region-legend";
import { WorldTreeScrollRail } from "@/features/journey/components/world-tree-scroll-rail";
import {
  REGION_SLUG_TO_WORLD_TREE_ZONE,
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import {
  buildWorldTreeLayout,
  buildWorldTreeZoneBands,
  findPlottedNode,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { RegionSlug } from "@/lib/design-system/regions";
import { cn } from "@/lib/utils";

type WorldTreeScreenProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  focusYPercent?: number | null;
  anchorScrollToBottom?: boolean;
  highlightNodeId?: string | null;
  focusZoneId?: WorldTreeZoneId | null;
  profileStats?: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
};

function resolveZoneLabel(regionSlug: string): string | null {
  const zoneId = REGION_SLUG_TO_WORLD_TREE_ZONE[regionSlug as RegionSlug];
  if (!zoneId) return null;
  return WORLD_TREE_SKELETON_ZONES.find((zone) => zone.id === zoneId)?.label ?? null;
}

function countTotalNodes(journey: JourneyPathViewModel): number {
  return journey.regions.reduce((sum, region) => sum + region.nodes.length, 0);
}

function resolveZoneFromY(yPercent: number): WorldTreeZoneId {
  const bands = buildWorldTreeZoneBands();
  let match: WorldTreeZoneId = "deep_roots";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const zone of WORLD_TREE_SKELETON_ZONES) {
    const band = bands[zone.id];
    const center = (band.yMin + band.yMax) / 2;
    const distance = Math.abs(center - yPercent);
    if (distance < bestDistance) {
      bestDistance = distance;
      match = zone.id;
    }
  }

  return match;
}

/** Full World Tree overview — all zones, nodes, and ascent structure (skeleton until art ships). */
export function WorldTreeScreen({
  journey,
  regionName,
  focusYPercent = null,
  anchorScrollToBottom = false,
  highlightNodeId = null,
  focusZoneId = null,
  profileStats,
}: WorldTreeScreenProps) {
  const canvasRef = useRef<JourneyWorldCanvasHandle>(null);
  const layout = useMemo(() => buildWorldTreeLayout(journey), [journey]);
  const [activeZoneId, setActiveZoneId] = useState<WorldTreeZoneId | null>(focusZoneId);

  const resolvedZoneLabel =
    activeZoneId != null
      ? (WORLD_TREE_SKELETON_ZONES.find((zone) => zone.id === activeZoneId)?.label ?? null)
      : resolveZoneLabel(journey.position.currentRegionSlug);

  const totalNodes = countTotalNodes(journey);
  const continueHref =
    journey.nextLessonHref ??
    (journey.position.currentNodeId
      ? `/learn?node=${encodeURIComponent(journey.position.currentNodeId)}`
      : "/learn");

  const handleZoneSelect = useCallback((_zoneId: WorldTreeZoneId, centerYPercent: number) => {
    setActiveZoneId(_zoneId);
    canvasRef.current?.scrollToYPercent(centerYPercent);
  }, []);

  const handleViewportYChange = useCallback((yPercent: number) => {
    setActiveZoneId((current) => {
      const next = resolveZoneFromY(yPercent);
      return current === next ? current : next;
    });
  }, []);

  return (
    <div className="relative h-content min-h-0 overflow-hidden bg-[#E9E1D0] dark:bg-[#0D1320] isolate">
      <JourneyWorldCanvas
        ref={canvasRef}
        className="absolute inset-0"
        journey={journey}
        regionName={regionName}
        layout={layout}
        variant="overview"
        focusYPercent={focusYPercent}
        anchorScrollToBottom={anchorScrollToBottom}
        highlightNodeId={highlightNodeId}
        onViewportCenterYChange={handleViewportYChange}
      />

      <WorldTreeRegionLegend journey={journey} />

      <WorldTreeScrollRail
        activeZoneId={activeZoneId ?? focusZoneId}
        onZoneSelect={handleZoneSelect}
      />

      <WorldTreeMapFab href={continueHref} label="Continue climb" />

      <p
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-[calc(var(--nav-clearance)+3.75rem)] z-20",
          "text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#6B5344]/45 dark:text-[#D6A85F]/35",
        )}
      >
        Scroll to explore the World Tree
      </p>

      {profileStats ? (
        <JourneyHud
          displayName={profileStats.displayName}
          levelLabel={profileStats.levelLabel}
          regionName="World Tree"
          zoneLabel={resolvedZoneLabel ?? "Full ascent"}
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

export { findPlottedNode, buildWorldTreeLayout };
