"use client";

import { useEffect, useRef } from "react";

import { JourneyWorldTreeArtLayer } from "@/features/journey/components/journey-world-tree-art-layer";
import { JourneyWorldNodeLayer } from "@/features/journey/components/journey-world-node-layer";
import {
  countJourneyNodes,
  resolveWorldTreeCanvasMinHeightVh,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type JourneyWorldCanvasProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  className?: string;
  /** Scroll focus along canvas height (0 = top, 100 = bottom). */
  focusYPercent?: number | null;
};

/** World Tree journey canvas — sheet-remaster puzzle pieces on the skeleton. */
export function JourneyWorldCanvas({
  journey,
  regionName,
  className,
  focusYPercent = null,
}: JourneyWorldCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasMinHeightVh = resolveWorldTreeCanvasMinHeightVh(countJourneyNodes(journey));

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
        <div
          className="relative w-full"
          style={{ minHeight: `${canvasMinHeightVh}vh` }}
        >
          <JourneyWorldTreeArtLayer className="min-h-full" />
          <JourneyWorldNodeLayer journey={journey} regionName={regionName} className="z-10" />
        </div>
      </div>
    </div>
  );
}
