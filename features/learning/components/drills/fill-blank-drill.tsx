"use client";

import { useEffect, useState } from "react";

import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import { cn } from "@/lib/utils";
import type { LessonFillBlankStep } from "@/features/learning/types/lesson.types";

type FillBlankDrillProps = {
  step: LessonFillBlankStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function FillBlankDrill({
  step,
  onAnswer,
  disabled = false,
}: FillBlankDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const result =
    selected === null
      ? null
      : selected === step.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);
  const correctAnswer = step.options[step.correctIndex];

  useEffect(() => {
    if (result !== "incorrect" || selected === null) return;
    setShakeIndex(selected);
    const timeoutId = window.setTimeout(() => setShakeIndex(null), 420);
    return () => window.clearTimeout(timeoutId);
  }, [result, selected]);

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={
        <div className="space-y-3">
          <AnnotatedJapaneseText
            text={step.sentenceWithBlank}
            size="hero"
            className="text-foreground"
            supportMode="tap"
          />
          <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
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
                onClick={() => {
                  setSelected(index);
                  onAnswer(isCorrect);
                }}
                className={cn(
                  "focus-ring w-full rounded-xl border px-4 py-3 text-left text-body-sm font-medium transition-all duration-200 motion-reduce:transition-none",
                  "border-white/10 bg-black/30 hover:border-trail-glow/40 hover:bg-black/45",
                  showResult && isCorrect && "border-trail-glow/60 bg-trail-glow/15 trail-glow-warm",
                  showResult &&
                    isSelected &&
                    !isCorrect &&
                    "border-destructive/50 bg-destructive/10 animate-[lesson-shake_0.42s_ease-in-out]",
                  shakeIndex === index && "animate-[lesson-shake_0.42s_ease-in-out]",
                )}
              >
                {option}
              </button>
            );
          })}
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={step.options[selected ?? 0] ?? ""}
            correctAnswer={correctAnswer ?? ""}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
