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
import { JOURNEY_JLPT_BAND_ART } from "@/features/journey/constants/journey.constants";
import {
  resolveWorldTreeScrollTargetTop,
} from "@/features/journey/utils/world-tree-scroll-focus.utils";
import type { WorldTreeVisibleYBand } from "@/features/journey/utils/world-tree-layout.utils";
import { LazyWorldArtLayer } from "@/features/worlds/components/lazy-world-art-layer";
import { WorldBackdrop } from "@/features/worlds/components/world-backdrop";
import { WorldPortal } from "@/features/worlds/components/world-portal";
import { useWorldPortalNavigation } from "@/features/worlds/components/world-portal-transition";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { WorldPortalState } from "@/features/worlds/types/world.types";
import {
  buildWorldLayout,
  findPlottedNode,
} from "@/features/worlds/utils/world-layout.utils";
import { cn } from "@/lib/utils";

export type WorldCanvasHandle = {
  scrollToYPercent: (yPercent: number) => void;
};

type WorldCanvasProps = {
  worldPath: JlptWorldPathViewModel;
  regionName: string;
  portal: WorldPortalState;
  className?: string;
  variant?: "journey" | "overview";
  focusYPercent?: number | null;
  anchorScrollToBottom?: boolean;
  highlightNodeId?: string | null;
};

/** Single JLPT world canvas — loads only this world's tree, art, and portal. */
export const WorldCanvas = forwardRef<WorldCanvasHandle, WorldCanvasProps>(
  function WorldCanvas(
    {
      worldPath,
      regionName,
      portal,
      className,
      variant = "journey",
      focusYPercent = null,
      anchorScrollToBottom = false,
      highlightNodeId = null,
    },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { navigateToWorld, transitionOverlay } = useWorldPortalNavigation();
    const layout = useMemo(() => buildWorldLayout(worldPath), [worldPath]);
    const canvasMinHeightVh = layout.canvasMinHeightVh;
    const isOverview = variant === "overview";
    const { world } = worldPath;

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
    }, [anchorScrollToBottom, focusYPercent]);

    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      const report = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight <= 0) return;

        const buffer = 8;
        const min = (scrollTop / scrollHeight) * 100 - buffer;
        const max = ((scrollTop + clientHeight) / scrollHeight) * 100 + buffer;

        setVisibleYBand({ min, max });
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
    }, [canvasMinHeightVh]);

    const handlePortalActivate = () => {
      if (portal.nextWorldHref) {
        navigateToWorld(portal.nextWorldHref);
      }
    };

    return (
      <>
        {transitionOverlay}
        <div
          ref={scrollRef}
          className={cn(
            "h-full min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
            className,
          )}
          aria-label={`${world.theme.label} learning world`}
          data-jlpt-world={world.id}
          data-world-tree-variant={variant}
        >
          <div className="relative mx-auto w-full min-w-full max-w-phone">
            <div
              className="relative w-full"
              style={{ minHeight: `${canvasMinHeightVh}vh` }}
            >
              <WorldBackdrop theme={world.theme} className="z-0" />
              {JOURNEY_JLPT_BAND_ART ? (
                <LazyWorldArtLayer worldId={world.id} className="z-[1] min-h-full" />
              ) : null}
              <JourneySkeletonArtLayer
                journey={worldPath.journey}
                layout={layout}
                variant={variant}
                hideScaffold={JOURNEY_JLPT_BAND_ART}
                continuousTrail={isOverview}
                coloredTrailByJlpt={isOverview}
                className="min-h-full"
              />
              <JourneyWorldNodeLayer
                journey={worldPath.journey}
                regionName={regionName}
                layout={layout}
                highlightNodeId={highlightNodeId}
                visibleYBand={visibleYBand}
                useArtNodes={isOverview}
                className="z-10"
              />
              <WorldPortal
                portal={portal}
                accentColor={world.theme.accentColor}
                accentGlow={world.theme.accentGlow}
                worldId={world.id}
                onActivate={handlePortalActivate}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);

export { findPlottedNode, buildWorldLayout };
