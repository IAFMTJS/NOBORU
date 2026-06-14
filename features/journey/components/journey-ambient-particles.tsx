"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { JourneyEnvironmentZone } from "@/features/journey/constants/journey-environment.constants";
import { resolveJourneyWeatherProfile } from "@/features/journey/constants/journey-weather.constants";
import { cn } from "@/lib/utils";

type JourneyAmbientParticlesProps = {
  zone: JourneyEnvironmentZone;
  intensity?: "full" | "reduced";
  className?: string;
};

function resolveParticleMotion(kind: ReturnType<typeof resolveJourneyWeatherProfile>["kind"]) {
  switch (kind) {
    case "embers":
      return {
        initial: { opacity: 0.2, y: 0, scale: 0.8 },
        animate: { opacity: [0.2, 0.85, 0.15], y: [-8, -48], scale: [0.8, 1, 0.6] },
      };
    case "mist":
      return {
        initial: { opacity: 0.1, x: 0, y: 0 },
        animate: { opacity: [0.08, 0.35, 0.08], x: [0, 24, -12], y: [0, -6, 0] },
      };
    case "wind":
      return {
        initial: { opacity: 0.15, x: -20 },
        animate: { opacity: [0.1, 0.5, 0.1], x: [-20, 40] },
      };
    case "snow":
      return {
        initial: { opacity: 0.25, y: -8 },
        animate: { opacity: [0.2, 0.7, 0.2], y: [-8, 56], x: [0, 8, -4] },
      };
  }
}

export function JourneyAmbientParticles({
  zone,
  intensity = "full",
  className,
}: JourneyAmbientParticlesProps) {
  const prefersReducedMotion = useReducedMotion();
  const profile = resolveJourneyWeatherProfile(zone);
  const count =
    intensity === "reduced"
      ? Math.max(1, Math.floor(profile.particleCount / 2))
      : profile.particleCount;

  if (prefersReducedMotion) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[2] overflow-hidden", className)}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => {
        const left = 12 + ((index * 17) % 76);
        const top = 10 + ((index * 23) % 70);
        const particleMotion = resolveParticleMotion(profile.kind);

        return (
          <motion.span
            key={`${zone}-${index}`}
            className={cn(
              "absolute h-1 w-1 rounded-full",
              profile.particleClass,
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={particleMotion.initial}
            animate={particleMotion.animate}
            transition={{
              duration: profile.driftDurationSec,
              repeat: Infinity,
              delay: index * 0.55,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
