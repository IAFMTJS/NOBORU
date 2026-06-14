import type { JourneyEnvironmentZone } from "@/features/journey/constants/journey-environment.constants";

export type JourneyWeatherKind = "embers" | "mist" | "wind" | "snow";

export type JourneyWeatherProfile = {
  kind: JourneyWeatherKind;
  particleCount: number;
  particleClass: string;
  overlayClass: string;
  driftDurationSec: number;
};

export const JOURNEY_WEATHER_BY_ZONE: Record<
  JourneyEnvironmentZone,
  JourneyWeatherProfile
> = {
  base: {
    kind: "embers",
    particleCount: 5,
    particleClass: "bg-amber-300/70 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    overlayClass: "from-amber-500/10 via-transparent to-transparent",
    driftDurationSec: 4.5,
  },
  mid: {
    kind: "mist",
    particleCount: 4,
    particleClass: "bg-white/25 blur-[1px]",
    overlayClass: "from-white/8 via-transparent to-transparent",
    driftDurationSec: 6,
  },
  upper: {
    kind: "wind",
    particleCount: 3,
    particleClass: "bg-sky-200/30 h-0.5 w-4 rounded-full",
    overlayClass: "from-sky-400/5 via-transparent to-transparent",
    driftDurationSec: 3.5,
  },
  summit: {
    kind: "snow",
    particleCount: 6,
    particleClass: "bg-white/70",
    overlayClass: "from-sky-200/10 via-blue-100/5 to-transparent",
    driftDurationSec: 5,
  },
};

export function resolveJourneyWeatherProfile(
  zone: JourneyEnvironmentZone,
): JourneyWeatherProfile {
  return JOURNEY_WEATHER_BY_ZONE[zone];
}
