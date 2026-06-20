"use client";

import {
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { WorldTreeSpinePath } from "@/features/journey/components/world-tree-spine-path";
import { WorldTreeTrunkSkeleton } from "@/features/journey/components/world-tree-trunk-skeleton";
import {
  buildWorldTreeLayout,
  buildWorldTreeZoneBands,
  type WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type JourneySkeletonArtLayerProps = {
  journey?: JourneyPathViewModel;
  layout?: WorldTreeLayoutResult;
  className?: string;
  /** Overview mode shows JLPT tags and per-zone node counts. */
  variant?: "journey" | "overview";
};

const ZONE_TINTS: Record<string, string> = {
  deep_roots: "bg-[#1a1410]/30 dark:bg-[#0a0806]/50",
  n5_roots: "bg-[#2a2218]/25 dark:bg-[#12100c]/40",
  n4_foothills: "bg-[#2e2818]/20 dark:bg-[#14120e]/35",
  n3_trunk_1: "bg-[#2a2418]/18 dark:bg-[#12100c]/32",
  n3_trunk_2: "bg-[#2a2418]/16 dark:bg-[#12100c]/28",
  n3_trunk_3: "bg-[#2a2418]/14 dark:bg-[#12100c]/24",
  n2_canopy: "bg-[#1e2818]/18 dark:bg-[#0e120c]/32",
  n1_celestial: "bg-[#1a1828]/22 dark:bg-[#0c0a14]/38",
};

/**
 * Skeleton World Tree — zone bands, trunk corridor, spine paths.
 * Lesson nodes define the path; art tiles attach per zone in a later pass.
 */
export function JourneySkeletonArtLayer({
  journey,
  layout: layoutProp,
  className,
  variant = "journey",
}: JourneySkeletonArtLayerProps) {
  const emptyJourney: JourneyPathViewModel = { regions: [], position: { currentRegionSlug: "foothills", currentRegionIndex: 0, currentLessonId: null, currentNodeId: null, globalNodeIndex: 0, globalLessonIndex: 0, pathPosition: 0 }, nextLessonId: null, nextLessonHref: null };
  const layout = layoutProp ?? (journey ? buildWorldTreeLayout(journey) : buildWorldTreeLayout(emptyJourney));
  const bands = buildWorldTreeZoneBands();
  const isOverview = variant === "overview";

  const nodeCountByZone = layout.nodes.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.zoneId] = (counts[entry.zoneId] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      data-journey-art-layer="skeleton"
      aria-hidden
    >
      {WORLD_TREE_SKELETON_ZONES.map((zone) => {
        const band = bands[zone.id];
        const height = band.yMax - band.yMin;

        return (
          <section
            key={zone.id}
            data-world-tree-zone={zone.id}
            data-jlpt-level={zone.jlptLevel}
            className={cn(
              "absolute inset-x-0 border-t border-[#8B7355]/20 dark:border-[#A0896C]/15",
              ZONE_TINTS[zone.id],
            )}
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
            }}
          >
            <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-[#6B5344]/50 dark:text-[#D6A85F]/35">
              {zone.label}
              {isOverview ? (
                <span className="ml-1.5 normal-case tracking-normal opacity-80">
                  · {zone.jlptLevel === "deep" ? "Start" : zone.jlptLevel.toUpperCase()}
                  {nodeCountByZone[zone.id] ? ` · ${nodeCountByZone[zone.id]} nodes` : null}
                </span>
              ) : null}
            </span>
            {isOverview && zone.id.startsWith("n3_trunk") ? (
              <span className="absolute right-3 top-2 text-[9px] font-semibold uppercase tracking-widest text-[#D6A85F]/45">
                Trunk ring
              </span>
            ) : null}
          </section>
        );
      })}

      <WorldTreeTrunkSkeleton />

      {/* World Heart marker */}
      <div
        className="absolute left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center"
        style={{ bottom: "1.5%" }}
        data-world-tree-heart
      >
        <span className="h-4 w-4 rounded-full border-2 border-[#D6A85F]/80 bg-[#D6A85F]/50 shadow-[0_0_16px_rgba(214,168,95,0.65)]" />
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-[#8B7355]/70 dark:text-[#D6A85F]/60">
          World Heart
        </span>
      </div>

      <WorldTreeSpinePath segments={layout.segments} nodes={layout.nodes} />
    </div>
  );
}
