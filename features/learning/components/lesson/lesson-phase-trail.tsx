"use client";

import type { LessonPhaseSummary } from "@/features/learning/types/lesson.types";
import type { LessonPhase } from "@/lib/learning/lesson-phase.constants";
import { LESSON_PHASES } from "@/lib/learning/lesson-phase.constants";
import { cn } from "@/lib/utils";

type LessonPhaseTrailProps = {
  phaseSummary?: LessonPhaseSummary[];
  currentPhase: LessonPhase | null;
  className?: string;
};

/** Four-phase learning loop indicator — Introduction → Recognition → Recall → Mastery. */
export function LessonPhaseTrail({
  phaseSummary,
  currentPhase,
  className,
}: LessonPhaseTrailProps) {
  const activePhases =
    phaseSummary && phaseSummary.length > 0
      ? phaseSummary.map((entry) => entry.phase)
      : [...LESSON_PHASES];

  const currentIndex = currentPhase ? activePhases.indexOf(currentPhase) : 0;

  return (
    <div
      className={cn("flex w-full items-center gap-1", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={activePhases.length}
      aria-valuenow={Math.max(1, currentIndex + 1)}
      aria-label={`Learning phase ${Math.max(1, currentIndex + 1)} of ${activePhases.length}`}
    >
      {activePhases.map((phase, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;
        const label =
          phaseSummary?.find((entry) => entry.phase === phase)?.label ??
          phase.replace("_", " ");

        return (
          <span
            key={phase}
            title={label}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300 motion-reduce:transition-none",
              completed && "bg-trail-glow",
              active && "trail-glow-warm bg-trail-glow shadow-[0_0_10px_hsl(var(--trail-glow)/0.55)]",
              !completed && !active && "bg-white/15",
            )}
          />
        );
      })}
    </div>
  );
}
