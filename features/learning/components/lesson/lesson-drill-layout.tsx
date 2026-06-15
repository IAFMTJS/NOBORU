"use client";

import type { ReactNode } from "react";

import { FeedbackSparkOverlay } from "@/components/visual/feedback-spark-overlay";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { cn } from "@/lib/utils";

type LessonDrillLayoutProps = {
  prompt?: string;
  hero: ReactNode;
  footer?: ReactNode;
  explanation?: ReactNode;
  result?: "correct" | "incorrect" | null;
  className?: string;
};

/**
 * Doc 03 world-first drill layout — hero dominates center, answers in lower third.
 */
export function LessonDrillLayout({
  prompt,
  hero,
  footer,
  explanation,
  result = null,
  className,
}: LessonDrillLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[min(32rem,calc(100dvh-12rem))] flex-1 flex-col",
        className,
      )}
    >
      <FeedbackSparkOverlay active={result === "correct"} />

      <div className="flex flex-1 flex-col items-center justify-center px-2 py-6 text-center">
        {prompt ? (
          <p className="mb-3 text-caption text-muted-foreground">{prompt}</p>
        ) : null}
        {hero}
      </div>

      {footer ? (
        <div className="mt-auto px-1 pb-1 pt-2">{footer}</div>
      ) : null}

      {explanation}
    </div>
  );
}
