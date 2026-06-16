"use client";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "../art/world-art-image";

type CampWeatherOverlayProps = {
  enabled?: boolean;
  className?: string;
};

/** Subtle camp atmosphere — ember drift and night mist over camp_base. */
export function CampWeatherOverlay({ enabled = true, className }: CampWeatherOverlayProps) {
  if (!enabled) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[1]", className)} aria-hidden>
      <div
        className="absolute inset-0 bg-gradient-to-t from-amber-500/8 via-transparent to-sky-950/15 motion-safe:animate-pulse motion-reduce:animate-none"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute inset-x-0 bottom-[20%] h-20 bg-gradient-to-r from-transparent via-white/6 to-transparent blur-2xl motion-safe:animate-pulse motion-reduce:animate-none" />
      {Array.from({ length: 4 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "campfire-ember absolute",
            index % 2 === 0 ? "left-[12%]" : "right-[14%]",
            index < 2 ? "top-[18%]" : "top-[28%]",
          )}
          style={{ animationDelay: `${index * 0.9}s` }}
        >
          <WorldArtImage
            asset={CAMP_WORLD_ASSETS.ember_particle}
            alt=""
            width={10}
            height={10}
            className="opacity-50"
          />
        </span>
      ))}
    </div>
  );
}
