"use client";

import { useCallback, useEffect, useState } from "react";

import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";
import { JOURNEY_MOCKUP } from "@/features/journey/constants/journey-mockup.constants";
import { cn } from "@/lib/utils";

type JourneyScrollIndicatorProps = {
  journey: JourneyPathViewModel;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

type RailMarker = {
  id: string;
  label: string;
  ratio: number;
  isCurrent: boolean;
  isLocked: boolean;
};

function buildMarkers(journey: JourneyPathViewModel): RailMarker[] {
  const markers: RailMarker[] = [];
  let offset = 0;
  const totalNodes = journey.regions.reduce((sum, r) => sum + r.nodes.length, 0);

  for (const region of journey.regions) {
    if (region.nodes.length === 0) continue;
    const regionWeight = region.nodes.length / Math.max(totalNodes, 1);
    const midRatio = offset + regionWeight / 2;
    markers.push({
      id: region.slug,
      label: region.name,
      ratio: midRatio,
      isCurrent: region.slug === journey.position.currentRegionSlug,
      isLocked: region.availability === "locked",
    });
    offset += regionWeight;
  }

  return markers;
}

/** Right-edge scroll progress rail — mockup "LONG TRAIL" discoverability. */
export function JourneyScrollIndicator({
  journey,
  scrollContainerRef,
  className,
}: JourneyScrollIndicatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const markers = buildMarkers(journey);

  const updateProgress = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max <= 0 ? 0 : el.scrollTop / max);
  }, [scrollContainerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [scrollContainerRef, updateProgress, journey.regions.length]);

  if (markers.length < 2) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-2 top-24 z-20 flex flex-col items-center bottom-nav-clearance",
        className,
      )}
      aria-hidden
    >
      <div
        className="relative h-full w-1 rounded-full bg-white/10"
        style={{ width: JOURNEY_MOCKUP.scrollRail.widthPx }}
      >
        <div
          className="absolute inset-x-0 top-0 rounded-full bg-trail-glow/70 transition-[height] duration-150 motion-reduce:transition-none"
          style={{
            height: `${Math.min(100, scrollProgress * 100)}%`,
            boxShadow: "0 0 8px hsl(var(--trail-glow) / 0.5)",
          }}
        />
        {markers.map((marker) => (
          <span
            key={marker.id}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 rounded-full border transition-colors",
              marker.isCurrent
                ? "border-trail-glow bg-trail-glow shadow-[0_0_6px_hsl(var(--trail-glow)/0.6)]"
                : marker.isLocked
                  ? "border-white/20 bg-white/15"
                  : "border-white/30 bg-white/25",
            )}
            style={{
              top: `${marker.ratio * 100}%`,
              width: marker.isCurrent
                ? JOURNEY_MOCKUP.scrollRail.dotSizePx + 2
                : JOURNEY_MOCKUP.scrollRail.dotSizePx,
              height: marker.isCurrent
                ? JOURNEY_MOCKUP.scrollRail.dotSizePx + 2
                : JOURNEY_MOCKUP.scrollRail.dotSizePx,
            }}
            title={marker.label}
          />
        ))}
      </div>
    </div>
  );
}
