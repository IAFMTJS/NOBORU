"use client";

import { useEffect, useMemo, useRef } from "react";

import { JourneySkeletonArtLayer } from "@/features/journey/components/journey-skeleton-art-layer";
import { JourneyWorldNodeLayer } from "@/features/journey/components/journey-world-node-layer";
import {
  buildWorldTreeLayout,
  findPlottedNode,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type JourneyWorldCanvasProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  className?: string;
  /** Scroll focus along canvas height (0 = top, 100 = bottom). */
  focusYPercent?: number | null;
  /** When true, anchor the focus point near the bottom of the viewport (journey start). */
  anchorScrollToBottom?: boolean;
  /** Deep link: highlight a specific node id. */
  highlightNodeId?: string | null;
  /** Deep link: scroll to zone band center. */
  focusZoneId?: string | null;
};

/** World Tree journey canvas — CSS skeleton only (no sheet-remaster assets). */
export function JourneyWorldCanvas({
  journey,
  regionName,
  className,
  focusYPercent = null,
  anchorScrollToBottom = false,
  highlightNodeId = null,
}: JourneyWorldCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const layout = useMemo(() => buildWorldTreeLayout(journey), [journey]);
  const canvasMinHeightVh = layout.canvasMinHeightVh;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (focusYPercent == null || anchorScrollToBottom) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
      return;
    }

    const focusY = (focusYPercent / 100) * container.scrollHeight;
    const targetTop = focusY - container.clientHeight * 0.55;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  }, [anchorScrollToBottom, focusYPercent]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "h-full min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
      aria-label="World tree journey"
      data-journey-skeleton-mode="true"
    >
      <div className="relative mx-auto w-full min-w-full max-w-phone">
        <div
          className="relative w-full"
          style={{ minHeight: `${canvasMinHeightVh}vh` }}
        >
          <JourneySkeletonArtLayer
            journey={journey}
            layout={layout}
            className="min-h-full"
          />
          <JourneyWorldNodeLayer
            journey={journey}
            regionName={regionName}
            layout={layout}
            highlightNodeId={highlightNodeId}
            className="z-10"
          />
        </div>
      </div>
    </div>
  );
}

export { findPlottedNode, buildWorldTreeLayout };
