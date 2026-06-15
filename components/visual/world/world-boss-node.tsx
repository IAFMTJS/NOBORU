"use client";

import { JOURNEY_WORLD_ASSETS, type ArtAssetRef } from "@/lib/assets/art-mappings";
import { LESSON_NODE_ASSETS } from "@/lib/assets/lesson-node-assets";
import type { TrailNodeState } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type WorldBossNodeProps = {
  state: TrailNodeState;
  isCurrent?: boolean;
  className?: string;
  onClick?: () => void;
};

const BOSS_SIZE_PX = 60;

/** Doc 11 boss node — sacred gate / boss mask on trail. */
export function WorldBossNode({
  state,
  isCurrent = false,
  className,
  onClick,
}: WorldBossNodeProps) {
  const asset: ArtAssetRef =
    state === "locked" ? LESSON_NODE_ASSETS.locked : LESSON_NODE_ASSETS.trial;
  const interactive = state !== "locked" && onClick;

  const content = (
    <div className="relative">
      {state !== "locked" ? (
        <WorldArtImage
          asset={JOURNEY_WORLD_ASSETS.boss_atmosphere}
          alt=""
          width={88}
          height={56}
          className="pointer-events-none absolute -inset-x-4 -top-8 opacity-50 blur-[1px]"
        />
      ) : null}
      <WorldArtImage
        asset={asset}
        alt=""
        width={BOSS_SIZE_PX}
        height={BOSS_SIZE_PX}
        className={cn(
          "relative z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]",
          state === "locked" && "opacity-45 grayscale",
          state === "completed" && "trail-glow-success",
          state !== "locked" && "trail-glow-warning",
          isCurrent && "animate-[journey-node-pulse_2s_ease-in-out_infinite] motion-reduce:animate-none",
          className,
        )}
      />
    </div>
  );

  if (!interactive) return content;

  return (
    <button type="button" onClick={onClick} className="focus-ring rounded-full" aria-label="Boss trial">
      {content}
    </button>
  );
}
