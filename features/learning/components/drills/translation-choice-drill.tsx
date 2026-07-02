"use client";

import { useState } from "react";

import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import { useStepHintPolicy } from "@/features/learning/hooks/use-step-hint-policy";
import type { LessonTranslationChoiceStep } from "@/features/learning/types/lesson.types";
import { cn } from "@/lib/utils";

type TranslationChoiceDrillProps = {
  step: LessonTranslationChoiceStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function TranslationChoiceDrill({
  step,
  onAnswer,
  disabled = false,
}: TranslationChoiceDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const hints = useStepHintPolicy(step);
  const result =
    selected === null
      ? null
      : selected === step.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={
        <div className="space-y-2">
          {hints.showTranslation ? (
            <p className="text-body font-medium text-foreground">{step.englishPrompt}</p>
          ) : (
            <p className="text-body-sm text-muted-foreground">Choose the matching sentence.</p>
          )}
        </div>
      }
      footer={
        <>
          {step.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = index === step.correctIndex;
            const showResult = selected !== null;

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                disabled={disabled || selected !== null}
                className={cn(
                  "focus-ring w-full rounded-xl border px-4 py-3 text-left transition-colors",
                  isSelected && "border-trail-glow bg-trail-glow/10",
                  showResult && isCorrect && "border-success/50 bg-success/10",
                  showResult && isSelected && !isCorrect && "border-destructive/50",
                )}
                onClick={() => {
                  setSelected(index);
                  onAnswer(isCorrect);
                }}
              >
                <JapaneseText text={option} size="md" className="text-foreground" />
              </button>
            );
          })}
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={selected === null ? "" : step.options[selected]!}
            correctAnswer={step.options[step.correctIndex]!}
            sentence={step.options[step.correctIndex]}
            meaning={hints.showTranslation ? step.englishPrompt : undefined}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
