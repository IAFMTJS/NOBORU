"use client";

import { JourneyHud } from "@/features/journey/components/journey-hud";
import {
  REGION_SLUG_TO_WORLD_TREE_ZONE,
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  WorldPortalTransitionProvider,
} from "@/features/worlds/components/world-portal-transition";
import { WorldCanvas } from "@/features/worlds/components/world-canvas";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { WorldPortalState } from "@/features/worlds/types/world.types";
import type { RegionSlug } from "@/lib/design-system/regions";

type WorldScreenProps = {
  worldPath: JlptWorldPathViewModel;
  portal: WorldPortalState;
  regionName: string;
  focusYPercent?: number | null;
  anchorScrollToBottom?: boolean;
  highlightNodeId?: string | null;
  variant?: "journey" | "overview";
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

/** Full-screen JLPT world — self-contained level with HUD and portal exit. */
export function WorldScreen({
  worldPath,
  portal,
  regionName,
  focusYPercent = null,
  anchorScrollToBottom = false,
  highlightNodeId = null,
  variant = "journey",
  profileStats,
}: WorldScreenProps) {
  const { world, position, totalNodeCount, journey } = worldPath;
  const zoneLabel =
    resolveZoneLabel(position.currentRegionSlug) ?? world.theme.subtitle;
  const treeOverviewHref =
    variant === "overview" ? null : `/worlds/${world.id}?mode=overview`;
  const currentNode = journey.regions
    .flatMap((region) => region.nodes)
    .find((node) => node.id === position.currentNodeId);

  return (
    <WorldPortalTransitionProvider worldKey={world.id}>
      <div
        className="relative h-content min-h-0 overflow-hidden isolate"
        style={{
          backgroundColor: world.theme.backgroundLight,
        }}
      >
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ backgroundColor: world.theme.backgroundDark }}
        />

        <WorldCanvas
          className="absolute inset-0"
          worldPath={worldPath}
          regionName={regionName}
          portal={portal}
          variant={variant}
          focusYPercent={focusYPercent}
          anchorScrollToBottom={anchorScrollToBottom}
          highlightNodeId={highlightNodeId}
        />

        {profileStats ? (
          <JourneyHud
            displayName={profileStats.displayName}
            levelLabel={profileStats.levelLabel}
            regionName={regionName}
            zoneLabel={zoneLabel}
            globalNodeIndex={position.globalNodeIndex}
            totalNodes={totalNodeCount}
            currentStreak={profileStats.currentStreak}
            totalXp={profileStats.totalXp}
            onRegionOverview={() => undefined}
            treeOverviewHref={treeOverviewHref}
            currentNodeLabel={currentNode?.label ?? null}
          />
        ) : null}
      </div>
    </WorldPortalTransitionProvider>
  );
}
