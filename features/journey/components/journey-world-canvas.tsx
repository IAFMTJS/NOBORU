"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { JourneySkeletonArtLayer } from "@/features/journey/components/journey-skeleton-art-layer";
import { JourneyWorldNodeLayer } from "@/features/journey/components/journey-world-node-layer";
import { WorldTreeJlptArtStack } from "@/features/journey/components/world-tree-jlpt-art-stack";
import { WorldTreeRealmBackdrop } from "@/features/journey/components/world-tree-realm-backdrop";
import { WorldTreeUndergroundLayer } from "@/features/journey/components/world-tree-underground-layer";
import { JOURNEY_JLPT_BAND_ART } from "@/features/journey/constants/journey.constants";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  buildWorldTreeLayout,
  findPlottedNode,
  type WorldTreeLayoutResult,
  type WorldTreeVisibleYBand,
} from "@/features/journey/utils/world-tree-layout.utils";
import {
  resolveWorldTreeScrollTargetTop,
} from "@/features/journey/utils/world-tree-scroll-focus.utils";
import { resolveWorldTreeUndergroundHeightVh } from "@/features/journey/utils/world-tree-underground-layout.utils";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

export type JourneyWorldCanvasHandle = {
  scrollToYPercent: (yPercent: number) => void;
};

type JourneyWorldCanvasProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  className?: string;
  layout?: WorldTreeLayoutResult;
  variant?: "journey" | "overview";
  /** Scroll focus along canvas height (0 = top, 100 = bottom). */
  focusYPercent?: number | null;
  /** When true, anchor the focus point near the bottom of the viewport (journey start). */
  anchorScrollToBottom?: boolean;
  /** Deep link: highlight a specific node id. */
  highlightNodeId?: string | null;
  /** Deep link: scroll to zone band center. */
  focusZoneId?: WorldTreeZoneId | null;
  /** Reports viewport center as canvas y-percent while scrolling (overview rail sync). */
  onViewportCenterYChange?: (yPercent: number) => void;
  /** Full-height flat canvas for screenshot export (no nested scroll). */
  exportMode?: boolean;
};

/** World Tree journey canvas — CSS skeleton only (no sheet-remaster assets). */
export const JourneyWorldCanvas = forwardRef<JourneyWorldCanvasHandle, JourneyWorldCanvasProps>(
  function JourneyWorldCanvas(
    {
      journey,
      regionName,
      className,
      layout: layoutProp,
      variant = "journey",
      focusYPercent = null,
      anchorScrollToBottom = false,
      highlightNodeId = null,
      onViewportCenterYChange,
      exportMode = false,
    },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const layout = useMemo(
      () => layoutProp ?? buildWorldTreeLayout(journey),
      [journey, layoutProp],
    );
    const canvasMinHeightVh = layout.canvasMinHeightVh;
    const isOverview = variant === "overview";
    const showUnderground = isOverview && JOURNEY_JLPT_BAND_ART;
    const undergroundHeightVh = showUnderground
      ? resolveWorldTreeUndergroundHeightVh(canvasMinHeightVh)
      : 0;
    const [visibleYBand, setVisibleYBand] = useState<WorldTreeVisibleYBand>({
      min: 0,
      max: 100,
    });
    const scrollRafRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      scrollToYPercent(yPercent: number) {
        const container = scrollRef.current;
        if (!container) return;

        container.scrollTo({
          top: resolveWorldTreeScrollTargetTop(container, yPercent),
          behavior: "smooth",
        });
      },
    }));

    useEffect(() => {
      if (exportMode) return;
      const container = scrollRef.current;
      if (!container) return;

      if (anchorScrollToBottom) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
        return;
      }

      if (focusYPercent == null) return;

      container.scrollTo({
        top: resolveWorldTreeScrollTargetTop(container, focusYPercent),
        behavior: "auto",
      });
    }, [anchorScrollToBottom, exportMode, focusYPercent]);

    useEffect(() => {
      if (exportMode) return;
      const container = scrollRef.current;
      if (!container) return;

      const report = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight <= 0) return;

        const buffer = 8;
        const min = (scrollTop / scrollHeight) * 100 - buffer;
        const max = ((scrollTop + clientHeight) / scrollHeight) * 100 + buffer;

        setVisibleYBand({ min, max });

        if (onViewportCenterYChange) {
          const centerY = scrollTop + clientHeight * 0.5;
          onViewportCenterYChange((centerY / scrollHeight) * 100);
        }
      };

      const onScroll = () => {
        if (scrollRafRef.current != null) return;
        scrollRafRef.current = window.requestAnimationFrame(() => {
          scrollRafRef.current = null;
          report();
        });
      };

      report();
      container.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", onScroll);
        if (scrollRafRef.current != null) {
          window.cancelAnimationFrame(scrollRafRef.current);
        }
      };
    }, [canvasMinHeightVh, exportMode, onViewportCenterYChange]);

    const nodeVisibleBand = exportMode ? undefined : visibleYBand;

    return (
      <div
        ref={scrollRef}
        className={cn(
          exportMode
            ? "overflow-visible"
            : "h-full min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
          className,
        )}
        aria-label={isOverview ? "World tree overview" : "World tree journey"}
        data-journey-skeleton-mode="true"
        data-world-tree-variant={variant}
        data-world-tree-export={exportMode ? "true" : undefined}
      >
        <div className="relative mx-auto w-full min-w-full max-w-phone">
          <div
            className="relative w-full"
            style={{ minHeight: `${canvasMinHeightVh}vh` }}
          >
            {isOverview || JOURNEY_JLPT_BAND_ART ? (
              <WorldTreeRealmBackdrop className="z-0" useJlptBands={isOverview} />
            ) : null}
            {JOURNEY_JLPT_BAND_ART ? (
              <WorldTreeJlptArtStack
                className="z-[1] min-h-full"
                showJlptChrome={isOverview}
              />
            ) : null}
            <JourneySkeletonArtLayer
              journey={journey}
              layout={layout}
              variant={variant}
              hideScaffold={JOURNEY_JLPT_BAND_ART}
              continuousTrail={isOverview}
              coloredTrailByJlpt={isOverview}
              className="min-h-full"
            />
            <JourneyWorldNodeLayer
              journey={journey}
              regionName={regionName}
              layout={layout}
              highlightNodeId={highlightNodeId}
              visibleYBand={nodeVisibleBand}
              useArtNodes={isOverview}
              className="z-10"
            />
          </div>

          {showUnderground ? (
            <div
              className="relative w-full border-t border-[#D6A85F]/10"
              style={{ height: `${undergroundHeightVh}vh` }}
              data-world-tree-underground-block
            >
              <WorldTreeUndergroundLayer className="h-full" />
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

export { findPlottedNode, buildWorldTreeLayout };
