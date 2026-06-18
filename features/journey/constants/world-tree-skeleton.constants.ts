import type { JlptLevel } from "@/lib/content/types";
import type { RegionSlug } from "@/lib/design-system/regions";
import { WORLD_TREE_SEAM_OVERLAP_PERCENT } from "@/lib/assets/art-library-paths";

/**
 * Authoritative World Tree skeleton from docs/Skeleton world tree.md.
 * Art tiles attach to zones; lesson nodes plot on the trunk corridor.
 *
 * @see Art Library/world-tree/sheet-extracts/
 * @see docs/World tree bible.md
 */

export const WORLD_TREE_MANIFEST_ANCHORS = {
  trunkCenterXPercent: 50,
  trunkWidthPercent: 28,
  pathCorridorWidthPercent: 32,
  seamOverlapPercent: WORLD_TREE_SEAM_OVERLAP_PERCENT,
} as const;

export type WorldTreeZoneId =
  | "deep_roots"
  | "n5_roots"
  | "n4_foothills"
  | "n3_trunk_1"
  | "n3_trunk_2"
  | "n3_trunk_3"
  | "n2_canopy"
  | "n1_celestial";

export type WorldTreeZone = {
  id: WorldTreeZoneId;
  jlptLevel: JlptLevel | "deep";
  label: string;
  /** Share of total skeleton height (must sum to 100). */
  heightPercent: number;
};

/** Bottom → top ascent bands. y=100 is journey start, y=0 is crown. */
export const WORLD_TREE_SKELETON_ZONES: readonly WorldTreeZone[] = [
  {
    id: "deep_roots",
    jlptLevel: "deep",
    label: "Deep Root Network",
    heightPercent: 4,
  },
  {
    id: "n5_roots",
    jlptLevel: "n5",
    label: "N5 Roots",
    heightPercent: 14,
  },
  {
    id: "n4_foothills",
    jlptLevel: "n4",
    label: "N4 Foothills",
    heightPercent: 18,
  },
  {
    id: "n3_trunk_1",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring I",
    heightPercent: 12,
  },
  {
    id: "n3_trunk_2",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring II",
    heightPercent: 12,
  },
  {
    id: "n3_trunk_3",
    jlptLevel: "n3",
    label: "N3 Trunk · Ring III",
    heightPercent: 10,
  },
  {
    id: "n2_canopy",
    jlptLevel: "n2",
    label: "N2 Canopy",
    heightPercent: 15,
  },
  {
    id: "n1_celestial",
    jlptLevel: "n1",
    label: "N1 Celestial Crown",
    heightPercent: 15,
  },
] as const;

/** Virtual canvas height reserved for the full skeleton (future art stacks upward). */
export const WORLD_TREE_SKELETON_VH_PER_PERCENT = 6;
export const WORLD_TREE_SKELETON_MIN_HEIGHT_VH =
  WORLD_TREE_SKELETON_ZONES.reduce((sum, zone) => sum + zone.heightPercent, 0) *
  WORLD_TREE_SKELETON_VH_PER_PERCENT;

/**
 * Maps app region slugs to skeleton zones until branch tables exist.
 * Multiple regions may share a zone — layout splits the band among them.
 */
export const REGION_SLUG_TO_WORLD_TREE_ZONE: Partial<
  Record<RegionSlug, WorldTreeZoneId>
> = {
  foothills: "n4_foothills",
  "mount-n5": "n5_roots",
  "forest-trail": "n4_foothills",
  "mount-n4": "n3_trunk_1",
  "mount-n3": "n3_trunk_2",
  "mount-n2": "n2_canopy",
  "mount-n1": "n1_celestial",
  "master-summit": "n1_celestial",
};

export const DEFAULT_WORLD_TREE_ZONE: WorldTreeZoneId = "n4_foothills";
