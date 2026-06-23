"use client";

import { useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { Input } from "@/components/ui/input";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import type { LessonApplicationStep } from "@/features/learning/types/lesson.types";
import {
  isJapaneseTextAnswerCorrect,
  isRecallAnswerCorrect,
  normalizeRecallAnswer,
  pickJapaneseAnswerCorrection,
} from "@/features/learning/utils/recall-answers";

type ApplicationDrillProps = {
  step: LessonApplicationStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function resolvePlaceholder(direction: LessonApplicationStep["direction"]): string {
  switch (direction) {
    case "to_japanese":
      return "Type in Japanese or romaji";
    case "to_romaji":
      return "Type the romaji reading";
    default:
      return "Type the English meaning";
  }
}

export function ApplicationDrill({
  step,
  onAnswer,
  disabled = false,
}: ApplicationDrillProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function handleSubmit() {
    const correct =
      step.direction === "to_japanese" || step.direction === "to_romaji"
        ? isJapaneseTextAnswerCorrect(value, step.acceptedAnswers)
        : isRecallAnswerCorrect(value, step.acceptedAnswers);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  const showJapaneseDisplay =
    step.direction === "to_english" || step.direction === "to_romaji";

  return (
    <LessonDrillLayout
      prompt={step.prompt}
      result={result}
      hero={
        showJapaneseDisplay ? (
          <AnnotatedJapaneseText
            text={step.display}
            size="hero"
            className="text-foreground"
            supportMode="tap"
          />
        ) : step.direction === "to_japanese" && step.displayHint ? (
          <p className="font-story text-2xl font-semibold text-heading-story sm:text-3xl">
            {step.displayHint}
          </p>
        ) : (
          <p className="font-story text-3xl font-bold text-heading-story sm:text-4xl">
            {step.display}
          </p>
        )
      }
      footer={
        <>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={resolvePlaceholder(step.direction)}
            disabled={disabled || result !== null}
            aria-label={resolvePlaceholder(step.direction)}
            className="border-white/15 bg-black/30"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          <PrimaryClimbButton
            className="w-full"
            disabled={!normalizeRecallAnswer(value) || result !== null || disabled}
            onClick={handleSubmit}
          >
            Check answer
          </PrimaryClimbButton>
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={value}
            correctAnswer={pickJapaneseAnswerCorrection(
              step.acceptedAnswers,
              value,
            )}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
