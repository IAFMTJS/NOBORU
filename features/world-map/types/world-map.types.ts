import type { RegionSlug } from "@/lib/design-system/regions";

export type WorldMapSpatialPosition = {
  /** Horizontal position along the climb path, 0–100%. */
  x: number;
  /** Vertical position along the climb path, 0–100%. */
  y: number;
};

export type WorldMapRegionAvailability = "locked" | "available" | "completed";

export type WorldMapRegionViewModel = {
  slug: RegionSlug;
  name: string;
  progressPercent: number;
  availability: WorldMapRegionAvailability;
  isCurrent: boolean;
  href: string;
  position: WorldMapSpatialPosition;
};

export type WorldMapViewModel = {
  regions: WorldMapRegionViewModel[];
  currentRegionSlug: string;
  /** Next lesson or current region trail — for "Return to current trail". */
  returnTrailHref: string;
};
