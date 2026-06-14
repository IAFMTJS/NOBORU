"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { MotionDiv } from "@/components/motion/motion-div";
import { JourneyEnvironmentLayers } from "@/features/journey/components/journey-environment-layers";
import { JourneyFoxCompanion } from "@/features/journey/components/journey-fox-companion";
import { JourneyPathNode } from "@/features/journey/components/journey-path-node";
import { JourneyPathSpine } from "@/features/journey/components/journey-path-spine";
import {
  computePathCoordinates,
  resolveJourneyMapScrollHeight,
} from "@/features/journey/components/path-geometry";
import { resolveJourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";
import { useJourneyScroll } from "@/features/journey/hooks/use-journey-scroll";
import type { JourneyNode, JourneyRegionViewModel } from "@/features/journey/types/journey.types";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import {
  resolveCurrentJourneyNode,
  resolveNodeDiscoveryOpacity,
} from "@/features/journey/utils/journey-map.utils";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { resolveVisualTier } from "@/lib/performance/visual-tier";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

type JourneyPathMapProps = {
  region: JourneyRegionViewModel;
  trialHref?: string | null;
  trialTitle?: string | null;
  companionEvolutionSlug?: CompanionEvolutionSlug;
  onNodeSelect?: (node: JourneyNode) => void;
  className?: string;
};

export function JourneyPathMap({
  region,
  trialHref,
  trialTitle,
  companionEvolutionSlug,
  onNodeSelect,
  className,
}: JourneyPathMapProps) {
  const { resolvedTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  const visuals = getRegionVisuals(region.slug);
  const currentNode = resolveCurrentJourneyNode(region);
  const visualSettings = useMemo(
    () => resolveJourneyVisualSettings(resolveVisualTier()),
    [],
  );

  const geometryOptions = useMemo(
    () => ({
      regionSlug: region.slug,
      theme: resolvedTheme,
    }),
    [region.slug, resolvedTheme],
  );

  const pathHeightVh = useMemo(
    () => resolveJourneyMapScrollHeight(region.slug, region.nodes, geometryOptions),
    [geometryOptions, region.nodes, region.slug],
  );

  const { viewportCenterY, parallaxOffsetPx } = useJourneyScroll({
    scrollRef,
    mapContentRef,
    currentNodeId: currentNode?.id ?? null,
    regionSlug: region.slug,
  });

  const effectiveParallax =
    parallaxOffsetPx * visualSettings.parallaxMultiplier;

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
        style={{ minHeight: `${pathHeightVh}vh` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <TrailMapArtwork
            theme={resolvedTheme}
            regionSlug={region.slug}
            immersive
            priority
            scrim="minimal"
            parallaxOffsetPx={effectiveParallax}
            loadArtwork
          />
          {visualSettings.environmentLayers ? <JourneyEnvironmentLayers /> : null}
        </div>

        <div
          ref={mapContentRef}
          className="relative w-full"
          style={{ minHeight: `${pathHeightVh}vh` }}
        >
          <JourneyPathSpine
            nodes={region.nodes}
            regionSlug={region.slug}
            theme={resolvedTheme}
          />

          {currentNode ? (
            <JourneyFoxCompanion
              currentNode={currentNode}
              geometryOptions={geometryOptions}
              evolutionSlug={companionEvolutionSlug}
            />
          ) : null}

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
              const discoveryOpacity = isCurrent
                ? 1
                : resolveNodeDiscoveryOpacity(
                    y,
                    viewportCenterY,
                    node.state,
                    node.kind,
                  );

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
                      discoveryOpacity={discoveryOpacity}
                      checkpointCelebration={visualSettings.checkpointCelebration}
                      trialTempleEffects={visualSettings.trialTempleEffects}
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

