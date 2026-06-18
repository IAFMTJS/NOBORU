import {
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";

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

/** Gentle winding x-offset — lesson icons follow a path, no visible trail line. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 2.75 + nodeIndex * 0.12) * 9;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 3.5;
  return 50 + wave + stagger;
}

/** Plot all journey nodes bottom-up on the skeleton — roots first, crown last. */
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

  const stackBand = buildSkeletonAscentBand();
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
