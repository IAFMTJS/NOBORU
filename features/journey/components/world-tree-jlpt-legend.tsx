"use client";

import Link from "next/link";

import {
  WORLD_TREE_JLPT_BANDS,
  resolveJlptBandForRegion,
  resolveJlptBandLabel,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type WorldTreeJlptLegendProps = {
  journey: JourneyPathViewModel;
  className?: string;
};

/** Regions grouped under their JLPT band on the World Tree overview. */
export function WorldTreeJlptLegend({ journey, className }: WorldTreeJlptLegendProps) {
  const grouped = WORLD_TREE_JLPT_BANDS.map((band) => ({
    band,
    regions: journey.regions.filter(
      (region) => resolveJlptBandForRegion(region.slug) === band.id,
    ),
  })).filter((entry) => entry.regions.length > 0);

  return (
    <aside
      className={cn(
        "pointer-events-auto absolute left-12 top-[5.75rem] z-30 max-w-[42%] space-y-2",
        className,
      )}
      data-world-tree-jlpt-legend
      aria-label="JLPT regions on the World Tree"
    >
      {grouped.map(({ band, regions }) => (
        <section key={band.id} data-jlpt-legend-band={band.id}>
          <p
            className="mb-0.5 text-[8px] font-bold uppercase tracking-widest text-white/70"
            style={{ color: band.accentColor }}
          >
            {band.label}
          </p>
          <ul className="space-y-0.5">
            {regions.map((region) => (
              <li key={region.id}>
                <Link
                  href={`/tree?jlpt=${band.id}&region=${region.slug}`}
                  className="block rounded-md bg-black/25 px-2 py-1 backdrop-blur-sm transition hover:bg-black/40 dark:bg-black/45"
                >
                  <span className="block truncate text-[9px] font-semibold uppercase tracking-wide text-white/90">
                    {region.name}
                  </span>
                  <span className="block truncate text-[8px] text-white/55">
                    {region.lessonCount} lessons · {region.progressPercent}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}

export type { WorldTreeJlptBandId };
