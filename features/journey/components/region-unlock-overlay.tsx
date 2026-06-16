"use client";

import { useEffect, useState } from "react";

import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import {
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { JOURNEY_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { FOG_ASSETS, NARRATIVE_GATE_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type RegionUnlockOverlayProps = {
  regionName: string;
  gateAsset?: ArtAssetRef;
  open: boolean;
  onContinue: () => void;
};

/** Doc 12 Screen 10 — cinematic region transition (torii framing, fog peel). */
export function RegionUnlockOverlay({
  regionName,
  gateAsset = NARRATIVE_GATE_ASSETS.torii_transition,
  open,
  onContinue,
}: RegionUnlockOverlayProps) {
  const [phase, setPhase] = useState<"fog" | "reveal">("fog");

  useEffect(() => {
    if (!open) {
      setPhase("fog");
      return;
    }
    const timeoutId = window.setTimeout(() => setPhase("reveal"), 800);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/85 p-4 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:justify-center"
      role="dialog"
      aria-modal
      aria-label={`Entering ${regionName}`}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-[1800ms] motion-reduce:transition-none",
          phase === "reveal" ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        <WorldArtImage
          asset={FOG_ASSETS.locked_region}
          alt=""
          width={512}
          height={512}
          className="h-full w-full object-cover opacity-80"
        />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 top-1/4 transition-opacity duration-[1500ms] motion-reduce:transition-none",
          phase === "reveal" ? "opacity-100" : "opacity-40",
        )}
        aria-hidden
      >
        <WorldArtImage
          asset={gateAsset}
          alt=""
          width={800}
          height={600}
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      <div
        className={cn(
          "relative w-full max-w-md transition-all duration-[1200ms] motion-reduce:transition-none",
          glassSurface.card,
          "p-0",
          phase === "reveal"
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="space-y-4 p-6 text-center">
          <YamaPresence
            presence={yamaService.resolveCelebration("trail_node")}
            size="sm"
            layout="vertical"
            className="items-center"
          />
          <WorldArtImage
            asset={JOURNEY_WORLD_ASSETS.region_unlock_fox}
            alt=""
            width={72}
            height={72}
            className="mx-auto drop-shadow-lg"
          />
          <p className="text-caption uppercase tracking-[0.2em] text-muted-foreground">Entering</p>
          <StoryTitle as="h2" className="text-2xl text-trail-glow">
            {regionName}
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            The fog lifts. A new trail awaits above.
          </p>
          <PrimaryClimbButton className="w-full" onClick={onContinue}>
            Continue climbing
          </PrimaryClimbButton>
        </div>
      </div>
    </div>
  );
}
