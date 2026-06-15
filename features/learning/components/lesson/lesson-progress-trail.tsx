"use client";

import { cn } from "@/lib/utils";

type LessonProgressTrailProps = {
  currentIndex: number;
  totalSteps: number;
  className?: string;
};

/** Themed lesson progress — lantern path segments, not a generic bar (Doc 03). */
export function LessonProgressTrail({
  currentIndex,
  totalSteps,
  className,
}: LessonProgressTrailProps) {
  const segments = Math.max(totalSteps, 1);

  return (
    <div
      className={cn("flex w-full max-w-[12rem] items-center gap-1 sm:max-w-[14rem]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={segments}
      aria-valuenow={currentIndex + 1}
      aria-label={`Lesson progress, step ${currentIndex + 1} of ${segments}`}
    >
      {Array.from({ length: segments }).map((_, index) => {
        const active = index <= currentIndex;
        const current = index === currentIndex;
        return (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300 motion-reduce:transition-none",
              active ? "bg-trail-glow" : "bg-white/15",
              current && "trail-glow-warm shadow-[0_0_10px_hsl(var(--trail-glow)/0.55)]",
            )}
          />
        );
      })}
    </div>
  );
}
