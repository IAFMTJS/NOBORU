"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type JourneyCheckpointCelebrationProps = {
  completed: boolean;
  enabled?: boolean;
  children: ReactNode;
};

export function JourneyCheckpointCelebration({
  completed,
  enabled = true,
  children,
}: JourneyCheckpointCelebrationProps) {
  return (
    <div className="relative inline-flex">
      {completed && enabled ? (
        <>
          <span
            className="absolute -inset-2 rounded-xl border-2 border-success/50 motion-safe:animate-pulse motion-reduce:animate-none"
            aria-hidden
          />
          <span
            className="absolute -inset-3 rounded-2xl bg-success/10 blur-sm"
            aria-hidden
          />
        </>
      ) : null}
      <div className={cn(completed && enabled && "relative z-[1]")}>{children}</div>
    </div>
  );
}
