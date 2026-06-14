import {
  computeJourneyPathCoordinates,
  interpolateAlongJourneyPath,
  getJourneyPathSpine,
} from "@/lib/design-system/journey-path-contracts";
import { resolveRegionScrollMinHeightVh } from "@/features/journey/constants/journey.constants";
import type { JourneyNode } from "@/features/journey/types/journey.types";

export type PathGeometryOptions = {
  regionSlug: string;
  theme?: string;
  trailSegmentIndex?: number;
};

export function computePathCoordinates(
  pathPosition: number,
  options: PathGeometryOptions,
): { x: number; y: number } {
  return computeJourneyPathCoordinates(pathPosition, options.regionSlug, {
    theme: options.theme,
    trailSegmentIndex: options.trailSegmentIndex,
  });
}

export function buildPathSpinePoints(
  nodes: JourneyNode[],
  options: PathGeometryOptions,
): Array<{ x: number; y: number }> {
  const spine = getJourneyPathSpine(options.regionSlug, {
    theme: options.theme,
    trailSegmentIndex: options.trailSegmentIndex,
  });

  if (nodes.length === 0) {
    return spine.map((point) => ({ ...point }));
  }

  return nodes.map((node) =>
    interpolateAlongJourneyPath(spine, node.pathPosition),
  );
}

/**
 * Resolves the scrollable map height for a region.
 * Enforces V2 scale tiers so the world always exceeds one viewport.
 */
export function resolveJourneyMapScrollHeight(
  regionSlug: string,
  nodes: JourneyNode[],
  options: PathGeometryOptions,
): number {
  const spine = getJourneyPathSpine(regionSlug, {
    theme: options.theme,
    trailSegmentIndex: options.trailSegmentIndex,
  });

  const spineYs = spine.map((point) => point.y);
  const nodeYs = nodes.map((node) =>
    computePathCoordinates(node.pathPosition, options).y,
  );
  const allYs = [...spineYs, ...nodeYs];

  const minY = allYs.length > 0 ? Math.min(...allYs) : 0;
  const maxY = allYs.length > 0 ? Math.max(...allYs) : 100;
  const spreadVh = Math.max(100, maxY - minY + 20);

  const tierMinVh = resolveRegionScrollMinHeightVh(regionSlug);
  return Math.max(spreadVh, tierMinVh);
}
