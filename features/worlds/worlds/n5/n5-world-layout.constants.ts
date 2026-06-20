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

/** Dedicated vertical bands per region — prevents bottom overlap clusters. */
export const N5_REGION_Y_BANDS: Partial<
  Record<RegionSlug, { yMin: number; yMax: number }>
> = {
  foothills: { yMin: 80, yMax: 99.5 },
  "forest-trail": { yMin: 62, yMax: 82 },
  "mount-n5": { yMin: 6, yMax: 64 },
};

/** Horizontal path progress per region (waypoint interpolation input). */
export const N5_REGION_PATH_BANDS: Partial<
  Record<RegionSlug, { progressStart: number; progressEnd: number }>
> = {
  foothills: { progressStart: 0, progressEnd: 0.1 },
  "forest-trail": { progressStart: 0.1, progressEnd: 0.22 },
  "mount-n5": { progressStart: 0.22, progressEnd: 0.98 },
};

export const N5_REGION_SLOT_TARGETS = {
  foothills: 20,
  "forest-trail": 17,
  "mount-n5": 95,
} as const;

export const N5_WORLD_LAYOUT = {
  branchReachMin: 14,
  branchReachMax: 28,
  foothillsBranchReachMax: 16,
  forestBranchReachMax: 14,
  branchXMin: 12,
  branchXMax: 88,
  spineXMin: 26,
  spineXMax: 74,
  foothillsSpineXMin: 32,
  foothillsSpineXMax: 68,
  spineAlternatingNudge: 3,
  laneSpread: 5.5,
  minRegionYGap: {
    foothills: 0.72,
    "forest-trail": 0.58,
    "mount-n5": 0.38,
  },
  portalYPercent: 5,
  canvasMinHeightVh: 480,
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

export function resolveN5RegionProgress(
  regionSlug: string,
  indexInRegion: number,
  countInRegion: number,
): number {
  const band = N5_REGION_PATH_BANDS[regionSlug as RegionSlug];
  if (!band) {
    return countInRegion > 1 ? indexInRegion / (countInRegion - 1) : 0.5;
  }
  if (countInRegion <= 1) return (band.progressStart + band.progressEnd) / 2;

  const t = indexInRegion / (countInRegion - 1);
  return band.progressStart + t * (band.progressEnd - band.progressStart);
}

export function resolveN5RegionY(
  regionSlug: string,
  indexInRegion: number,
  countInRegion: number,
): number {
  const band = N5_REGION_Y_BANDS[regionSlug as RegionSlug];
  if (!band) return 50;
  if (countInRegion <= 1) return (band.yMin + band.yMax) / 2;

  const t = indexInRegion / (countInRegion - 1);
  return band.yMax - t * (band.yMax - band.yMin);
}

export function resolveN5LaneOffset(indexInRegion: number, branchId: string): number {
  let hash = indexInRegion;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = (hash * 17 + branchId.charCodeAt(i)) | 0;
  }
  const lane = hash % 5;
  return (lane - 2) * N5_WORLD_LAYOUT.laneSpread;
}

export function resolveN5BranchSide(branchId: string, climbRank: number): number {
  let hash = climbRank * 31;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = (hash * 33 + branchId.charCodeAt(i)) | 0;
  }
  return (hash & 1) === 0 ? -1 : 1;
}

export function resolveN5BranchReach(regionSlug: string, climbRank: number): number {
  const { branchReachMin, branchReachMax, foothillsBranchReachMax, forestBranchReachMax } =
    N5_WORLD_LAYOUT;
  const slot = climbRank % 6;
  const span = branchReachMax - branchReachMin;
  const base = branchReachMin + (slot / 5) * span;

  if (regionSlug === "foothills") return Math.min(base, foothillsBranchReachMax);
  if (regionSlug === "forest-trail") return Math.min(base, forestBranchReachMax);
  return base;
}
