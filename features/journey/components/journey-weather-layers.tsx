"use client";

import type { JourneyEnvironmentZone } from "@/features/journey/constants/journey-environment.constants";
import { resolveJourneyWeatherProfile } from "@/features/journey/constants/journey-weather.constants";
import { JourneyAmbientParticles } from "@/features/journey/components/journey-ambient-particles";
import { cn } from "@/lib/utils";

type JourneyWeatherLayersProps = {
  zone: JourneyEnvironmentZone;
  particlesEnabled?: boolean;
  particleIntensity?: "full" | "reduced";
  className?: string;
};

export function JourneyWeatherLayers({
  zone,
  particlesEnabled = true,
  particleIntensity = "full",
  className,
}: JourneyWeatherLayersProps) {
  const profile = resolveJourneyWeatherProfile(zone);

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[2]", className)} aria-hidden>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t motion-safe:animate-pulse motion-reduce:animate-none",
          profile.overlayClass,
        )}
        style={{ animationDuration: `${profile.driftDurationSec * 2}s` }}
      />

      {profile.kind === "mist" ? (
        <div className="absolute inset-x-0 top-[30%] h-24 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl motion-safe:animate-pulse motion-reduce:animate-none" />
      ) : null}

      {particlesEnabled ? (
        <JourneyAmbientParticles zone={zone} intensity={particleIntensity} />
      ) : null}
    </div>
  );
}
