"use client";

import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { yamaService } from "@/features/yama/services/yama.service";
import { GlassPanel } from "@/components/visual";
import { buildFailureFeedback } from "@/lib/learning/failure-feedback.service";
import { cn } from "@/lib/utils";

export type LearningFailurePanelProps = {
  correctAnswer: string;
  userAnswer?: string;
  explanation?: string;
  contentLabel?: string;
  seed?: number;
  className?: string;
};

/** Bible-aligned mistake feedback — corrective, never punitive. */
export function LearningFailurePanel({
  correctAnswer,
  userAnswer = "",
  explanation,
  contentLabel,
  seed = 0,
  className,
}: LearningFailurePanelProps) {
  const presence = yamaService.resolveDrillFeedback("incorrect");
  const feedback = buildFailureFeedback(
    {
      userAnswer: userAnswer || "—",
      correctAnswer,
      explanation,
      contentLabel,
    },
    seed,
  );

  return (
    <GlassPanel
      className={cn("flex items-start gap-3 p-3", className)}
      role="status"
      aria-live="polite"
    >
      <YamaAvatar expression={presence.expression} size="sm" alt="" className="mt-0.5 shrink-0" />
      <div className="min-w-0 space-y-1">
        <p className="text-body-sm text-foreground">{feedback.explanation}</p>
        <p className="text-caption text-trail-glow">
          Answer: <span className="font-medium">{feedback.correction}</span>
        </p>
        <p className="text-caption text-muted-foreground">{feedback.encouragement}</p>
        <p className="text-caption text-muted-foreground">{feedback.reinforcementHint}</p>
      </div>
    </GlassPanel>
  );
}
