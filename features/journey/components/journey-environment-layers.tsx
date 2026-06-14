"use client";

import { JOURNEY_ENVIRONMENT_BANDS } from "@/features/journey/constants/journey-environment.constants";
import { cn } from "@/lib/utils";

type JourneyEnvironmentLayersProps = {
  className?: string;
};

/**
 * Zone overlays that communicate ascent: villages/forest at base → summit atmosphere aloft.
 */
export function JourneyEnvironmentLayers({
  className,
}: JourneyEnvironmentLayersProps) {
  let bottomOffset = 0;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      aria-hidden
    >
      {JOURNEY_ENVIRONMENT_BANDS.map((band) => {
        const style = {
          bottom: `${bottomOffset}%`,
          height: `${band.heightPercent}%`,
        };
        bottomOffset += band.heightPercent;

        return (
          <div
            key={band.zone}
            data-journey-environment-zone={band.zone}
            className={cn(
              "absolute inset-x-0 bg-gradient-to-t",
              band.overlayClass,
            )}
            style={style}
          />
        );
      })}
    </div>
  );
}
