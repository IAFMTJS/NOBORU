import type { JourneyNode } from "@/features/journey/types/journey.types";
import {
  computeJourneyPathCoordinates,
  type JourneyPathPoint,
} from "@/lib/design-system/journey-path-contracts";

import {
  N5_NODE_PATH_END,
  N5_NODE_PATH_START,
  N5_WORLD_SLUG,
} from "@/features/worlds/constants/n5-world.constants";

export type N5NodeCanvasPosition = JourneyPathPoint & {
  pathPosition: number;
};

export function resolveN5NodeCanvasPosition(
  node: JourneyNode,
  options?: { theme?: string },
): N5NodeCanvasPosition {
  const coords = computeJourneyPathCoordinates(
    node.pathPosition,
    N5_WORLD_SLUG,
    options,
  );
  return { ...coords, pathPosition: node.pathPosition };
}

function resolveSpreadPathPosition(index: number, total: number): number {
  if (total <= 1) return 0.5;
  const t = index / (total - 1);
  return N5_NODE_PATH_START + t * (N5_NODE_PATH_END - N5_NODE_PATH_START);
}

/** Evenly spaces nodes along the spine in journey order (avoids landmark/lesson overlap). */
export function resolveN5NodeCanvasPositions(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  const ordered = [...nodes].sort((a, b) => a.regionIndex - b.regionIndex);
  const map = new Map<string, N5NodeCanvasPosition>();

  for (let index = 0; index < ordered.length; index += 1) {
    const node = ordered[index]!;
    const spreadPathPosition = resolveSpreadPathPosition(index, ordered.length);
    const coords = computeJourneyPathCoordinates(
      spreadPathPosition,
      N5_WORLD_SLUG,
      options,
    );
    map.set(node.id, { ...coords, pathPosition: spreadPathPosition });
  }

  return map;
}
