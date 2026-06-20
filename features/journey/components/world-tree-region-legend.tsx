"use client";

import Link from "next/link";

import { REGION_SLUG_TO_WORLD_TREE_ZONE } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import type { RegionSlug } from "@/lib/design-system/regions";
import { cn } from "@/lib/utils";

type WorldTreeRegionLegendProps = {
  journey: JourneyPathViewModel;
  className?: string;
};

/** Region ↔ zone map for the full-tree overview (docs/Skeleton world tree.md). */
export function WorldTreeRegionLegend({ journey, className }: WorldTreeRegionLegendProps) {
  const bands = buildWorldTreeZoneBands();

  return (
    <aside
      className={cn(
        "pointer-events-auto absolute left-2 top-[5.5rem] z-30 max-w-[38%] space-y-1",
        className,
      )}
      data-world-tree-region-legend
      aria-label="Journey regions on the World Tree"
    >
      {journey.regions.map((region) => {
        const zoneId = REGION_SLUG_TO_WORLD_TREE_ZONE[region.slug as RegionSlug];
        const band = zoneId ? bands[zoneId] : null;
        const centerY = band ? (band.yMin + band.yMax) / 2 : null;

        return (
          <Link
            key={region.id}
            href={centerY != null ? `/tree?zone=${zoneId}` : `/tree?region=${region.slug}`}
            className="block rounded-md bg-black/25 px-2 py-1 backdrop-blur-sm transition hover:bg-black/35 dark:bg-black/40"
          >
            <span className="block truncate font-sans text-[9px] font-semibold uppercase tracking-wide text-white/90">
              {region.name}
            </span>
            <span className="block truncate text-[8px] text-white/60">
              {region.lessonCount} lessons · {region.progressPercent}%
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
