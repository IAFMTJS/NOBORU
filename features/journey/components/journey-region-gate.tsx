"use client";

import type { JourneyRegionViewModel } from "@/features/journey/types/journey.types";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { JOURNEY_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import {
  getNarrativeArcForRegion,
  isNarrativeArcEntryRegion,
} from "@/lib/design-system/narrative-regions";
import type { RegionSlug } from "@/lib/design-system/regions";
import { cn } from "@/lib/utils";

type JourneyRegionGateProps = {
  region: JourneyRegionViewModel;
  previousRegionName?: string | null;
  compact?: boolean;
  className?: string;
};

export function JourneyRegionGate({
  region,
  previousRegionName,
  compact = false,
  className,
}: JourneyRegionGateProps) {
  const locked = region.availability === "locked";
  const narrativeArc = getNarrativeArcForRegion(region.slug as RegionSlug);
  const isArcEntry = isNarrativeArcEntryRegion(region.slug as RegionSlug);
  const gateAsset = isArcEntry ? narrativeArc.gateIcon : JOURNEY_WORLD_ASSETS.region_gate;

  return (
    <div
      data-journey-region-gate={region.slug}
      className={cn(
        "relative z-20 flex flex-col items-center px-4 text-center",
        compact ? "py-3" : "py-6",
        className,
      )}
    >
      <div
        className={cn(
          "mb-2 overflow-hidden rounded-xl border-2 backdrop-blur-md",
          compact && "mb-1 rounded-lg border",
          locked
            ? "border-white/20 bg-black/40 opacity-60 grayscale"
            : "border-trail-glow/50 bg-black/30 trail-glow-warm",
        )}
        aria-hidden
      >
        <WorldArtImage
          asset={gateAsset}
          alt=""
          width={compact ? 72 : 96}
          height={compact ? 48 : 64}
          className={cn(
            "object-cover",
            compact ? "h-12 w-[4.5rem]" : "h-16 w-24",
          )}
        />
      </div>

      <h2
        className={cn(
          "font-story font-semibold text-white drop-shadow-sm",
          compact ? "text-base" : "text-xl",
        )}
      >
        {region.name}
      </h2>

      {region.description && !compact ? (
        <p className="mt-1 max-w-xs text-body-sm text-white/75">
          {region.description}
        </p>
      ) : null}

      {locked ? (
        <p className="mt-3 max-w-sm rounded-full border border-white/10 bg-black/45 px-4 py-1.5 text-caption text-white/70 backdrop-blur-sm">
          {region.lockReason ??
            (previousRegionName
              ? `Complete ${previousRegionName} to continue climbing.`
              : "This region is not yet available.")}
        </p>
      ) : !compact ? (
        <p className="mt-2 text-caption uppercase tracking-wide text-trail-glow/80">
          Region checkpoint
        </p>
      ) : (
        <p className="mt-1 text-[10px] uppercase tracking-wide text-trail-glow/80">
          Trail section
        </p>
      )}
    </div>
  );
}
