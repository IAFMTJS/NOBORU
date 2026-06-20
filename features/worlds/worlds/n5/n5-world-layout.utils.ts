import type {
  PlottedSkeletonNode,
  WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import {
  interpolateN5Waypoints,
  N5_WORLD_LAYOUT,
  resolveN5BranchReach,
  resolveN5BranchSide,
} from "@/features/worlds/worlds/n5/n5-world-layout.constants";

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

function resolveClimbProgress(climbRank: number, total: number): number {
  if (total <= 1) return 0.5;
  return climbRank / (total - 1);
}

function enforceGlobalMinYSpacing(
  nodes: PlottedSkeletonNode[],
  minGap: number,
): void {
  const sorted = [...nodes].sort((a, b) => b.yPercent - a.yPercent);

  for (let index = 1; index < sorted.length; index += 1) {
    const prev = sorted[index - 1]!;
    const current = sorted[index]!;
    if (prev.yPercent - current.yPercent < minGap) {
      current.yPercent = prev.yPercent - minGap;
    }
  }
}

/**
 * Evenly distributes every climb node along the island waypoint path (by rank, not globalIndex).
 * Prevents hundreds of nodes collapsing into the same spine coordinate.
 */
export function tuneN5WorldLayout(
  layout: WorldTreeLayoutResult,
  _worldPath: JlptWorldPathViewModel,
): WorldTreeLayoutResult {
  const nodes = layout.nodes.map((entry) => ({ ...entry }));
  const climbNodes = nodes
    .filter((entry) => CLIMB_NODE_KINDS.has(entry.node.kind))
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  const total = climbNodes.length;

  climbNodes.forEach((entry, climbRank) => {
    const progress = resolveClimbProgress(climbRank, total);
    const spine = interpolateN5Waypoints(progress);
    const alternating =
      climbRank % 2 === 0
        ? -N5_WORLD_LAYOUT.spineAlternatingNudge
        : N5_WORLD_LAYOUT.spineAlternatingNudge;

    if (isBranchPlaced(entry)) {
      const side = resolveN5BranchSide(entry.branchId, climbRank);
      const reach = resolveN5BranchReach(climbRank);

      entry.xPercent = clampPercent(
        spine.x + side * reach,
        N5_WORLD_LAYOUT.branchXMin,
        N5_WORLD_LAYOUT.branchXMax,
      );
      entry.yPercent = spine.y;
      return;
    }

    if (entry.node.kind === "landmark") {
      entry.xPercent = clampPercent(spine.x + alternating * 1.6, 20, 80);
      entry.yPercent = clampPercent(spine.y - 1.5, 8, 98);
      return;
    }

    entry.xPercent = clampPercent(
      spine.x + alternating,
      N5_WORLD_LAYOUT.spineXMin,
      N5_WORLD_LAYOUT.spineXMax,
    );
    entry.yPercent = spine.y;
  });

  enforceGlobalMinYSpacing(climbNodes, N5_WORLD_LAYOUT.minNodeYGapPercent);

  return {
    ...layout,
    nodes,
    canvasMinHeightVh: N5_WORLD_LAYOUT.canvasMinHeightVh,
  };
}

export function resolveN5PortalYPercent(): number {
  return N5_WORLD_LAYOUT.portalYPercent;
}
