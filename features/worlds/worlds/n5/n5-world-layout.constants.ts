import type { RegionSlug } from "@/lib/design-system/regions";

/** Canvas coords: y=100 base, y=0 crown. Wide sweep across the island mass. */
export const N5_CLIMB_WAYPOINTS = [
  { progress: 0, x: 50, y: 98 },
  { progress: 0.08, x: 64, y: 94 },
  { progress: 0.16, x: 74, y: 88 },
  { progress: 0.24, x: 70, y: 82 },
  { progress: 0.32, x: 54, y: 76 },
  { progress: 0.4, x: 38, y: 70 },
  { progress: 0.48, x: 28, y: 64 },
  { progress: 0.56, x: 32, y: 58 },
  { progress: 0.64, x: 46, y: 52 },
  { progress: 0.72, x: 64, y: 46 },
  { progress: 0.8, x: 74, y: 38 },
  { progress: 0.88, x: 58, y: 28 },
  { progress: 0.94, x: 38, y: 18 },
  { progress: 1, x: 50, y: 10 },
] as const;

export const N5_WORLD_LAYOUT = {
  branchReachMin: 16,
  branchReachMax: 30,
  branchXMin: 10,
  branchXMax: 90,
  spineXMin: 24,
  spineXMax: 76,
  spineAlternatingNudge: 5,
  portalYPercent: 5,
  minNodeYGapPercent: 0.55,
  canvasMinHeightVh: 420,
  regionSpineRanges: {
    foothills: { yMin: 88, yMax: 98 },
    "forest-trail": { yMin: 58, yMax: 92 },
    "mount-n5": { yMin: 8, yMax: 72 },
  } satisfies Partial<Record<RegionSlug, { yMin: number; yMax: number }>>,
} as const;

export function interpolateN5Waypoints(progress: number): { x: number; y: number } {
  const p = Math.min(1, Math.max(0, progress));
  const points = N5_CLIMB_WAYPOINTS;

  if (p <= points[0]!.progress) return { x: points[0]!.x, y: points[0]!.y };
  if (p >= points[points.length - 1]!.progress) {
    const last = points[points.length - 1]!;
    return { x: last.x, y: last.y };
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index]!;
    const end = points[index + 1]!;
    if (p < start.progress || p > end.progress) continue;

    const span = end.progress - start.progress;
    const t = span > 0 ? (p - start.progress) / span : 0;
    const ease = t * t * (3 - 2 * t);

    return {
      x: start.x + (end.x - start.x) * ease,
      y: start.y + (end.y - start.y) * ease,
    };
  }

  return { x: 50, y: 50 };
}

export function resolveN5BranchSide(branchId: string, climbRank: number): number {
  let hash = climbRank * 31;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = (hash * 33 + branchId.charCodeAt(i)) | 0;
  }
  return (hash & 1) === 0 ? -1 : 1;
}

export function resolveN5BranchReach(climbRank: number): number {
  const { branchReachMin, branchReachMax } = N5_WORLD_LAYOUT;
  const slot = climbRank % 6;
  const span = branchReachMax - branchReachMin;
  return branchReachMin + (slot / 5) * span;
}
