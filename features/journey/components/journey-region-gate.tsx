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
  className?: string;
};

export function JourneyRegionGate({
  region,
  previousRegionName,
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
        "relative z-20 flex flex-col items-center px-6 py-10 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 overflow-hidden rounded-xl border-2 backdrop-blur-md",
          locked
            ? "border-white/20 bg-black/40 opacity-60 grayscale"
            : "border-trail-glow/50 bg-black/30 trail-glow-warm",
        )}
        aria-hidden
      >
        <WorldArtImage
          asset={gateAsset}
          alt=""
          width={96}
          height={64}
          className="h-16 w-24 object-cover"
        />
      </div>

      <h2 className="font-story text-xl font-semibold text-white drop-shadow-sm">
        {region.name}
      </h2>

      {region.description ? (
        <p className="mt-1 max-w-xs text-body-sm text-white/75">{region.description}</p>
      ) : null}

      {locked ? (
        <p className="mt-3 max-w-sm rounded-full border border-white/10 bg-black/45 px-4 py-1.5 text-caption text-white/70 backdrop-blur-sm">
          {region.lockReason ??
            (previousRegionName
              ? `Complete ${previousRegionName} to continue climbing.`
              : "This region is not yet available.")}
        </p>
      ) : (
        <p className="mt-2 text-caption uppercase tracking-wide text-trail-glow/80">
          Region checkpoint
        </p>
      )}
    </div>
  );
}
