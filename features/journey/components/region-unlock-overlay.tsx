"use client";



import { useEffect, useState } from "react";



import { WorldArtImage } from "@/components/visual/world/world-art-image";

import {

  IllustratedScreen,

  PrimaryClimbButton,

  StoryTitle,

} from "@/components/visual";

import { YamaPresence } from "@/features/yama/components/yama-presence";

import { yamaService } from "@/features/yama/services/yama.service";

import type { ArtAssetRef } from "@/lib/assets/art-mappings";

import { JOURNEY_WORLD_ASSETS } from "@/lib/assets/art-mappings";

import { FOG_ASSETS } from "@/lib/assets/lesson-node-assets";

import { cn } from "@/lib/utils";



type RegionUnlockOverlayProps = {

  regionName: string;

  gateAsset?: ArtAssetRef;

  open: boolean;

  onContinue: () => void;

};



/** Doc 12 Screen 10 — region unlock ceremony (~1500ms fog peel + gate reveal). */

export function RegionUnlockOverlay({

  regionName,

  gateAsset = JOURNEY_WORLD_ASSETS.region_gate,

  open,

  onContinue,

}: RegionUnlockOverlayProps) {

  const [phase, setPhase] = useState<"fog" | "reveal">("fog");



  useEffect(() => {

    if (!open) {

      setPhase("fog");

      return;

    }

    const timeoutId = window.setTimeout(() => setPhase("reveal"), 600);

    return () => window.clearTimeout(timeoutId);

  }, [open]);



  if (!open) return null;



  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"

      role="dialog"

      aria-modal

      aria-label={`${regionName} unlocked`}

    >

      <div

        className={cn(

          "pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] motion-reduce:transition-none",

          phase === "reveal" ? "opacity-0" : "opacity-100",

        )}

        aria-hidden

      >

        <WorldArtImage

          asset={FOG_ASSETS.locked_region}

          alt=""

          width={512}

          height={512}

          className="h-full w-full object-cover opacity-70"

        />

      </div>



      <IllustratedScreen

        scrim="full"

        className={cn(

          "relative max-w-md transition-all duration-[1500ms] motion-reduce:transition-none",

          phase === "reveal"

            ? "scale-100 opacity-100 motion-safe:animate-in motion-safe:zoom-in-95"

            : "scale-95 opacity-0",

        )}

        background={

          <WorldArtImage

            asset={gateAsset}

            alt=""

            width={400}

            height={280}

            className="absolute inset-0 h-full w-full object-cover"

          />

        }

      >

        <div className="space-y-5 p-6 text-center">

          <YamaPresence

            presence={yamaService.resolveCelebration("trail_node")}

            size="md"

            layout="vertical"

            className="items-center"

          />

          <WorldArtImage

            asset={JOURNEY_WORLD_ASSETS.region_unlock_fox}

            alt=""

            width={96}

            height={96}

            className="mx-auto drop-shadow-lg"

          />

          <StoryTitle as="h2">New region revealed</StoryTitle>

          <p className="font-story text-2xl font-semibold text-trail-glow">{regionName}</p>

          <p className="text-body-sm text-muted-foreground">

            The fog lifts. A new trail awaits above.

          </p>

          <PrimaryClimbButton className="w-full" onClick={onContinue}>

            Continue climbing

          </PrimaryClimbButton>

        </div>

      </IllustratedScreen>

    </div>

  );

}


