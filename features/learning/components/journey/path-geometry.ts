import {
  computeJourneyPathCoordinates,
  interpolateAlongJourneyPath,
  getJourneyPathSpine,
} from "@/lib/design-system/journey-path-contracts";
import type { JourneyNode } from "@/features/learning/types/journey.types";

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
