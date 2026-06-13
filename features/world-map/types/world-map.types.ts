import type { RegionSlug } from "@/lib/design-system/regions";

export type WorldMapRegionViewModel = {
  slug: RegionSlug;
  name: string;
  progressPercent: number;
  availability: "locked" | "available" | "completed";
  href: string;
};

export type WorldMapViewModel = {
  regions: WorldMapRegionViewModel[];
  currentRegionSlug: string;
};
