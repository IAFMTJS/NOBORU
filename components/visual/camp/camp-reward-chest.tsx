"use client";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "../art/world-art-image";

export type CampRewardChestState = "closed" | "available" | "opening" | "collected";

type CampRewardChestProps = {
  state: CampRewardChestState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const STATE_LABELS: Record<CampRewardChestState, string> = {
  closed: "Reward chest",
  available: "Open reward chest",
  opening: "Opening chest",
  collected: "Chest collected",
};

/** Doc 11 Component 007 — physical reward chest with ceremony states. */
export function CampRewardChest({
  state,
  onClick,
  disabled = false,
  className,
}: CampRewardChestProps) {
  const isInteractive = state === "available" && !disabled;
  const asset =
    state === "opening"
      ? CAMP_WORLD_ASSETS.chest_opening
      : state === "collected"
        ? CAMP_WORLD_ASSETS.chest_collected
        : state === "available"
          ? CAMP_WORLD_ASSETS.chest_available
          : CAMP_WORLD_ASSETS.chest_closed;

  return (
    <button
      type="button"
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      aria-label={STATE_LABELS[state]}
      className={cn(
        "focus-ring group absolute flex flex-col items-center gap-1 transition",
        isInteractive ? "hover:scale-[1.04] active:scale-[0.98]" : "cursor-default opacity-90",
        className,
      )}
    >
      <div
        className={cn(
          "relative drop-shadow-lg transition",
          state === "available" && "trail-glow-warm animate-[journey-node-pulse_2.4s_ease-in-out_infinite]",
          state === "opening" && "animate-[yama-celebrate_0.6s_ease-out]",
          state === "collected" && "opacity-60 grayscale",
        )}
      >
        <WorldArtImage
          asset={asset}
          alt=""
          width={72}
          height={72}
          presentation="prop"
          className="h-[4.5rem] w-[4.5rem]"
        />
        {state === "available" ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            !
          </span>
        ) : null}
      </div>
      <span className="rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        Chest
      </span>
    </button>
  );
}
