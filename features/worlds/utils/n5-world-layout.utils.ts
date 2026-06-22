import type { JourneyNode } from "@/features/journey/types/journey.types";
import {
  computeJourneyPathCoordinates,
  type JourneyPathPoint,
} from "@/lib/design-system/journey-path-contracts";

import { N5_WORLD_SLUG } from "@/features/worlds/constants/n5-world.constants";

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

export function resolveN5NodeCanvasPositions(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  const map = new Map<string, N5NodeCanvasPosition>();
  for (const node of nodes) {
    map.set(node.id, resolveN5NodeCanvasPosition(node, options));
  }
  return map;
}
