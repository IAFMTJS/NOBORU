import {
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import {
  JOURNEY_WORLD_TREE_TILE_STACK,
  WORLD_TREE_SEAM_OVERLAP_PERCENT,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";
import { segmentIdFromTileBase } from "@/lib/assets/world-tree-segment-presentation";

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

/** Per-segment vertical bands on the stacked tile canvas (y=100 base, y=0 crown). */
export function buildWorldTreeTileBands(
  stack: readonly WorldTreeTileBase[] = JOURNEY_WORLD_TREE_TILE_STACK,
  overlapPercent = WORLD_TREE_SEAM_OVERLAP_PERCENT,
): Map<string, WorldTreeBand> {
  const tileCount = stack.length;
  if (tileCount === 0) return new Map();

  const step = 1 - overlapPercent / 100;
  const totalHeight = 1 + (tileCount - 1) * step;
  const bands = new Map<string, WorldTreeBand>();

  stack.forEach((base, index) => {
    const top = index * step;
    const bottom = top + 1;
    bands.set(segmentIdFromTileBase(base), {
      yMin: 100 - (bottom / totalHeight) * 100,
      yMax: 100 - (top / totalHeight) * 100,
    });
  });

  return bands;
}

/** Aggregate tile bands per skeleton zone for regions that have produced art. */
export function buildZoneTileBands(
  stack: readonly WorldTreeTileBase[] = JOURNEY_WORLD_TREE_TILE_STACK,
): Partial<Record<WorldTreeZoneId, WorldTreeBand>> {
  const tileBands = buildWorldTreeTileBands(stack);
  const zoneBands: Partial<Record<WorldTreeZoneId, WorldTreeBand>> = {};

  for (const zone of WORLD_TREE_SKELETON_ZONES) {
    const segmentIds = zone.artSegmentIds ?? [];
    const present = segmentIds.filter((id) => tileBands.has(id));
    if (present.length === 0) continue;

    zoneBands[zone.id] = {
      yMin: Math.min(...present.map((id) => tileBands.get(id)!.yMin)),
      yMax: Math.max(...present.map((id) => tileBands.get(id)!.yMax)),
    };
  }

  return zoneBands;
}

/** Full vertical span of the produced tile stack (roots base → highest tile). */
export function buildProducedStackBand(
  stack: readonly WorldTreeTileBase[] = JOURNEY_WORLD_TREE_TILE_STACK,
): WorldTreeBand | null {
  const tileBands = buildWorldTreeTileBands(stack);
  if (tileBands.size === 0) return null;

  const values = [...tileBands.values()];
  return {
    yMin: Math.min(...values.map((band) => band.yMin)),
    yMax: Math.max(...values.map((band) => band.yMax)),
  };
}

/** Gentle winding x-offset — lesson icons follow a path, no visible trail line. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 2.75 + nodeIndex * 0.12) * 9;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 3.5;
  return 50 + wave + stagger;
}

/** Plot all journey nodes bottom-up on the produced stack — roots first, crown last. */
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

  const stackBand = buildProducedStackBand();
  if (!stackBand) return [];

  const ySpan = stackBand.yMax - stackBand.yMin;
  const lastIndex = entries.length - 1;

  return entries.map(({ node, regionSlug }, index) => {
    const progress = lastIndex > 0 ? index / lastIndex : 0;

    return {
      node,
      regionSlug,
      xPercent: computeWorldTreePathXPercent(progress, index),
      yPercent: stackBand.yMax - progress * ySpan,
    };
  });
}

export function findPlottedNode(
  plotted: PlottedSkeletonNode[],
  nodeId: string | null,
): PlottedSkeletonNode | null {
  if (!nodeId) return null;
  return plotted.find((entry) => entry.node.id === nodeId) ?? null;
}
