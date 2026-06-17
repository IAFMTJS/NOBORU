import {
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type JourneySkeletonArtLayerProps = {
  className?: string;
};

/**
 * Empty art scaffold — zone bands and trunk corridor only.
 * ComfyUI tiles attach to `data-art-segment` slots later; no images loaded here.
 */
export function JourneySkeletonArtLayer({ className }: JourneySkeletonArtLayerProps) {
  const bands = buildWorldTreeZoneBands();
  const corridor = WORLD_TREE_MANIFEST_ANCHORS.pathCorridorWidthPercent;
  const trunkCenter = WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent;

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
            className="absolute inset-x-0 border-t border-white/[0.08] dark:border-white/[0.06]"
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
            }}
          >
            <div
              className="absolute inset-y-0 border-x border-dashed border-white/20 dark:border-white/15"
              style={{
                left: `${trunkCenter - corridor / 2}%`,
                width: `${corridor}%`,
              }}
              data-trunk-corridor
            />

            {zone.artSegmentIds?.map((segmentId, index, segments) => {
              const slice = 100 / segments.length;
              return (
                <div
                  key={segmentId}
                  data-art-segment={segmentId}
                  className="absolute inset-x-[18%] border border-dashed border-white/10 bg-black/[0.03] dark:bg-white/[0.02]"
                  style={{
                    top: `${index * slice}%`,
                    height: `${slice}%`,
                  }}
                />
              );
            })}

            <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-black/25 dark:text-white/20">
              {zone.label}
            </span>
          </section>
        );
      })}
    </div>
  );
}
