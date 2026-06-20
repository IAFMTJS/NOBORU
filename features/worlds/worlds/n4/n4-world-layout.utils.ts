import type {
  PlottedSkeletonNode,
  WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { RegionSlug } from "@/lib/design-system/regions";
import {
  interpolateN4Waypoints,
  N4_REGION_Y_BANDS,
  N4_WORLD_LAYOUT,
  resolveN4BranchReach,
  resolveN4BranchSide,
  resolveN4LaneOffset,
  resolveN4RegionProgress,
  resolveN4RegionY,
} from "@/features/worlds/worlds/n4/n4-world-layout.constants";

const CLIMB_NODE_KINDS = new Set(["lesson", "checkpoint", "trial", "landmark"]);

function clampPercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isBranchPlaced(entry: PlottedSkeletonNode): boolean {
  return (
    entry.spineRole === "branch" ||
    entry.segmentType === "branch" ||
    entry.segmentType === "cave"
  );
}

function resolveMinRegionYGap(regionSlug: string): number {
  return (
    N4_WORLD_LAYOUT.minRegionYGap[regionSlug as keyof typeof N4_WORLD_LAYOUT.minRegionYGap] ??
    0.4
  );
}

function enforceN4RegionYSpacing(entries: PlottedSkeletonNode[]): void {
  const byRegion = new Map<string, PlottedSkeletonNode[]>();

  for (const entry of entries) {
    const bucket = byRegion.get(entry.regionSlug) ?? [];
    bucket.push(entry);
    byRegion.set(entry.regionSlug, bucket);
  }

  for (const [regionSlug, regionNodes] of byRegion) {
    const band = N4_REGION_Y_BANDS[regionSlug as RegionSlug];
    if (!band || regionNodes.length <= 1) continue;

    const minGap = resolveMinRegionYGap(regionSlug);
    regionNodes.sort((a, b) => b.yPercent - a.yPercent);

    for (let index = 1; index < regionNodes.length; index += 1) {
      const above = regionNodes[index - 1]!;
      const current = regionNodes[index]!;
      const gap = above.yPercent - current.yPercent;

      if (gap < minGap) {
        current.yPercent = above.yPercent - minGap;
      }
    }

    const top = regionNodes.at(-1)!;
    if (top.yPercent < band.yMin) {
      const shift = band.yMin - top.yPercent;
      for (const node of regionNodes) {
        node.yPercent += shift;
      }
    }

    const bottom = regionNodes[0]!;
    if (bottom.yPercent > band.yMax) {
      const shift = bottom.yPercent - band.yMax;
      for (const node of regionNodes) {
        node.yPercent -= shift;
      }
    }
  }
}

function resolveSpineXBounds(progress: number): { min: number; max: number } {
  if (progress < 0.18) {
    return {
      min: N4_WORLD_LAYOUT.baseSpineXMin,
      max: N4_WORLD_LAYOUT.baseSpineXMax,
    };
  }
  return { min: N4_WORLD_LAYOUT.spineXMin, max: N4_WORLD_LAYOUT.spineXMax };
}

/** N4 single-region layout — wide serpentine path with enforced vertical spacing. */
export function tuneN4WorldLayout(
  layout: WorldTreeLayoutResult,
  _worldPath: JlptWorldPathViewModel,
): WorldTreeLayoutResult {
  const nodes = layout.nodes.map((entry) => ({ ...entry }));
  const climbNodes = nodes
    .filter((entry) => CLIMB_NODE_KINDS.has(entry.node.kind))
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  const regionCounts = new Map<string, number>();
  const regionIndices = new Map<string, number>();

  for (const entry of climbNodes) {
    regionCounts.set(entry.regionSlug, (regionCounts.get(entry.regionSlug) ?? 0) + 1);
  }

  climbNodes.forEach((entry, climbRank) => {
    const countInRegion = regionCounts.get(entry.regionSlug) ?? 1;
    const indexInRegion = regionIndices.get(entry.regionSlug) ?? 0;
    regionIndices.set(entry.regionSlug, indexInRegion + 1);

    const progress = resolveN4RegionProgress(entry.regionSlug, indexInRegion, countInRegion);
    const pathX = interpolateN4Waypoints(progress).x;
    const yPercent = resolveN4RegionY(entry.regionSlug, indexInRegion, countInRegion);
    const lane = resolveN4LaneOffset(indexInRegion, entry.branchId);
    const alternating =
      climbRank % 2 === 0
        ? -N4_WORLD_LAYOUT.spineAlternatingNudge
        : N4_WORLD_LAYOUT.spineAlternatingNudge;
    const spineBounds = resolveSpineXBounds(progress);

    if (isBranchPlaced(entry)) {
      const side = resolveN4BranchSide(entry.branchId, climbRank);
      const reach = resolveN4BranchReach(entry.regionSlug, climbRank);

      entry.xPercent = clampPercent(
        pathX + lane + side * reach,
        N4_WORLD_LAYOUT.branchXMin,
        N4_WORLD_LAYOUT.branchXMax,
      );
      entry.yPercent = yPercent;
      return;
    }

    if (entry.node.kind === "landmark") {
      entry.xPercent = clampPercent(pathX + lane, spineBounds.min - 8, spineBounds.max + 8);
      entry.yPercent = yPercent;
      return;
    }

    entry.xPercent = clampPercent(
      pathX + lane + alternating,
      spineBounds.min,
      spineBounds.max,
    );
    entry.yPercent = yPercent;
  });

  enforceN4RegionYSpacing(climbNodes);

  return {
    ...layout,
    nodes,
    canvasMinHeightVh: N4_WORLD_LAYOUT.canvasMinHeightVh,
  };
}

export function resolveN4PortalYPercent(): number {
  return N4_WORLD_LAYOUT.portalYPercent;
}
