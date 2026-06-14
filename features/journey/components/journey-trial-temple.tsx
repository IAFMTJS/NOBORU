"use client";

import { UiIconImage } from "@/components/media/ui-icon-image";
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
        "relative flex h-16 w-16 items-center justify-center transition-transform",
        isCurrent && "scale-110",
        effectsEnabled && state !== "locked" && "trail-glow-warning",
      )}
    >
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full border-2",
          state === "completed"
            ? "border-success/80 bg-success/20 trail-glow-success"
            : state === "available" || state === "in_progress"
              ? "border-warning/80 bg-warning/15 trail-glow-warning"
              : "border-white/20 bg-black/50",
          isCurrent && "ring-2 ring-warning/70 ring-offset-2 ring-offset-transparent",
        )}
      >
        <UiIconImage name="trophy" size={26} className="opacity-90" />
      </div>

      {effectsEnabled && state === "available" ? (
        <span
          className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-warning motion-safe:animate-pulse motion-reduce:animate-none"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
