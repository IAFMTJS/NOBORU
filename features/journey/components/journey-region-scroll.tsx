"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";

import { JourneyRegionSection } from "@/features/journey/components/journey-region-section";
import { resolveJourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";
import type {
  JourneyNode,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import { resolveVisualTier } from "@/lib/performance/visual-tier";
import { cn } from "@/lib/utils";

type JourneyRegionScrollProps = {
  region: JourneyRegionViewModel;
  trialHref?: string | null;
  trialTitle?: string | null;
  onNodeSelect?: (node: JourneyNode) => void;
  className?: string;
};

export function JourneyRegionScroll({
  region,
  trialHref,
  trialTitle,
  onNodeSelect,
  className,
}: JourneyRegionScrollProps) {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const visualTier = resolveVisualTier();
  const visualSettings = useMemo(
    () => resolveJourneyVisualSettings(visualTier),
    [visualTier],
  );

  const currentNodeId = useMemo(() => {
    if (region.currentNodeIndex !== null) {
      return region.nodes[region.currentNodeIndex]?.id ?? null;
    }
    return (
      region.nodes.find((node) => node.state === "in_progress") ??
      region.nodes.find((node) => node.state === "available")
    )?.id ?? null;
  }, [region.currentNodeIndex, region.nodes]);

  useEffect(() => {
    if (!currentNodeId || !scrollRef.current) return;

    const activeElement = scrollRef.current.querySelector(
      `[data-journey-node-id="${currentNodeId}"]`,
    );
    if (!activeElement) return;

    activeElement.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [currentNodeId, prefersReducedMotion, region.slug]);

  const updateViewportCenter = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const section = scrollEl.querySelector<HTMLElement>(
      "[data-journey-region-section]",
    );
    if (!section) return;

    const scrollRect = scrollEl.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const viewportCenter = scrollRect.top + scrollRect.height / 2;
    const relativeCenter = viewportCenter - sectionRect.top;
    if (sectionRect.height <= 0) return;

    const centerY = Math.min(
      100,
      Math.max(0, (relativeCenter / sectionRect.height) * 100),
    );
    section.style.setProperty("--journey-viewport-center-y", `${centerY}`);
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    updateViewportCenter();
    scrollEl.addEventListener("scroll", updateViewportCenter, { passive: true });
    window.addEventListener("resize", updateViewportCenter);

    return () => {
      scrollEl.removeEventListener("scroll", updateViewportCenter);
      window.removeEventListener("resize", updateViewportCenter);
    };
  }, [region.slug, updateViewportCenter]);

  if (region.nodes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-body-sm text-muted-foreground">
        No lessons on this trail yet.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {trialHref && trialTitle ? (
        <div className="sticky top-0 z-20 px-4 pb-2 pt-2">
          <Link
            href={trialHref}
            className="block rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-body-sm font-medium text-primary backdrop-blur-md"
          >
            Boss Trial · {trialTitle}
          </Link>
        </div>
      ) : null}

      <JourneyRegionSection
        region={region}
        theme={resolvedTheme}
        loadArtwork
        artPriority
        visualSettings={visualSettings}
        showFox
        onNodeSelect={onNodeSelect}
        immersive
      />
    </div>
  );
}
