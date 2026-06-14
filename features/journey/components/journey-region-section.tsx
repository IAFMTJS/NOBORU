"use client";



import { useMemo } from "react";



import { TrailMapArtwork } from "@/components/media/trail-map-artwork";

import { MotionDiv } from "@/components/motion/motion-div";

import { JourneyEnvironmentLayers } from "@/features/journey/components/journey-environment-layers";
import { JourneyWeatherLayers } from "@/features/journey/components/journey-weather-layers";
import { resolveJourneyEnvironmentZone } from "@/features/journey/constants/journey-environment.constants";

import { JourneyFoxCompanion } from "@/features/journey/components/journey-fox-companion";

import { JourneyPathNode } from "@/features/journey/components/journey-path-node";

import { JourneyPathSpine } from "@/features/journey/components/journey-path-spine";

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

  onNodeSelect,

  className,

}: JourneyRegionSectionProps) {

  const visuals = getRegionVisuals(region.slug);

  const currentNode = resolveCurrentJourneyNode(region);

  const weatherZone = useMemo(() => {
    const position = currentNode?.pathPosition ?? region.progressPercent / 100;
    return resolveJourneyEnvironmentZone(position);
  }, [currentNode?.pathPosition, region.progressPercent]);



  const geometryOptions = useMemo(

    () => ({

      regionSlug: region.slug,

      theme,

    }),

    [region.slug, theme],

  );



  const pathHeightVh = useMemo(

    () => resolveJourneyMapScrollHeight(region.slug, region.nodes, geometryOptions),

    [geometryOptions, region.nodes, region.slug],

  );



  const effectiveParallax =

    parallaxOffsetPx * visualSettings.parallaxMultiplier;



  if (region.nodes.length === 0) {

    return null;

  }



  return (

    <section

      data-journey-region-section={region.slug}

      aria-label={`${region.name} trail`}

      className={cn(

        "relative mx-auto w-full max-w-lg px-4 py-6",

        "bg-gradient-to-b",

        visuals.gradient,

        dimmed && "opacity-70 saturate-75",

        className,

      )}

      style={{ minHeight: `${pathHeightVh}vh` }}

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
            zone={weatherZone}
            particlesEnabled={visualSettings.ambientParticles}
            particleIntensity={visualSettings.particleIntensity}
          />
        ) : null}

      </div>



      <div

        className="relative w-full"

        style={{ minHeight: `${pathHeightVh}vh` }}

      >

        <JourneyPathSpine

          nodes={region.nodes}

          regionSlug={region.slug}

          theme={theme}

        />



        {showFox && currentNode ? (

          <JourneyFoxCompanion

            currentNode={currentNode}

            geometryOptions={geometryOptions}

            evolutionSlug={companionEvolutionSlug}

            interactionsEnabled={visualSettings.foxInteractions}

            idleMotionEnabled={visualSettings.foxIdleMotion}

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

            const isCurrent = showFox && currentNode?.id === node.id;

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

      </div>

    </section>

  );

}


