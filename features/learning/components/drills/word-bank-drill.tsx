"use client";

import { useMemo, useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import { cn } from "@/lib/utils";
import type { LessonWordBankStep } from "@/features/learning/types/lesson.types";

type WordBankDrillProps = {
  step: LessonWordBankStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function WordBankDrill({
  step,
  onAnswer,
  disabled = false,
}: WordBankDrillProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const remainingTokens = useMemo(() => {
    const available = [...step.tokens];
    for (const token of selected) {
      const index = available.indexOf(token);
      if (index >= 0) available.splice(index, 1);
    }
    return available;
  }, [selected, step.tokens]);

  function handleSelect(token: string) {
    if (result !== null || disabled) return;
    setSelected((current) => [...current, token]);
  }

  function handleUndo() {
    if (result !== null || disabled) return;
    setSelected((current) => current.slice(0, -1));
  }

  function handleClear() {
    if (result !== null || disabled) return;
    setSelected([]);
  }

  function handleCheck() {
    const correct = arraysEqual(selected, step.correctOrder);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={
        <div className="space-y-4">
          {step.referenceJapanese ? (
            <AnnotatedJapaneseText
              text={step.referenceJapanese}
              romaji={step.sentenceRomaji}
              english={step.englishHint}
              size="lg"
              className="text-foreground"
              supportMode="tap"
            />
          ) : (
            <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
          )}
          <div
            className="min-h-16 w-full max-w-md rounded-xl border border-dashed border-white/20 bg-black/25 p-4"
            aria-label="Your sentence"
          >
            {selected.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">
                Tap words below to build the sentence
              </p>
            ) : (
              <JapaneseText
                text={selected.join("")}
                romaji={step.sentenceRomaji}
                size="lg"
                className="font-story font-semibold leading-relaxed text-heading-story"
              />
            )}
          </div>
        </div>
      }
      footer={
        <>
          {!step.referenceJapanese ? (
            <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {remainingTokens.map((token, index) => (
              <button
                key={`${token}-${index}`}
                type="button"
                disabled={result !== null || disabled}
                onClick={() => handleSelect(token)}
                className="focus-ring rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-body-sm font-medium hover:border-trail-glow/40"
              >
                {token}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="focus-ring flex-1 rounded-lg border border-white/15 py-2 text-body-sm disabled:opacity-40"
              disabled={selected.length === 0 || result !== null || disabled}
              onClick={handleUndo}
            >
              Undo
            </button>
            <button
              type="button"
              className="focus-ring flex-1 rounded-lg border border-white/15 py-2 text-body-sm disabled:opacity-40"
              disabled={selected.length === 0 || result !== null || disabled}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <PrimaryClimbButton
            className={cn("w-full", result === "correct" && "trail-glow-warm")}
            disabled={selected.length !== step.correctOrder.length || result !== null || disabled}
            onClick={handleCheck}
          >
            Check sentence
          </PrimaryClimbButton>
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={selected.join("")}
            correctAnswer={step.correctOrder.join("")}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
