import {
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type JourneySkeletonArtLayerProps = {
  className?: string;
};

/**
 * Dev scaffold — zone bands only. No corridor lines; lesson nodes define the path.
 * ComfyUI tiles attach to `data-art-segment` slots in production.
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
            {zone.artSegmentIds?.map((segmentId, index, segments) => {
              const slice = 100 / segments.length;
              return (
                <div
                  key={segmentId}
                  data-art-segment={segmentId}
                  className="absolute inset-x-[22%] border border-dashed border-white/[0.06]"
                  style={{
                    top: `${index * slice}%`,
                    height: `${slice}%`,
                  }}
                />
              );
            })}

            <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-black/20 dark:text-white/15">
              {zone.label}
            </span>
          </section>
        );
      })}
    </div>
  );
}
