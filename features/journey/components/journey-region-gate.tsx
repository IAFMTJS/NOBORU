"use client";

import type { JourneyRegionViewModel } from "@/features/journey/types/journey.types";
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
          "mb-3 flex h-16 w-16 items-center justify-center rounded-lg border-[3px] backdrop-blur-md",
          locked
            ? "border-white/20 bg-black/40 text-white/45"
            : "border-warning/70 bg-warning/10 text-warning trail-glow-warning",
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9">
          <path
            d="M4 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M4 6H14L11.5 10L15 14H4" fill="currentColor" />
          <path
            d="M4 14H14L11.5 18L15 22H4"
            fill="currentColor"
            opacity={0.55}
          />
        </svg>
      </div>

      <h2 className="text-heading-5 text-white drop-shadow-sm">{region.name}</h2>

      {region.description ? (
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
      ) : (
        <p className="mt-2 text-caption uppercase tracking-wide text-white/55">
          Region checkpoint
        </p>
      )}
    </div>
  );
}
