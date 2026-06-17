"use client";

import { useEffect, useRef } from "react";

import { JourneyWorldNodeLayer } from "@/features/journey/components/journey-world-node-layer";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { WorldTreeStack } from "@/components/visual/world/world-tree-stack";
import { JOURNEY_WORLD_TREE_TILE_STACK } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type JourneyWorldCanvasProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  className?: string;
  /** Scroll focus along canvas height (0 = top, 100 = bottom). */
  focusYPercent?: number | null;
};

/** World Tree journey canvas — vertically stacked modular art tiles with seam overlap. */
export function JourneyWorldCanvas({
  journey,
  regionName,
  className,
  focusYPercent = null,
}: JourneyWorldCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (focusYPercent == null) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
      return;
    }

    const focusY = (focusYPercent / 100) * container.scrollHeight;
    const targetTop = focusY - container.clientHeight * 0.55;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  }, [focusYPercent]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "h-full min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
      aria-label="World tree journey"
    >
      <div className="relative mx-auto w-full min-w-full max-w-phone">
        <div className="relative w-full">
          <WorldTreeStack tiles={JOURNEY_WORLD_TREE_TILE_STACK} />
          <JourneyWorldNodeLayer journey={journey} regionName={regionName} />
        </div>
      </div>
    </div>
  );
}
