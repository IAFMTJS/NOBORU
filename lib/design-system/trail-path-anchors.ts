import anchorContract from "@/lib/design-system/trail-path-anchors.json";
import {
  isRegionSlug,
  type RegionSlug,
} from "@/lib/design-system/regions";

/**
 * Percentage positions along the illustrated trail map artwork.
 * @deprecated For journey UI use journey-path-contracts.ts (path-first).
 * Legacy trail-map components still consume trail-path-anchors.json.
 */
export const TRAIL_MAP_ART_WIDTH = anchorContract.spineArtWidth;
export const TRAIL_MAP_ART_HEIGHT = anchorContract.spineArtHeight;
export const TRAIL_SCROLL_ART_WIDTH = anchorContract.scrollArtWidth;
export const TRAIL_SCROLL_ART_HEIGHT = anchorContract.scrollArtHeight;
export const TRAIL_MAP_ART_ASPECT = TRAIL_MAP_ART_WIDTH / TRAIL_MAP_ART_HEIGHT;

export type TrailAnchorPoint = { x: number; y: number };
export type TrailAnchorMode = "scroll" | "spine";
export type TrailAnchorTheme = "dark" | "light";

export type TrailPlacementOptions = {
  theme?: string;
  regionSlug?: string;
  mode?: TrailAnchorMode;
  /** Which trail path segment within a region (0 = first 40 lessons). */
  trailSegmentIndex?: number;
  placementRange?: {
    startIndex: number;
    totalCount: number;
    trailSegmentIndex?: number;
  };
};

type RegionAnchorContract = {
  dark: TrailAnchorPoint[];
  light: TrailAnchorPoint[];
  trails?: Array<{
    dark: TrailAnchorPoint[];
    light: TrailAnchorPoint[];
  }>;
};

const DEFAULT_REGION: RegionSlug = "foothills";

/** @deprecated Use getTrailMapPathAnchors({ regionSlug, mode: 'scroll' }) */
export const TRAIL_MAP_PATH_ANCHORS_DARK =
  anchorContract.regions.foothills.dark;

/** @deprecated Use getTrailMapPathAnchors({ regionSlug, mode: 'scroll' }) */
export const TRAIL_MAP_PATH_ANCHORS_LIGHT =
  anchorContract.regions.foothills.light;

/** @deprecated Use getTrailMapPathAnchors */
export const TRAIL_MAP_PATH_ANCHORS = TRAIL_MAP_PATH_ANCHORS_DARK;

export function getTrailMapPathAnchors(
  options?: TrailPlacementOptions,
): ReadonlyArray<TrailAnchorPoint> {
  const theme: TrailAnchorTheme = options?.theme === "light" ? "light" : "dark";
  const mode = options?.mode ?? "scroll";

  if (mode === "spine") {
    return anchorContract.spine[theme];
  }

  const slug =
    options?.regionSlug && isRegionSlug(options.regionSlug)
      ? options.regionSlug
      : DEFAULT_REGION;

  const trailSegmentIndex =
    options?.trailSegmentIndex ??
    options?.placementRange?.trailSegmentIndex ??
    0;

  const region = anchorContract.regions[slug] as RegionAnchorContract;

  if (trailSegmentIndex === 0) {
    return region[theme];
  }

  const segmentAnchors = region.trails?.[trailSegmentIndex - 1]?.[theme];
  if (segmentAnchors) {
    return segmentAnchors;
  }

  return region[theme];
}

export function getTrailSegmentCount(regionSlug: string): number {
  if (!isRegionSlug(regionSlug)) return 1;
  const region = anchorContract.regions[regionSlug] as RegionAnchorContract;
  return 1 + (region.trails?.length ?? 0);
}

export type TrailNodePlacementKind = "lesson" | "checkpoint";

export type TrailNodePosition = {
  x: number;
  y: number;
};

export type ImmersiveTrailNodePosition = {
  x: number;
  y: number;
};

export type ImmersiveTrailLayout = {
  positions: ImmersiveTrailNodePosition[];
  canvasAspectRatio: number;
};

function interpolateAlongPath(
  anchors: ReadonlyArray<TrailAnchorPoint>,
  t: number,
): TrailNodePosition {
  if (anchors.length === 0) return { x: 50, y: 50 };
  if (anchors.length === 1) return { ...anchors[0]! };

  const segments: Array<{
    start: TrailAnchorPoint;
    end: TrailAnchorPoint;
    length: number;
  }> = [];
  let totalLength = 0;

  for (let i = 0; i < anchors.length - 1; i += 1) {
    const start = anchors[i]!;
    const end = anchors[i + 1]!;
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segments.push({ start, end, length });
    totalLength += length;
  }

  if (totalLength === 0) return { ...anchors[0]! };

  let remaining = t * totalLength;
  for (const segment of segments) {
    if (remaining <= segment.length) {
      const frac = segment.length === 0 ? 0 : remaining / segment.length;
      return {
        x: segment.start.x + (segment.end.x - segment.start.x) * frac,
        y: segment.start.y + (segment.end.y - segment.start.y) * frac,
      };
    }
    remaining -= segment.length;
  }

  return { ...anchors[anchors.length - 1]! };
}

