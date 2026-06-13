"use client";

import { cn } from "@/lib/utils";

type ClimbElevationIndicatorProps = {
  completedCount: number;
  lessonCount: number;
  className?: string;
};

/** Fixed ascent meter — reads as altitude on the mountain, not a separate progress widget. */
export function ClimbElevationIndicator({
  completedCount,
  lessonCount,
  className,
}: ClimbElevationIndicatorProps) {
  if (lessonCount <= 0) return null;

  const ascentPercent = Math.min(
    100,
    Math.round((completedCount / lessonCount) * 100),
  );

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5",
        className,
      )}
      aria-hidden
    >
      <span className="text-[0.625rem] font-medium uppercase tracking-wider text-white/50">
        Summit
      </span>
      <div className="relative h-28 w-1.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
        <div
          className="absolute inset-x-0 bottom-0 rounded-full bg-primary transition-[height] duration-500"
          style={{ height: `${Math.max(ascentPercent, completedCount > 0 ? 4 : 0)}%` }}
        />
      </div>
      <span className="text-[0.625rem] font-medium uppercase tracking-wider text-white/50">
        Base
      </span>
    </div>
  );
}
