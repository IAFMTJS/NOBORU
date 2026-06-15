"use client";

import { CAMP_WORLD_ASSETS, type ArtAssetRef } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type CampShrineHotspotProps = {
  onClick: () => void;
  streakDays: number;
  className?: string;
};

function resolveLanternCount(streakDays: number): number {
  if (streakDays <= 0) return 1;
  return Math.min(5, Math.max(1, Math.ceil(streakDays / 7)));
}

/** Paper lantern below 7 days; stone lantern from week-one streak tier upward. */
export function resolveShrineLanternAsset(
  streakDays: number,
  options?: { center?: boolean },
): ArtAssetRef {
  if (options?.center && streakDays >= 7) {
    return CAMP_WORLD_ASSETS.shrine_glow;
  }
  return streakDays >= 7
    ? CAMP_WORLD_ASSETS.shrine_lantern
    : CAMP_WORLD_ASSETS.shrine_lantern_paper;
}

/** Doc 11 Component 012 — streak shrine hotspot with visual growth. */
export function CampShrineHotspot({ onClick, streakDays, className }: CampShrineHotspotProps) {
  const lanternCount = resolveLanternCount(streakDays);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Streak shrine, ${streakDays} day streak`}
      className={cn(
        "focus-ring group absolute flex flex-col items-center gap-1 transition hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
    >
      <div className="relative flex items-end justify-center gap-0.5 drop-shadow-lg">
        {Array.from({ length: lanternCount }, (_, index) => (
          <WorldArtImage
            key={index}
            asset={resolveShrineLanternAsset(streakDays, {
              center: index === Math.floor(lanternCount / 2),
            })}
            alt=""
            width={index === Math.floor(lanternCount / 2) ? 40 : 32}
            height={index === Math.floor(lanternCount / 2) ? 48 : 40}
            className={cn(
              "object-contain",
              index === Math.floor(lanternCount / 2) ? "h-12 w-10" : "h-10 w-8 opacity-90",
              streakDays > 0 && index === Math.floor(lanternCount / 2) && "trail-glow-warm",
            )}
          />
        ))}
      </div>
      <span className="rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        Shrine
      </span>
    </button>
  );
}
