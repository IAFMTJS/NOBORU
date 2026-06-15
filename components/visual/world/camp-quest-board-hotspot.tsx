"use client";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type CampQuestBoardHotspotProps = {
  onClick: () => void;
  className?: string;
  hasActiveQuests?: boolean;
};

/** Doc 11 Component 006 — physical quest board hotspot. */
export function CampQuestBoardHotspot({
  onClick,
  className,
  hasActiveQuests = false,
}: CampQuestBoardHotspotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quest board"
      className={cn(
        "focus-ring group absolute flex flex-col items-center gap-1 transition hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
    >
      <div
        className={cn(
          "relative drop-shadow-lg transition group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]",
          hasActiveQuests && "trail-glow-warm",
        )}
      >
        <WorldArtImage
          asset={CAMP_WORLD_ASSETS.quest_board}
          alt=""
          width={88}
          height={96}
          className="h-[5.5rem] w-[5rem] object-contain"
        />
        {hasActiveQuests ? (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
        ) : null}
      </div>
      <span className="rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        Quest Board
      </span>
    </button>
  );
}
