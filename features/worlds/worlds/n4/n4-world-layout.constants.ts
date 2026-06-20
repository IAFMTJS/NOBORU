import type { RegionSlug } from "@/lib/design-system/regions";

/** Serpentine climb across the N4 foothills mass — canvas y ignored (bands handle Y). */
export const N4_CLIMB_WAYPOINTS = [
  { progress: 0, x: 50, y: 98 },
  { progress: 0.1, x: 66, y: 92 },
  { progress: 0.2, x: 74, y: 84 },
  { progress: 0.3, x: 62, y: 76 },
  { progress: 0.4, x: 42, y: 68 },
  { progress: 0.5, x: 28, y: 60 },
  { progress: 0.6, x: 34, y: 52 },
  { progress: 0.7, x: 52, y: 44 },
  { progress: 0.8, x: 70, y: 34 },
  { progress: 0.9, x: 58, y: 22 },
  { progress: 1, x: 50, y: 10 },
] as const;

export const N4_REGION_Y_BANDS: Partial<
  Record<RegionSlug, { yMin: number; yMax: number }>
> = {
  "mount-n4": { yMin: 12, yMax: 98.5 },
};

export const N4_REGION_PATH_BANDS: Partial<
  Record<RegionSlug, { progressStart: number; progressEnd: number }>
> = {
  "mount-n4": { progressStart: 0, progressEnd: 0.96 },
};

export const N4_REGION_SLOT_TARGETS = {
  "mount-n4": 85,
} as const;

export const N4_WORLD_LAYOUT = {
  branchReachMin: 16,
  branchReachMax: 30,
  branchXMin: 10,
  branchXMax: 90,
  spineXMin: 28,
  spineXMax: 72,
  baseSpineXMin: 34,
  baseSpineXMax: 66,
  spineAlternatingNudge: 3,
  laneSpread: 5,
  portalYPercent: 5,
  canvasMinHeightVh: 380,
  minRegionYGap: {
    "mount-n4": 0.48,
  },
} as const;

export function interpolateN4Waypoints(progress: number): { x: number; y: number } {
  const p = Math.min(1, Math.max(0, progress));
  const points = N4_CLIMB_WAYPOINTS;

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

export function resolveN4RegionProgress(
  regionSlug: string,
  indexInRegion: number,
  countInRegion: number,
): number {
  const band = N4_REGION_PATH_BANDS[regionSlug as RegionSlug];
  if (!band) {
    return countInRegion > 1 ? indexInRegion / (countInRegion - 1) : 0.5;
  }
  if (countInRegion <= 1) return (band.progressStart + band.progressEnd) / 2;

  const t = indexInRegion / (countInRegion - 1);
  return band.progressStart + t * (band.progressEnd - band.progressStart);
}

export function resolveN4RegionY(
  regionSlug: string,
  indexInRegion: number,
  countInRegion: number,
): number {
  const band = N4_REGION_Y_BANDS[regionSlug as RegionSlug];
  if (!band) return 50;
  if (countInRegion <= 1) return (band.yMin + band.yMax) / 2;

  const t = indexInRegion / (countInRegion - 1);
  return band.yMax - t * (band.yMax - band.yMin);
}

export function resolveN4LaneOffset(indexInRegion: number, branchId: string): number {
  let hash = indexInRegion;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = (hash * 17 + branchId.charCodeAt(i)) | 0;
  }
  const lane = hash % 5;
  return (lane - 2) * N4_WORLD_LAYOUT.laneSpread;
}

export function resolveN4BranchSide(branchId: string, climbRank: number): number {
  let hash = climbRank * 31;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = (hash * 33 + branchId.charCodeAt(i)) | 0;
  }
  return (hash & 1) === 0 ? -1 : 1;
}

export function resolveN4BranchReach(_regionSlug: string, climbRank: number): number {
  const { branchReachMin, branchReachMax } = N4_WORLD_LAYOUT;
  const slot = climbRank % 6;
  const span = branchReachMax - branchReachMin;
  return branchReachMin + (slot / 5) * span;
}
