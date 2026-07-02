"use client";

import { useState } from "react";

import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { yamaService } from "@/features/yama/services/yama.service";
import { GlassPanel } from "@/components/visual";
import { ShowPronunciationButton } from "@/features/learning/components/drills/show-pronunciation-button";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import {
  buildRichFailureFeedback,
  type RichFailureFeedbackInput,
} from "@/lib/learning/failure-feedback.service";
import { cn } from "@/lib/utils";

export type LearningFailurePanelProps = RichFailureFeedbackInput & {
  seed?: number;
  className?: string;
};

/** Bible-aligned mistake feedback — corrective, never punitive. */
export function LearningFailurePanel({
  correctAnswer,
  userAnswer = "",
  explanation,
  contentLabel,
  sentence,
  meaning,
  grammarChain,
  pronunciation,
  showGrammar,
  showPronunciation,
  seed = 0,
  className,
}: LearningFailurePanelProps) {
  const [pronunciationRevealed, setPronunciationRevealed] = useState(false);
  const presence = yamaService.resolveDrillFeedback("incorrect");
  const feedback = buildRichFailureFeedback(
    {
      userAnswer: userAnswer || "—",
      correctAnswer,
      explanation,
      contentLabel,
      sentence,
      meaning,
      grammarChain,
      pronunciation,
      showGrammar,
      showPronunciation,
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
      <div className="min-w-0 space-y-2">
        {feedback.sentence ? (
          <div>
            <p className="text-caption text-muted-foreground">Correct sentence</p>
            <JapaneseText text={feedback.sentence} size="md" className="text-foreground" />
          </div>
        ) : null}
        {feedback.meaning ? (
          <p className="text-body-sm text-foreground">
            <span className="text-caption text-muted-foreground">Meaning: </span>
            {feedback.meaning}
          </p>
        ) : null}
        {feedback.showGrammar && feedback.grammarChain && feedback.grammarChain.length > 1 ? (
          <p className="text-body-sm text-foreground">
            <span className="text-caption text-muted-foreground">Grammar: </span>
            {feedback.grammarChain.join(" → ")}
          </p>
        ) : null}
        <p className="text-body-sm text-foreground">{feedback.explanation}</p>
        <p className="text-caption text-trail-glow">
          Answer: <span className="font-medium">{feedback.correction}</span>
        </p>
        {feedback.showPronunciation && feedback.pronunciation ? (
          <div className="space-y-1">
            {pronunciationRevealed ? (
              <p className="text-caption text-muted-foreground">
                Pronunciation: {feedback.pronunciation}
              </p>
            ) : (
              <ShowPronunciationButton
                visible
                revealed={pronunciationRevealed}
                onReveal={() => setPronunciationRevealed(true)}
              />
            )}
          </div>
        ) : null}
        <p className="text-caption text-muted-foreground">{feedback.encouragement}</p>
        <p className="text-caption text-muted-foreground">{feedback.reinforcementHint}</p>
      </div>
    </GlassPanel>
  );
}
