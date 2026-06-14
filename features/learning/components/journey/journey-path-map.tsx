"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { MotionDiv } from "@/components/motion/motion-div";
import { JourneyPathNode } from "@/features/learning/components/journey/journey-path-node";
import { JourneyPathSpine } from "@/features/learning/components/journey/journey-path-spine";
import { computePathCoordinates } from "@/features/learning/components/journey/path-geometry";
import type { JourneyNode, JourneyRegionViewModel } from "@/features/learning/types/journey.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

type JourneyPathMapProps = {
  region: JourneyRegionViewModel;
  trialHref?: string | null;
  trialTitle?: string | null;
  onNodeSelect?: (node: JourneyNode) => void;
  className?: string;
};

function resolveCurrentNode(
  region: JourneyRegionViewModel,
): JourneyNode | null {
  if (region.currentNodeIndex !== null) {
    return region.nodes[region.currentNodeIndex] ?? null;
  }

  return (
    region.nodes.find((node) => node.state === "in_progress") ??
    region.nodes.find((node) => node.state === "available") ??
    null
  );
}

export function JourneyPathMap({
  region,
  trialHref,
  trialTitle,
  onNodeSelect,
  className,
}: JourneyPathMapProps) {
  const { resolvedTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const visuals = getRegionVisuals(region.slug);
  const currentNode = resolveCurrentNode(region);

  const geometryOptions = useMemo(
    () => ({
      regionSlug: region.slug,
      theme: resolvedTheme,
    }),
    [region.slug, resolvedTheme],
  );

  const pathHeightPercent = useMemo(() => {
    const maxY = region.nodes.reduce((max, node) => {
      const { y } = computePathCoordinates(node.pathPosition, geometryOptions);
      return Math.max(max, y);
    }, 0);
    const minY = region.nodes.reduce((min, node) => {
      const { y } = computePathCoordinates(node.pathPosition, geometryOptions);
      return Math.min(min, y);
    }, 100);
    return Math.max(100, maxY - minY + 16);
  }, [geometryOptions, region.nodes]);

  useEffect(() => {
    if (!currentNode || !scrollRef.current) return;

    const activeElement = scrollRef.current.querySelector(
      `[data-journey-node-id="${currentNode.id}"]`,
    );
    if (!activeElement) return;

    activeElement.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [currentNode, prefersReducedMotion, region.slug]);

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

      <div
        className={cn(
          "relative mx-auto w-full max-w-lg px-4 pb-24 pt-6",
          "bg-gradient-to-b",
          visuals.gradient,
        )}
        style={{ minHeight: `${pathHeightPercent}vh` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <TrailMapArtwork
            theme={resolvedTheme}
            regionSlug={region.slug}
            immersive
            priority
            scrim="minimal"
          />
        </div>

        <div
          className="relative w-full"
          style={{ paddingBottom: `${pathHeightPercent}%` }}
        >
          <JourneyPathSpine
            nodes={region.nodes}
            regionSlug={region.slug}
            theme={resolvedTheme}
          />

          <div
            className="absolute inset-0"
            role="list"
            aria-label={`${region.name} learning path`}
          >
            {region.nodes.map((node, index) => {
              const { x, y } = computePathCoordinates(
                node.pathPosition,
                geometryOptions,
              );
              const isCurrent = currentNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  role="listitem"
                  data-journey-node-id={node.id}
                  data-journey-node-index={index}
                  className="absolute z-10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <MotionDiv
                    {...trailNodeReveal}
                    transition={{ delay: Math.min(index * 0.03, 0.6) }}
                  >
                    <JourneyPathNode
                      node={node}
                      isCurrent={isCurrent}
                      onSelect={
                        node.kind === "lesson" || node.kind === "checkpoint"
                          ? onNodeSelect
                          : undefined
                      }
                    />
                  </MotionDiv>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
