import type { RegionSlug } from "@/lib/design-system/regions";

/** N5 spine placement on the full world canvas (y=100 is base, y=0 is crown). */
export const N5_WORLD_LAYOUT = {
  trunkCenterX: 50,
  pathSway: 0.85,
  portalYPercent: 6,
  minNodeYGapPercent: 2.4,
  regionSpineRanges: {
    /** World Heart — bottom strip (y=100 is base). */
    foothills: { yMin: 86, yMax: 98 },
    /** Lower root network transition. */
    "forest-trail": { yMin: 58, yMax: 88 },
    /** Main N5 trunk climb — dense lesson spine. */
    "mount-n5": { yMin: 10, yMax: 60 },
  } satisfies Partial<Record<RegionSlug, { yMin: number; yMax: number }>>,
} as const;

export function resolveN5TrunkX(progress: number, nodeIndex: number): number {
  const { trunkCenterX, pathSway } = N5_WORLD_LAYOUT;
  const wave = Math.sin(progress * Math.PI * 1.15 + nodeIndex * 0.06) * pathSway;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 0.35;
  return trunkCenterX + wave + stagger;
}
