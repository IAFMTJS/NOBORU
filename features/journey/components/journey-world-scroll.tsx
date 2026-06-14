"use client";



import Link from "next/link";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "next-themes";

import { useReducedMotion } from "framer-motion";



import { JourneyRegionGate } from "@/features/journey/components/journey-region-gate";

import { JourneyRegionSection } from "@/features/journey/components/journey-region-section";

import { resolveJourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";

import { useJourneySectionVisibility } from "@/features/journey/hooks/use-journey-section-visibility";
import { useJourneyAmbientSound } from "@/features/journey/hooks/use-journey-ambient-sound";

import type {

  JourneyNode,

  JourneyPathViewModel,

  JourneyRegionViewModel,

} from "@/features/journey/types/journey.types";

import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";

import { resolveVisualTier } from "@/lib/performance/visual-tier";

import { cn } from "@/lib/utils";



type JourneyWorldScrollProps = {

  journey: JourneyPathViewModel;

  focusRegionSlug?: string | null;

  trialHref?: string | null;

  trialTitle?: string | null;

  companionEvolutionSlug?: CompanionEvolutionSlug;

  soundEnabled?: boolean;

  onNodeSelect?: (node: JourneyNode, region: JourneyRegionViewModel) => void;

  className?: string;

};



function resolveSectionViewportCenterY(

  sectionEl: HTMLElement,

  scrollEl: HTMLElement,

): number {

  const scrollRect = scrollEl.getBoundingClientRect();

  const sectionRect = sectionEl.getBoundingClientRect();

  const viewportCenter = scrollRect.top + scrollRect.height / 2;

  const relativeCenter = viewportCenter - sectionRect.top;



  if (sectionRect.height <= 0) return 50;

  return Math.min(100, Math.max(0, (relativeCenter / sectionRect.height) * 100));

}



export function JourneyWorldScroll({

  journey,

  focusRegionSlug = null,

  trialHref,

  trialTitle,

  companionEvolutionSlug,

  soundEnabled = true,

  onNodeSelect,

  className,

}: JourneyWorldScrollProps) {

  const { resolvedTheme } = useTheme();

  const prefersReducedMotion = useReducedMotion();

  const scrollRef = useRef<HTMLDivElement>(null);

  const mapContentRef = useRef<HTMLDivElement>(null);

  const [sectionCenters, setSectionCenters] = useState<Map<string, number>>(

    new Map(),

  );

  const [parallaxOffsetPx, setParallaxOffsetPx] = useState(0);



  const visualTier = resolveVisualTier();

  const visualSettings = useMemo(

    () => resolveJourneyVisualSettings(visualTier),

    [visualTier],

  );



  useJourneyAmbientSound(

    soundEnabled && visualSettings.ambientSound,

    true,

  );



  const currentRegionSlug = journey.position.currentRegionSlug;

  const currentNodeId = journey.position.currentNodeId;

  const sectionSlugs = useMemo(

    () => journey.regions.map((region) => region.slug),

    [journey.regions],

  );



  const prioritySlugs = useMemo(

    () => [currentRegionSlug, focusRegionSlug].filter(Boolean) as string[],

    [currentRegionSlug, focusRegionSlug],

  );



  const { shouldLoadArt } = useJourneySectionVisibility({

    scrollRef,

    sectionSlugs,

    rootMargin: visualSettings.lazyLoadRootMargin,

    maxLoadedSections: visualSettings.maxLoadedArtSections,

    prioritySlugs,

  });



  const updateScrollState = useCallback(() => {

    const scrollEl = scrollRef.current;

    if (!scrollEl) return;



    const centers = new Map<string, number>();

    scrollEl

      .querySelectorAll<HTMLElement>("[data-journey-region-section]")

      .forEach((sectionEl) => {

        const slug = sectionEl.dataset.journeyRegionSection;

        if (!slug) return;

        centers.set(

          slug,

          resolveSectionViewportCenterY(sectionEl, scrollEl),

        );

      });



    setSectionCenters(centers);

    setParallaxOffsetPx(

      prefersReducedMotion ? 0 : scrollEl.scrollTop * 0.06,

    );

  }, [prefersReducedMotion]);



  useEffect(() => {

    const scrollEl = scrollRef.current;

    if (!scrollEl) return;



    updateScrollState();

    scrollEl.addEventListener("scroll", updateScrollState, { passive: true });

    window.addEventListener("resize", updateScrollState);



    return () => {

      scrollEl.removeEventListener("scroll", updateScrollState);

      window.removeEventListener("resize", updateScrollState);

    };

  }, [journey.regions.length, updateScrollState]);



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



    updateScrollState();

    const settleMs = prefersReducedMotion ? 0 : 480;

    const timer = window.setTimeout(updateScrollState, settleMs);

    return () => window.clearTimeout(timer);

  }, [currentNodeId, prefersReducedMotion, updateScrollState]);



  useEffect(() => {

    if (!focusRegionSlug || !scrollRef.current) return;



    const target = scrollRef.current.querySelector(

      `[data-journey-region-gate="${focusRegionSlug}"], [data-journey-region-section="${focusRegionSlug}"]`,

    );

    if (!target) return;



    target.scrollIntoView({

      block: "start",

      behavior: prefersReducedMotion ? "auto" : "smooth",

    });



    const timer = window.setTimeout(

      updateScrollState,

      prefersReducedMotion ? 0 : 420,

    );

    return () => window.clearTimeout(timer);

  }, [focusRegionSlug, prefersReducedMotion, updateScrollState]);



  const trialRegionSlug = useMemo(() => {

    if (!trialHref) return null;

    return (

      journey.regions.find(

        (region) =>

          region.slug === currentRegionSlug &&

          region.availability !== "locked",

      )?.slug ?? null

    );

  }, [currentRegionSlug, journey.regions, trialHref]);



  return (

    <div

      ref={scrollRef}

      className={cn(

        "min-h-0 flex-1 overflow-y-auto overscroll-contain",

        className,

      )}

    >

      {trialHref && trialTitle && trialRegionSlug ? (

        <div className="sticky top-0 z-20 px-4 pb-2 pt-2">

          <Link

            href={trialHref}

            className="block rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-body-sm font-medium text-primary backdrop-blur-md"

          >

            Boss Trial · {trialTitle}

          </Link>

        </div>

      ) : null}



      <div ref={mapContentRef} className="pb-24">

        {journey.regions.map((region, index) => {

          const previousRegion = index > 0 ? journey.regions[index - 1] : null;

          const showFox = region.slug === currentRegionSlug;

          const loadArtwork = shouldLoadArt(region.slug);



          return (

            <div key={region.id}>

              {index > 0 ? (

                <JourneyRegionGate

                  region={region}

                  previousRegionName={previousRegion?.name ?? null}

                />

              ) : null}



              <JourneyRegionSection

                region={region}

                theme={resolvedTheme}

                viewportCenterY={sectionCenters.get(region.slug) ?? 50}

                parallaxOffsetPx={parallaxOffsetPx}

                loadArtwork={loadArtwork}

                artPriority={region.slug === currentRegionSlug}

                visualSettings={visualSettings}

                showFox={showFox}

                companionEvolutionSlug={companionEvolutionSlug}

                dimmed={region.availability === "locked"}

                onNodeSelect={

                  onNodeSelect

                    ? (node) => onNodeSelect(node, region)

                    : undefined

                }

              />

            </div>

          );

        })}

      </div>

    </div>

  );

}


