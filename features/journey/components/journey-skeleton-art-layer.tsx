import {
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type JourneySkeletonArtLayerProps = {
  className?: string;
};

/**
 * Dev scaffold — zone bands only until sheet-extract art is wired in.
 * Lesson nodes define the path; art slots attach per zone in production.
 */
export function JourneySkeletonArtLayer({ className }: JourneySkeletonArtLayerProps) {
  const bands = buildWorldTreeZoneBands();

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      data-journey-art-layer
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
            className="absolute inset-x-0 border-t border-white/[0.06]"
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
            }}
          >
            <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-black/20 dark:text-white/15">
              {zone.label}
            </span>
          </section>
        );
      })}
    </div>
  );
}
