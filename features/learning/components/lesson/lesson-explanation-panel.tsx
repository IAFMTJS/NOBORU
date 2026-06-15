"use client";

import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { yamaService } from "@/features/yama/services/yama.service";
import { GlassPanel } from "@/components/visual";
import { cn } from "@/lib/utils";

type LessonExplanationPanelProps = {
  message: string;
  correctAnswer?: string;
  className?: string;
};

/** Short, guided explanation after a mistake — never punitive (Doc 03). */
export function LessonExplanationPanel({
  message,
  correctAnswer,
  className,
}: LessonExplanationPanelProps) {
  const presence = yamaService.resolveDrillFeedback("incorrect");

  return (
    <GlassPanel
      className={cn("flex items-start gap-3 p-3", className)}
      role="status"
      aria-live="polite"
    >
      <YamaAvatar expression={presence.expression} size="sm" alt="" className="mt-0.5 shrink-0" />
      <div className="min-w-0 space-y-1">
        <p className="text-body-sm text-foreground">{message}</p>
        {correctAnswer ? (
          <p className="text-caption text-trail-glow">
            Answer: <span className="font-medium">{correctAnswer}</span>
          </p>
        ) : null}
      </div>
    </GlassPanel>
  );
}