function resolvePlacementWindow(
  nodeCount: number,
  options?: TrailPlacementOptions,
): { startT: number; endT: number } {
  const range = options?.placementRange;
  if (!range || range.totalCount <= 1 || nodeCount <= 0) {
    return { startT: 0.05, endT: 0.95 };
  }

  const startT =
    0.05 +
    (range.startIndex / (range.totalCount - 1)) * (0.95 - 0.05);
  const endIndex = range.startIndex + nodeCount - 1;
  const endT =
    0.05 +
    (Math.min(endIndex, range.totalCount - 1) / (range.totalCount - 1)) *
      (0.95 - 0.05);

  return {
    startT: Math.min(startT, endT),
    endT: Math.max(startT, endT),
  };
}

function distributeAlongPath(
  nodeCount: number,
  options?: TrailPlacementOptions,
): TrailNodePosition[] {
  const anchors = getTrailMapPathAnchors(options);
  if (nodeCount <= 0) return [];
  if (nodeCount === 1) {
    const { startT } = resolvePlacementWindow(1, options);
    return [interpolateAlongPath(anchors, startT)];
  }

  const { startT, endT } = resolvePlacementWindow(nodeCount, options);
  const positions: TrailNodePosition[] = [];

  for (let i = 0; i < nodeCount; i += 1) {
    const t = startT + (i / (nodeCount - 1)) * (endT - startT);
    positions.push(interpolateAlongPath(anchors, t));
  }

  return positions;
}

export function getImmersiveTrailLayout(
  nodeCount: number,
  options?: TrailPlacementOptions,
): ImmersiveTrailLayout {
  const anchors = getTrailMapPathAnchors(options);
  if (nodeCount <= 0) {
    return {
      positions: [],
      canvasAspectRatio: TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
    };
  }

  const positions: ImmersiveTrailNodePosition[] = [];
  const { startT, endT } = resolvePlacementWindow(nodeCount, {
    ...options,
    placementRange: options?.placementRange ?? {
      startIndex: 0,
      totalCount: nodeCount,
    },
  });

  for (let index = 0; index < nodeCount; index += 1) {
    const t =
      nodeCount <= 1
        ? (startT + endT) / 2
        : startT + (index / (nodeCount - 1)) * (endT - startT);
    const point = interpolateAlongPath(anchors, t);

    positions.push({
      x: point.x,
      y: point.y,
    });
  }

  return {
    positions,
    canvasAspectRatio: TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
  };
}

export function getTrailNodePositions(
  nodes: ReadonlyArray<{ nodeKind: TrailNodePlacementKind }>,
  options?: TrailPlacementOptions,
): ReadonlyArray<TrailNodePosition>;
export function getTrailNodePositions(
  nodeCount: number,
  options?: TrailPlacementOptions,
): ReadonlyArray<TrailNodePosition>;
export function getTrailNodePositions(
  input: number | ReadonlyArray<{ nodeKind: TrailNodePlacementKind }>,
  options?: TrailPlacementOptions,
): ReadonlyArray<TrailNodePosition> {
  if (typeof input === "number") {
    return distributeAlongPath(input, options);
  }

  const nodes = input;
  if (nodes.length === 0) return [];

  const anchors = getTrailMapPathAnchors(options);
  const { startT: rangeStartT, endT: rangeEndT } = resolvePlacementWindow(
    nodes.length,
    options,
  );

  const checkpointIndices = nodes
    .map((node, index) => (node.nodeKind === "checkpoint" ? index : -1))
    .filter((index) => index >= 0);

  if (checkpointIndices.length === 0) {
    return distributeAlongPath(nodes.length, options);
  }

  const anchorCount = anchors.length;
  const anchorIndexForCheckpoint = (checkpointOrder: number): number => {
    if (checkpointIndices.length === 1) {
      return Math.floor((anchorCount - 1) / 2);
    }
    return Math.round(
      (checkpointOrder / (checkpointIndices.length - 1)) * (anchorCount - 1),
    );
  };

  const nodeTs: number[] = new Array(nodes.length).fill(0);
  checkpointIndices.forEach((nodeIndex, checkpointOrder) => {
    nodeTs[nodeIndex] = anchorIndexForCheckpoint(checkpointOrder) / (anchorCount - 1);
  });

  const segmentBoundaries = [-1, ...checkpointIndices, nodes.length];

  for (let segment = 0; segment < segmentBoundaries.length - 1; segment += 1) {
    const segmentStart = segmentBoundaries[segment] + 1;
    const segmentEnd = segmentBoundaries[segment + 1] - 1;
    if (segmentStart > segmentEnd) continue;

    const startT =
      segment === 0
        ? rangeStartT
        : Math.max(rangeStartT, nodeTs[segmentBoundaries[segment]!]!);
    const endT =
      segment === segmentBoundaries.length - 2
        ? rangeEndT
        : Math.min(rangeEndT, nodeTs[segmentBoundaries[segment + 1]!]!);
    const lessonCount = segmentEnd - segmentStart + 1;

    for (let offset = 0; offset < lessonCount; offset += 1) {
      const nodeIndex = segmentStart + offset;
      const frac = (offset + 1) / (lessonCount + 1);
      nodeTs[nodeIndex] = startT + (endT - startT) * frac;
    }
  }

  return nodeTs.map((t, index) => {
    const isCheckpoint = nodes[index]?.nodeKind === "checkpoint";
    const clampedT = isCheckpoint
      ? t
      : Math.min(rangeEndT, Math.max(rangeStartT, t));
    return interpolateAlongPath(anchors, clampedT);
  });
}

export function trailMapMinHeightRem(nodeCount: number, compact: boolean): number {
  const perNode = compact ? 2.25 : 2.75;
  const floor = compact ? 11 : 16;
  const ceiling = compact ? 18 : 32;
  return Math.min(ceiling, Math.max(floor, 4 + nodeCount * perNode));
}
