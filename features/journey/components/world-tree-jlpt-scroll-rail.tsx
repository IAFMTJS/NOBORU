"use client";

import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { cn } from "@/lib/utils";

type WorldTreeJlptScrollRailProps = {
  activeBandId?: WorldTreeJlptBandId | null;
  onBandSelect?: (bandId: WorldTreeJlptBandId, centerYPercent: number) => void;
  className?: string;
};

/** Right-edge JLPT rail — five colored markers for the full World Tree ascent. */
export function WorldTreeJlptScrollRail({
  activeBandId = null,
  onBandSelect,
  className,
}: WorldTreeJlptScrollRailProps) {
  const bands = buildWorldTreeJlptBandLayout();

  return (
    <nav
      aria-label="JLPT levels on the World Tree"
      className={cn(
        "pointer-events-auto absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center",
        className,
      )}
      data-world-tree-jlpt-scroll-rail
    >
      <div className="relative flex h-[min(72vh,520px)] w-1.5 flex-col rounded-full bg-black/15 dark:bg-white/10">
        {WORLD_TREE_JLPT_BANDS.map((band) => {
          const layout = bands.find((entry) => entry.id === band.id)!;
          const centerY = (layout.yMin + layout.yMax) / 2;
          const markerBottom = `${100 - centerY}%`;
          const isActive = activeBandId === band.id;

          return (
            <button
              key={band.id}
              type="button"
              title={band.label}
              aria-label={band.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onBandSelect?.(band.id, centerY)}
              className={cn(
                "absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md border-2 font-bold uppercase text-white transition-transform",
                isActive ? "h-7 w-7 text-[9px] shadow-lg" : "h-5 w-5 text-[7px] opacity-85 hover:scale-110",
              )}
              style={{
                bottom: markerBottom,
                borderColor: band.accentColor,
                backgroundColor: band.accentColor,
                boxShadow: isActive ? `0 0 12px ${band.accentGlow}` : undefined,
              }}
              data-jlpt-band-marker={band.id}
            >
              {band.id.toUpperCase()}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
