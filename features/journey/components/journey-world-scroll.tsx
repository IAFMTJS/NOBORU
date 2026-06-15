"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";

import { JourneyRegionGate } from "@/features/journey/components/journey-region-gate";
import { JourneyRegionSection } from "@/features/journey/components/journey-region-section";
import { resolveJourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import { resolveVisualTier } from "@/lib/performance/visual-tier";
import { cn } from "@/lib/utils";

type JourneyWorldScrollProps = {
  journey: JourneyPathViewModel;
  onNodeSelect?: (node: JourneyNode) => void;
  companionEvolutionSlug?: CompanionEvolutionSlug;
  scrollToRegionSlug?: string | null;
  scrollToNodeId?: string | null;
  selectedNodeId?: string | null;
  className?: string;
};

export function JourneyWorldScroll({
  journey,
  onNodeSelect,
  companionEvolutionSlug,
  scrollToRegionSlug = null,
  scrollToNodeId = null,
  selectedNodeId = null,
  className,
}: JourneyWorldScrollProps) {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const visualTier = resolveVisualTier();
  const visualSettings = useMemo(
    () => resolveJourneyVisualSettings(visualTier),
    [visualTier],
  );

  const currentNodeId = journey.position.currentNodeId;
  const currentRegionSlug = journey.position.currentRegionSlug;

  const scrollToSelector = useCallback(
    (selector: string, block: ScrollLogicalPosition = "center") => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      const target = scrollEl.querySelector(selector);
      if (!target) return;
      target.scrollIntoView({
        block,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    if (scrollToNodeId) {
      scrollToSelector(`[data-journey-node-id="${scrollToNodeId}"]`, "center");
      return;
    }
    if (!currentNodeId) return;
    scrollToSelector(`[data-journey-node-id="${currentNodeId}"]`, "center");
  }, [currentNodeId, scrollToNodeId, scrollToSelector]);

  useEffect(() => {
    if (!scrollToRegionSlug) return;
    scrollToSelector(`[data-journey-region-gate="${scrollToRegionSlug}"]`, "start");
  }, [scrollToRegionSlug, scrollToSelector]);

  const updateViewportCenter = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const sections = scrollEl.querySelectorAll<HTMLElement>(
      "[data-journey-region-section]",
    );
    const scrollRect = scrollEl.getBoundingClientRect();
    const viewportCenter = scrollRect.top + scrollRect.height / 2;

    sections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();
      const relativeCenter = viewportCenter - sectionRect.top;
      if (sectionRect.height <= 0) return;
      const centerY = Math.min(
        100,
        Math.max(0, (relativeCenter / sectionRect.height) * 100),
      );
      section.style.setProperty("--journey-viewport-center-y", `${centerY}`);
    });
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
  }, [journey.regions.length, updateViewportCenter]);

  if (journey.regions.every((region) => region.nodes.length === 0)) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-body-sm text-muted-foreground">
        The mountain trail is not ready yet.
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
      {journey.regions.map((region, index) => {
        const locked = region.availability === "locked";
        const isCurrentRegion = region.slug === currentRegionSlug;

        return (
          <div key={region.slug} className="relative">
            <JourneyRegionGate
              region={region}
              previousRegionName={
                index > 0 ? (journey.regions[index - 1]?.name ?? null) : null
              }
              className={locked ? "opacity-80" : undefined}
            />

            <JourneyRegionSection
              region={region}
              theme={resolvedTheme}
              loadArtwork={!locked || visualSettings.maxLoadedArtSections === 0}
              artPriority={isCurrentRegion}
              visualSettings={visualSettings}
              showFox={isCurrentRegion}
              companionEvolutionSlug={companionEvolutionSlug}
              dimmed={locked}
              immersive
              selectedNodeId={selectedNodeId}
              pulseNodeId={scrollToNodeId}
              onNodeSelect={locked ? undefined : onNodeSelect}
            />

            {locked ? (
              <div
                className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-background/55 via-background/35 to-background/65 backdrop-blur-[1px]"
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
