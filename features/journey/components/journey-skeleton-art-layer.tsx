"use client";

import {
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { WorldTreeSpinePath } from "@/features/journey/components/world-tree-spine-path";
import {
  buildWorldTreeLayout,
  buildWorldTreeZoneBands,
  type WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type JourneySkeletonArtLayerProps = {
  journey?: JourneyPathViewModel;
  layout?: WorldTreeLayoutResult;
  className?: string;
};

const ZONE_TINTS: Record<string, string> = {
  deep_roots: "bg-[#1a1410]/20 dark:bg-[#0a0806]/40",
  n5_roots: "bg-[#2a2218]/15 dark:bg-[#12100c]/30",
  n4_foothills: "bg-[#2e2818]/12 dark:bg-[#14120e]/25",
  n3_trunk_1: "bg-[#2a2418]/12 dark:bg-[#12100c]/25",
  n3_trunk_2: "bg-[#2a2418]/10 dark:bg-[#12100c]/22",
  n3_trunk_3: "bg-[#2a2418]/8 dark:bg-[#12100c]/20",
  n2_canopy: "bg-[#1e2818]/12 dark:bg-[#0e120c]/25",
  n1_celestial: "bg-[#1a1828]/15 dark:bg-[#0c0a14]/30",
};

/**
 * Skeleton World Tree — zone bands, trunk corridor, spine paths.
 * Lesson nodes define the path; art tiles attach per zone in a later pass.
 */
export function JourneySkeletonArtLayer({
  journey,
  layout: layoutProp,
  className,
}: JourneySkeletonArtLayerProps) {
  const emptyJourney: JourneyPathViewModel = { regions: [], position: { currentRegionSlug: "foothills", currentRegionIndex: 0, currentLessonId: null, currentNodeId: null, globalNodeIndex: 0, globalLessonIndex: 0, pathPosition: 0 }, nextLessonId: null, nextLessonHref: null };
  const layout = layoutProp ?? (journey ? buildWorldTreeLayout(journey) : buildWorldTreeLayout(emptyJourney));
  const bands = buildWorldTreeZoneBands();
  const { trunkCenterXPercent, trunkWidthPercent } = WORLD_TREE_MANIFEST_ANCHORS;

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
              "absolute inset-x-0 border-t border-white/[0.08] dark:border-white/[0.06]",
              ZONE_TINTS[zone.id],
            )}
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
            }}
          >
            <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-black/25 dark:text-white/20">
              {zone.label}
            </span>
          </section>
        );
      })}

      {/* Trunk corridor */}
      <div
        className="absolute inset-y-0 border-x border-[#8B7355]/25 bg-gradient-to-b from-[#6B5344]/10 via-[#8B7355]/15 to-[#6B5344]/10 dark:border-[#A0896C]/20 dark:from-[#4A3828]/20 dark:via-[#6B5344]/25 dark:to-[#4A3828]/20"
        style={{
          left: `${trunkCenterXPercent - trunkWidthPercent / 2}%`,
          width: `${trunkWidthPercent}%`,
        }}
        data-world-tree-trunk
      />

      {/* World Heart marker */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
        style={{ bottom: "1.5%" }}
        data-world-tree-heart
      >
        <span className="h-3 w-3 rounded-full bg-[#D6A85F]/70 shadow-[0_0_12px_rgba(214,168,95,0.5)]" />
        <span className="mt-1 text-[9px] font-medium uppercase tracking-widest text-black/30 dark:text-white/25">
          World Heart
        </span>
      </div>

      <WorldTreeSpinePath segments={layout.segments} />
    </div>
  );
}
