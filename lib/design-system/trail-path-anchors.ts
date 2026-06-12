/**
 * Percentage positions along the illustrated trail map artwork.
 * Calibrated to ui_trail_spine_{dark,light}_v1 (1536×1024) for card layouts
 * and ui_trail_scroll_{region}_{theme}_v1 (1536×5120) for immersive Learn.
 *
 * Lesson nodes interpolate along these anchors; the painted path in scroll art
 * must pass through them — code never draws a competing trail when scroll art loads.
 */
export const TRAIL_MAP_ART_WIDTH = 1536;
export const TRAIL_MAP_ART_HEIGHT = 1024;
export const TRAIL_SCROLL_ART_WIDTH = 1536;
export const TRAIL_SCROLL_ART_HEIGHT = 5120;
export const TRAIL_MAP_ART_ASPECT = TRAIL_MAP_ART_WIDTH / TRAIL_MAP_ART_HEIGHT;

/** Vertical gap between lesson nodes when no scroll art is available (fallback). */
export const IMMERSIVE_NODE_SPACING_REM = 15;
export const IMMERSIVE_TRAIL_PADDING_TOP_REM = 10;
export const IMMERSIVE_TRAIL_PADDING_BOTTOM_REM = 14;

/**
 * Lantern / bend waypoints calibrated to ui_trail_scroll_foothills_{theme}_v2 painted path.
 */
export const TRAIL_MAP_PATH_ANCHORS_DARK: ReadonlyArray<{ x: number; y: number }> = [
  { x: 50, y: 93 },
  { x: 40, y: 88 },
  { x: 52, y: 83 },
  { x: 40, y: 77 },
  { x: 54, y: 71 },
  { x: 44, y: 65 },
  { x: 54, y: 59 },
  { x: 46, y: 53 },
  { x: 54, y: 47 },
  { x: 48, y: 40 },
  { x: 50, y: 32 },
  { x: 50, y: 22 },
  { x: 50, y: 12 },
  { x: 50, y: 6 },
];

export const TRAIL_MAP_PATH_ANCHORS_LIGHT: ReadonlyArray<{ x: number; y: number }> = [
  { x: 50, y: 93 },
  { x: 44, y: 88 },
  { x: 52, y: 83 },
  { x: 38, y: 77 },
  { x: 48, y: 71 },
  { x: 36, y: 65 },
  { x: 46, y: 59 },
  { x: 38, y: 53 },
  { x: 48, y: 46 },
  { x: 52, y: 38 },
  { x: 50, y: 28 },
  { x: 50, y: 16 },
  { x: 50, y: 8 },
  { x: 50, y: 4 },
];

/** Default anchors for card layouts and dark immersive scroll. */
export const TRAIL_MAP_PATH_ANCHORS = TRAIL_MAP_PATH_ANCHORS_DARK;

export function getTrailMapPathAnchors(theme?: string): ReadonlyArray<{ x: number; y: number }> {
  return theme === "light" ? TRAIL_MAP_PATH_ANCHORS_LIGHT : TRAIL_MAP_PATH_ANCHORS_DARK;
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
  /** Width / height for the scroll canvas (matches ui_trail_scroll_*). */
  canvasAspectRatio: number;
};

function interpolateAlongPath(
  anchors: ReadonlyArray<{ x: number; y: number }> = TRAIL_MAP_PATH_ANCHORS,
  t: number,
): TrailNodePosition {
  if (anchors.length === 0) return { x: 50, y: 50 };
  if (anchors.length === 1) return anchors[0];

  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < anchors.length - 1; i += 1) {
    const dx = anchors[i + 1].x - anchors[i].x;
    const dy = anchors[i + 1].y - anchors[i].y;
    const length = Math.hypot(dx, dy);
    segmentLengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) return anchors[0];

  let remaining = Math.min(1, Math.max(0, t)) * totalLength;

  for (let i = 0; i < segmentLengths.length; i += 1) {
    const segmentLength = segmentLengths[i];
    if (remaining <= segmentLength || i === segmentLengths.length - 1) {
      const frac = segmentLength === 0 ? 0 : remaining / segmentLength;
      const start = anchors[i];
      const end = anchors[i + 1];
      return {
        x: start.x + (end.x - start.x) * frac,
        y: start.y + (end.y - start.y) * frac,
      };
    }
    remaining -= segmentLength;
  }

  return anchors[anchors.length - 1];
}

