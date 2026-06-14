"use client";

import type { JourneyNodeState } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type JourneyTrialTempleProps = {
  state: JourneyNodeState;
  isCurrent?: boolean;
  effectsEnabled?: boolean;
};

export function JourneyTrialTemple({
  state,
  isCurrent = false,
  effectsEnabled = true,
}: JourneyTrialTempleProps) {
  return (
    <div
      className={cn(
        "relative flex h-20 w-20 items-center justify-center transition-transform",
        isCurrent && "scale-110",
        effectsEnabled && state !== "locked" && "trail-glow-warning",
      )}
    >
      <div
        className={cn(
          "flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-end rounded-t-lg border-[3px] backdrop-blur-sm",
          state === "completed"
            ? "border-success bg-success/20 text-success"
            : state === "available" || state === "in_progress"
              ? "border-warning bg-warning/15 text-warning"
              : "border-white/25 bg-black/45 text-white/45",
          isCurrent && "ring-2 ring-warning/70 ring-offset-2 ring-offset-transparent",
        )}
      >
        <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
          <path
            d="M16 4 19 10H26L21 14.5 23 22 16 18 9 22 11 14.5 6 10H13Z"
            fill="currentColor"
            opacity={0.85}
          />
          <path
            d="M10 22V26H22V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 26H24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect x="13" y="14" width="6" height="8" rx="0.5" fill="currentColor" opacity={0.5} />
        </svg>
        <div className="mb-1 h-1.5 w-8 rounded-sm bg-current opacity-60" />
      </div>

      {effectsEnabled && state === "available" ? (
        <span
          className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-warning motion-safe:animate-pulse motion-reduce:animate-none"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
