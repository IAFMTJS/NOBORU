"use client";

import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { cn } from "@/lib/utils";

type LessonExplanationPanelProps = {
  message: string;
  correctAnswer?: string;
  userAnswer?: string;
  className?: string;
};

/** @deprecated Prefer LearningFailurePanel — kept for existing lesson drill imports. */
export function LessonExplanationPanel({
  message,
  correctAnswer,
  userAnswer,
  className,
}: LessonExplanationPanelProps) {
  if (!correctAnswer) {
    return (
      <LearningFailurePanel
        className={cn(className)}
        correctAnswer="—"
        explanation={message}
        userAnswer={userAnswer}
      />
    );
  }

  return (
    <LearningFailurePanel
      className={className}
      correctAnswer={correctAnswer}
      userAnswer={userAnswer}
      explanation={message}
    />
  );
}
