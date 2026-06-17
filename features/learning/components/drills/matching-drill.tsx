"use client";

import { useMemo, useState } from "react";

import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import type { DrillDifficultyProps } from "@/features/learning/types/drill-difficulty.types";
import { cn } from "@/lib/utils";
import type { LessonMatchingStep } from "@/features/learning/types/lesson.types";

type MatchingDrillProps = DrillDifficultyProps & {
  step: LessonMatchingStep;
  onAnswer: (correct: boolean, wrongAttempts?: number) => void;
  disabled?: boolean;
};

function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function MatchingDrill({ step, onAnswer, disabled = false }: MatchingDrillProps) {
  const answerOptions = useMemo(
    () => shuffleItems(step.pairs.map((pair) => pair.answer)),
    [step.pairs],
  );

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [matchedPromptIds, setMatchedPromptIds] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [glowPairId, setGlowPairId] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [failureFeedback, setFailureFeedback] = useState<{
    userAnswer: string;
    correctAnswer: string;
    contentLabel: string;
  } | null>(null);

  function handleAnswerClick(answer: string) {
    if (!selectedPromptId || result === "correct" || disabled) return;

    const pair = step.pairs.find((entry) => entry.id === selectedPromptId);
    if (!pair) return;

    if (pair.answer === answer) {
      const nextMatched = [...matchedPromptIds, selectedPromptId];
      setMatchedPromptIds(nextMatched);
      setGlowPairId(selectedPromptId);
      setSelectedPromptId(null);
      window.setTimeout(() => setGlowPairId(null), 600);

      if (nextMatched.length === step.pairs.length) {
        setResult("correct");
        onAnswer(wrongAttempts === 0, wrongAttempts);
      }
      return;
    }

    setWrongAttempts((current) => current + 1);
    setResult("incorrect");
    setFailureFeedback({
      userAnswer: answer,
      correctAnswer: pair.answer,
      contentLabel: pair.prompt,
    });
    setSelectedPromptId(null);
    window.setTimeout(() => setResult(null), 900);
  }

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={
        <div className="space-y-2">
          <p className="font-story text-sm text-trail-glow">Trail pairing stones</p>
          <p className="text-body-sm text-muted-foreground">
            Select a prompt stone, then its matching answer
          </p>
        </div>
      }
      footer={
        <div className="relative grid gap-4 sm:grid-cols-2">
          {glowPairId ? (
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-px w-[42%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-trail-glow/70 to-transparent motion-safe:animate-pulse"
              aria-hidden
            />
          ) : null}
          <div className="space-y-2">
            <p className="text-center text-caption text-muted-foreground">Prompts</p>
            <TrailAnswerPad
              ariaLabel="Matching prompts"
              options={step.pairs.map((pair) => {
                const matched = matchedPromptIds.includes(pair.id);
                const selected = selectedPromptId === pair.id;
                const glowing = glowPairId === pair.id;
                let state: "default" | "selected" | "correct" | "disabled" = "default";
                if (matched || glowing) state = "correct";
                else if (selected) state = "selected";
                else if (result === "correct" || disabled) state = "disabled";

                return {
                  id: pair.id,
                  label: pair.prompt,
                  state,
                  onSelect:
                    matched || result === "correct" || disabled
                      ? undefined
                      : () => setSelectedPromptId(pair.id),
                };
              })}
            />
          </div>
          <div className="space-y-2">
            <p className="text-center text-caption text-muted-foreground">Answers</p>
            <TrailAnswerPad
              ariaLabel="Matching answers"
              options={answerOptions.map((answer) => ({
                id: answer,
                label: answer,
                state:
                  !selectedPromptId || result === "correct" || disabled ? "disabled" : "default",
                shake: result === "incorrect",
                onSelect:
                  !selectedPromptId || result === "correct" || disabled
                    ? undefined
                    : () => handleAnswerClick(answer),
              }))}
            />
          </div>
        </div>
      }
      explanation={
        failureFeedback ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={failureFeedback.userAnswer}
            correctAnswer={failureFeedback.correctAnswer}
            contentLabel={failureFeedback.contentLabel}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