function distributeAlongPath(nodeCount: number, theme?: string): TrailNodePosition[] {
  const anchors = getTrailMapPathAnchors(theme);
  if (nodeCount <= 0) return [];
  if (nodeCount === 1) return [interpolateAlongPath(anchors, 0.08)];

  const positions: TrailNodePosition[] = [];
  const startT = 0.05;
  const endT = 0.95;

  for (let i = 0; i < nodeCount; i += 1) {
    const t = startT + (i / (nodeCount - 1)) * (endT - startT);
    positions.push(interpolateAlongPath(anchors, t));
  }

  return positions;
}

/**
 * Immersive Learn: positions calibrated to ui_trail_scroll_{region}_{theme}_v1.
 */
export function getImmersiveTrailLayout(
  nodeCount: number,
  theme?: string,
): ImmersiveTrailLayout {
  const anchors = getTrailMapPathAnchors(theme);
  if (nodeCount <= 0) {
    return { positions: [], canvasAspectRatio: TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT };
  }

  const positions: ImmersiveTrailNodePosition[] = [];

  for (let index = 0; index < nodeCount; index += 1) {
    const t = nodeCount <= 1 ? 0.5 : index / (nodeCount - 1);
    const point = interpolateAlongPath(anchors, 0.06 + t * 0.88);

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

/**
 * Places checkpoint nodes on spine anchor bends; lessons fill segments between.
 */
export function getTrailNodePositions(
  nodes: ReadonlyArray<{ nodeKind: TrailNodePlacementKind }>,
  options?: { theme?: string },
): ReadonlyArray<TrailNodePosition>;
export function getTrailNodePositions(
  nodeCount: number,
  options?: { theme?: string },
): ReadonlyArray<TrailNodePosition>;
export function getTrailNodePositions(
  input: number | ReadonlyArray<{ nodeKind: TrailNodePlacementKind }>,
  options?: { theme?: string },
): ReadonlyArray<TrailNodePosition> {
  const theme = options?.theme;
  if (typeof input === "number") {
    return distributeAlongPath(input, theme);
  }

  const nodes = input;
  if (nodes.length === 0) return [];

  const anchors = getTrailMapPathAnchors(theme);

  const checkpointIndices = nodes
    .map((node, index) => (node.nodeKind === "checkpoint" ? index : -1))
    .filter((index) => index >= 0);

  if (checkpointIndices.length === 0) {
    return distributeAlongPath(nodes.length, theme);
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

    const startT = segment === 0 ? 0.05 : nodeTs[segmentBoundaries[segment]];
    const endT =
      segment === segmentBoundaries.length - 2
        ? 0.95
        : nodeTs[segmentBoundaries[segment + 1]];
    const lessonCount = segmentEnd - segmentStart + 1;

    for (let offset = 0; offset < lessonCount; offset += 1) {
      const nodeIndex = segmentStart + offset;
      const frac = (offset + 1) / (lessonCount + 1);
      nodeTs[nodeIndex] = startT + (endT - startT) * frac;
    }
  }

  return nodeTs.map((t) => interpolateAlongPath(anchors, t));
}

/** Minimum map height for card / preview layouts. */
export function trailMapMinHeightRem(nodeCount: number, compact: boolean): number {
  const perNode = compact ? 2.25 : 2.75;
  const floor = compact ? 11 : 16;
  const ceiling = compact ? 18 : 32;
  return Math.min(ceiling, Math.max(floor, 4 + nodeCount * perNode));
}
