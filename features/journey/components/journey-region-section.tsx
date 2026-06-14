"use client";

import { useMemo } from "react";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { MotionDiv } from "@/components/motion/motion-div";
import { JourneyEnvironmentLayers } from "@/features/journey/components/journey-environment-layers";
import { JourneyFoxCompanion } from "@/features/journey/components/journey-fox-companion";
import { JourneyPathNode } from "@/features/journey/components/journey-path-node";
import { JourneyPathSpine } from "@/features/journey/components/journey-path-spine";
import { JourneyWeatherLayers } from "@/features/journey/components/journey-weather-layers";
import {
  computePathCoordinates,
  resolveJourneyMapScrollHeight,
} from "@/features/journey/components/path-geometry";
import type { JourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";
import type { JourneyNode, JourneyRegionViewModel } from "@/features/journey/types/journey.types";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import {
  resolveCurrentJourneyNode,
  resolveNodeDiscoveryOpacity,
} from "@/features/journey/utils/journey-map.utils";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

type JourneyRegionSectionProps = {
  region: JourneyRegionViewModel;
  theme?: string;
  viewportCenterY?: number;
  parallaxOffsetPx?: number;
  loadArtwork?: boolean;
  artPriority?: boolean;
  visualSettings: JourneyVisualSettings;
  showFox?: boolean;
  companionEvolutionSlug?: CompanionEvolutionSlug;
  dimmed?: boolean;
  /** Single-region Learn view — full-bleed scroll art, natural path height. */
  immersive?: boolean;
  onNodeSelect?: (node: JourneyNode) => void;
  className?: string;
};

export function JourneyRegionSection({
  region,
  theme,
  viewportCenterY = 50,
  parallaxOffsetPx = 0,
  loadArtwork = true,
  artPriority = false,
  visualSettings,
  showFox = false,
  companionEvolutionSlug,
  dimmed = false,
  immersive = false,
  onNodeSelect,
  className,
}: JourneyRegionSectionProps) {
  const visuals = getRegionVisuals(region.slug);
  const currentNode = resolveCurrentJourneyNode(region);
  const scrollArt = hasTrailScrollArt(region.slug);

  const geometryOptions = useMemo(
    () => ({
      regionSlug: region.slug,
      theme,
    }),
    [region.slug, theme],
  );

  const pathHeightVh = useMemo(
    () =>
      resolveJourneyMapScrollHeight(
        region.slug,
        region.nodes,
        geometryOptions,
        immersive,
      ),
    [geometryOptions, immersive, region.nodes, region.slug],
  );

  const effectiveParallax = parallaxOffsetPx * visualSettings.parallaxMultiplier;
  const showSyntheticSpine = !(immersive && scrollArt && loadArtwork);

  if (region.nodes.length === 0) {
    return null;
  }

  return (
    <section
      data-journey-region-section={region.slug}
      aria-label={`${region.name} trail`}
      className={cn(
        "relative mx-auto w-full max-w-lg",
        immersive ? "pb-24 pt-0" : "px-4 py-6",
        !loadArtwork && "bg-gradient-to-b",
        !loadArtwork && visuals.gradient,
        dimmed && "opacity-80 saturate-90",
        className,
      )}
      style={{
        minHeight: immersive ? undefined : `${pathHeightVh}vh`,
        ["--journey-viewport-center-y" as string]: `${viewportCenterY}`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <TrailMapArtwork
          theme={theme}
          regionSlug={region.slug}
          immersive
          priority={artPriority}
          scrim="minimal"
          parallaxOffsetPx={effectiveParallax}
          loadArtwork={loadArtwork}
        />
        {visualSettings.environmentLayers ? <JourneyEnvironmentLayers /> : null}
        {visualSettings.weatherEffects ? (
          <JourneyWeatherLayers
            zone="mid"
            particlesEnabled={visualSettings.ambientParticles}
            particleIntensity={visualSettings.particleIntensity}
          />
        ) : null}
      </div>

      <div
        className="relative w-full"
        style={
          immersive
            ? { paddingBottom: `${pathHeightVh}%` }
            : { minHeight: `${pathHeightVh}vh` }
        }
      >
        {showSyntheticSpine || (immersive && scrollArt && loadArtwork) ? (
          <JourneyPathSpine
            nodes={region.nodes}
            regionSlug={region.slug}
            theme={theme}
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
            const discoveryOpacity =
              node.state === "locked"
                ? 0.35
                : isCurrent
                  ? 1
                  : immersive
                    ? node.state === "completed"
                      ? 0.95
                      : 0.85
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
                data-journey-region-slug={region.slug}
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

        {showFox && currentNode ? (
          <JourneyFoxCompanion
            currentNode={currentNode}
            geometryOptions={geometryOptions}
            evolutionSlug={companionEvolutionSlug}
            interactionsEnabled={visualSettings.foxInteractions}
            idleMotionEnabled={visualSettings.foxIdleMotion}
          />
        ) : null}
      </div>
    </section>
  );
}
