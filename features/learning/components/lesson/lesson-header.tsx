"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { LessonHearts } from "@/features/learning/components/lesson/lesson-hearts";
import { LessonPhaseTrail } from "@/features/learning/components/lesson/lesson-phase-trail";
import type { LessonPhaseSummary } from "@/features/learning/types/lesson.types";
import {
  LESSON_MAX_HEARTS,
  LESSON_STREAK_GLOW_AT,
  LESSON_STREAK_PARTICLES_AT,
} from "@/features/learning/constants/lesson-ui.constants";
import type { LessonPhase } from "@/lib/learning/lesson-phase.constants";
import { cn } from "@/lib/utils";

type LessonHeaderProps = {
  backHref: string;
  stepIndex: number;
  totalSteps: number;
  heartsRemaining: number;
  maxHearts?: number;
  streakCount?: number;
  phaseSummary?: LessonPhaseSummary[];
  currentPhase?: LessonPhase | null;
  className?: string;
};

export function LessonHeader({
  backHref,
  stepIndex,
  totalSteps,
  heartsRemaining,
  maxHearts = LESSON_MAX_HEARTS,
  streakCount = 0,
  phaseSummary,
  currentPhase = null,
  className,
}: LessonHeaderProps) {
  const streakGlow = streakCount >= LESSON_STREAK_GLOW_AT;
  const streakParticles = streakCount >= LESSON_STREAK_PARTICLES_AT;

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-30 flex items-center gap-2 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4",
        className,
      )}
    >
      <Link
        href={backHref}
        className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm"
        aria-label="Leave lesson"
      >
        <UiIconImage name="arrow_left" size={18} />
      </Link>

      <div className="min-w-0 flex-1 px-1">
        {phaseSummary && phaseSummary.length > 0 ? (
          <LessonPhaseTrail phaseSummary={phaseSummary} currentPhase={currentPhase} />
        ) : (
          <div
            className="flex w-full max-w-[12rem] items-center gap-1 sm:max-w-[14rem]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={stepIndex + 1}
            aria-label={`Lesson progress, step ${stepIndex + 1} of ${totalSteps}`}
          >
            <span className="h-1.5 flex-1 rounded-full bg-trail-glow trail-glow-warm" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "shrink-0 rounded-full border border-white/10 bg-black/40 px-1 py-0.5 backdrop-blur-sm transition-shadow",
          streakGlow && "trail-glow-warm",
          streakParticles && "shadow-[0_0_16px_hsl(var(--trail-glow)/0.45)]",
          streakCount >= 50 && "combo-streak-50",
          streakCount >= 20 && streakCount < 50 && "combo-streak-20",
          streakCount >= 10 && streakCount < 20 && "combo-streak-10",
          streakCount >= 5 && streakCount < 10 && "combo-streak-5",
        )}
      >
        <LessonHearts remaining={heartsRemaining} max={maxHearts} />
      </div>
    </header>
  );
}
