import {
  WORLD_TREE_NODE_MIN_Y_GAP,
  buildWorldTreeRealmBands,
  resolveRealmForZone,
} from "@/features/journey/constants/world-tree-full-ascent.constants";
import {
  DEFAULT_WORLD_TREE_ZONE,
  REGION_SLUG_TO_WORLD_TREE_ZONE,
  WORLD_TREE_SKELETON_VH_PER_PERCENT,
  WORLD_TREE_SKELETON_MIN_HEIGHT_VH,
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import type { RegionSlug } from "@/lib/design-system/regions";

export type WorldTreeBand = {
  yMin: number;
  yMax: number;
};

export type PlottedSkeletonNode = {
  node: JourneyNode;
  regionSlug: string;
  xPercent: number;
  yPercent: number;
};

/** Cumulative y bands per zone — y=100 is base, y=0 is crown. */
export function buildWorldTreeZoneBands(): Record<WorldTreeZoneId, WorldTreeBand> {
  let cursor = 100;
  const bands = {} as Record<WorldTreeZoneId, WorldTreeBand>;

  for (const zone of WORLD_TREE_SKELETON_ZONES) {
    const yMax = cursor;
    const yMin = cursor - zone.heightPercent;
    bands[zone.id] = { yMin, yMax };
    cursor = yMin;
  }

  return bands;
}

/** Full vertical span reserved for the skeleton ascent (roots base → crown). */
export function buildSkeletonAscentBand(): WorldTreeBand {
  return { yMin: 0, yMax: 100 };
}

function resolveWorldTreeZone(regionSlug: string): WorldTreeZoneId {
  return (
    REGION_SLUG_TO_WORLD_TREE_ZONE[regionSlug as RegionSlug] ?? DEFAULT_WORLD_TREE_ZONE
  );
}

/** Gentle winding x-offset — lesson icons follow a path beside the trunk corridor. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 2.75 + nodeIndex * 0.12) * 11;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 5;
  return 50 + wave + stagger;
}

function realmAnchorY(
  zoneId: WorldTreeZoneId,
  realmBands: ReturnType<typeof buildWorldTreeRealmBands>,
): number {
  const realmId = resolveRealmForZone(zoneId);
  const band = realmBands[realmId];
  return (band.yMin + band.yMax) / 2;
}

/** Minimum canvas height (vh) so nodes can maintain vertical spacing. */
export function resolveWorldTreeCanvasMinHeightVh(nodeCount: number): number {
  if (nodeCount <= 1) return WORLD_TREE_SKELETON_MIN_HEIGHT_VH;

  const requiredSpanPercent = (nodeCount - 1) * WORLD_TREE_NODE_MIN_Y_GAP + 12;
  const scale = Math.max(1, requiredSpanPercent / 100);
  return Math.ceil(WORLD_TREE_SKELETON_MIN_HEIGHT_VH * scale);
}

function enforceMinimumNodeSpacing(plotted: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  if (plotted.length <= 1) return plotted;

  const adjusted = plotted.map((entry) => ({ ...entry }));

  for (let index = 1; index < adjusted.length; index += 1) {
    const previous = adjusted[index - 1]!;
    const current = adjusted[index]!;
    const gap = previous.yPercent - current.yPercent;

    if (gap < WORLD_TREE_NODE_MIN_Y_GAP) {
      current.yPercent = previous.yPercent - WORLD_TREE_NODE_MIN_Y_GAP;
    }
  }

  return adjusted;
}

/** Plot journey nodes on the skeleton with zone-aware placement and minimum spacing. */
export function plotJourneyNodesOnSkeleton(
  journey: JourneyPathViewModel,
): PlottedSkeletonNode[] {
  const entries = journey.regions
    .flatMap((region) =>
      region.nodes.map((node) => ({
        node,
        regionSlug: region.slug,
      })),
    )
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  if (entries.length === 0) return [];

  const zoneBands = buildWorldTreeZoneBands();
  const realmBands = buildWorldTreeRealmBands();
  const stackBand = buildSkeletonAscentBand();
  const ySpan = stackBand.yMax - stackBand.yMin;
  const lastIndex = entries.length - 1;

  const plotted = entries.map(({ node, regionSlug }, index) => {
    const globalProgress = lastIndex > 0 ? index / lastIndex : 0;
    const zoneId = resolveWorldTreeZone(regionSlug);
    const realmY = realmAnchorY(zoneId, realmBands);
    const zoneY = (zoneBands[zoneId].yMin + zoneBands[zoneId].yMax) / 2;
    const globalY = stackBand.yMax - globalProgress * ySpan;
    const yPercent = globalY * 0.45 + realmY * 0.35 + zoneY * 0.2;

    return {
      node,
      regionSlug,
      xPercent: computeWorldTreePathXPercent(globalProgress, index),
      yPercent,
    };
  });

  return enforceMinimumNodeSpacing(plotted);
}

export function findPlottedNode(
  plotted: PlottedSkeletonNode[],
  nodeId: string | null,
): PlottedSkeletonNode | null {
  if (!nodeId) return null;
  return plotted.find((entry) => entry.node.id === nodeId) ?? null;
}

export function countJourneyNodes(journey: JourneyPathViewModel): number {
  return journey.regions.reduce((sum, region) => sum + region.nodes.length, 0);
}

/** @internal test helper */
export { WORLD_TREE_SKELETON_VH_PER_PERCENT };
