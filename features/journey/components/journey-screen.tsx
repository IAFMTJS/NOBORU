"use client";

import { JourneyHud } from "@/features/journey/components/journey-hud";
import { JourneyWorldCanvas } from "@/features/journey/components/journey-world-canvas";
import {
  REGION_SLUG_TO_WORLD_TREE_ZONE,
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import type { RegionSlug } from "@/lib/design-system/regions";

type JourneyScreenProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  zoneLabel?: string | null;
  focusYPercent?: number | null;
  anchorScrollToBottom?: boolean;
  highlightNodeId?: string | null;
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

/** Journey tab — World Tree ascent canvas with HUD overlay. */
export function JourneyScreen({
  journey,
  regionName,
  zoneLabel = null,
  focusYPercent = null,
  anchorScrollToBottom = false,
  highlightNodeId = null,
  profileStats,
}: JourneyScreenProps) {
  const resolvedZoneLabel =
    zoneLabel ?? resolveZoneLabel(journey.position.currentRegionSlug);
  const totalNodes = countTotalNodes(journey);

  return (
    <div className="relative h-content min-h-0 overflow-hidden bg-[#E9E1D0] dark:bg-[#0D1320] isolate">
      <JourneyWorldCanvas
        className="absolute inset-0"
        journey={journey}
        regionName={regionName}
        focusYPercent={focusYPercent}
        anchorScrollToBottom={anchorScrollToBottom}
        highlightNodeId={highlightNodeId}
      />

      {profileStats ? (
        <JourneyHud
          displayName={profileStats.displayName}
          levelLabel={profileStats.levelLabel}
          regionName={regionName}
          zoneLabel={resolvedZoneLabel}
          globalNodeIndex={journey.position.globalNodeIndex}
          totalNodes={totalNodes}
          currentStreak={profileStats.currentStreak}
          totalXp={profileStats.totalXp}
          onRegionOverview={() => undefined}
        />
      ) : null}
    </div>
  );
}
