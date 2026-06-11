/**
 * Percentage positions along the illustrated trail map artwork.
 * Coordinates match the winding path in ui_trail_spine_{dark,light}_v1.
 */
export const TRAIL_MAP_PATH_ANCHORS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 50, y: 90 },
  { x: 36, y: 78 },
  { x: 64, y: 66 },
  { x: 38, y: 54 },
  { x: 62, y: 42 },
  { x: 40, y: 30 },
  { x: 52, y: 18 },
];

export function getTrailNodePositions(
  nodeCount: number,
): ReadonlyArray<{ x: number; y: number }> {
  if (nodeCount <= 0) return [];
  if (nodeCount === 1) return [{ x: 50, y: 50 }];

  const anchors = TRAIL_MAP_PATH_ANCHORS;
  const positions: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < nodeCount; i += 1) {
    const t = i / (nodeCount - 1);
    const anchorIndex = t * (anchors.length - 1);
    const lower = Math.floor(anchorIndex);
    const upper = Math.min(lower + 1, anchors.length - 1);
    const frac = anchorIndex - lower;
    const a = anchors[lower];
    const b = anchors[upper];
    positions.push({
      x: a.x + (b.x - a.x) * frac,
      y: a.y + (b.y - a.y) * frac,
    });
  }

  return positions;
}

export function trailMapMinHeightRem(nodeCount: number, compact: boolean): number {
  const perNode = compact ? 2.25 : 2.75;
  const floor = compact ? 11 : 16;
  const ceiling = compact ? 18 : 32;
  return Math.min(ceiling, Math.max(floor, 4 + nodeCount * perNode));
}
