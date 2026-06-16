"use client";

import { FX_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "../art/world-art-image";

export type CampfireIntensity = "idle" | "enhanced" | "festival" | "advanced";

type CampCampfireProps = {
  intensity?: CampfireIntensity;
  className?: string;
};

const INTENSITY_GLOW: Record<CampfireIntensity, string> = {
  idle: "opacity-70",
  enhanced: "opacity-85",
  festival: "opacity-95",
  advanced: "opacity-100",
};

/** Doc 11 Component 005 — permanent animated camp centerpiece. */
export function CampCampfire({ intensity = "idle", className }: CampCampfireProps) {
  const emberCount = intensity === "idle" ? 3 : intensity === "enhanced" ? 5 : 7;

  return (
    <div
      className={cn("pointer-events-none relative h-28 w-28 sm:h-32 sm:w-32", className)}
      aria-hidden
    >
      <div
        className={cn(
          "campfire-glow absolute inset-0 rounded-full blur-2xl transition-opacity duration-700",
          INTENSITY_GLOW[intensity],
        )}
      />
      <div className="absolute bottom-2 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-stone-900/80 shadow-inner" />
      <div className="campfire-flame campfire-flame--primary absolute bottom-3 left-1/2 h-14 w-8 -translate-x-[55%]" />
      <div className="campfire-flame campfire-flame--secondary absolute bottom-3 left-1/2 h-12 w-7 -translate-x-[35%]" />
      <div className="campfire-flame campfire-flame--tertiary absolute bottom-3 left-1/2 h-10 w-6 -translate-x-[70%]" />
      {Array.from({ length: emberCount }, (_, index) => (
        <span
          key={index}
          className={cn(
            "campfire-ember absolute bottom-6",
            index % 2 === 0 ? "left-[38%]" : "left-[52%]",
          )}
          style={{ animationDelay: `${index * 0.45}s` }}
        >
          <WorldArtImage
            asset={FX_ASSETS.ember}
            alt=""
            width={12}
            height={12}
            className="opacity-80"
          />
        </span>
      ))}
    </div>
  );
}
