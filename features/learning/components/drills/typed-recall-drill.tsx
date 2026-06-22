"use client";

import { useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { Input } from "@/components/ui/input";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import {
  isJapaneseTextAnswerCorrect,
  isMostlyLatinAnswer,
  isRecallAnswerCorrect,
} from "@/features/learning/utils/recall-answers";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";

type TypedRecallDrillProps = {
  step: LessonRecallStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function resolvePlaceholder(acceptedAnswers: string[]): string {
  const expectsJapanese = acceptedAnswers.some((answer) => !isMostlyLatinAnswer(answer));
  if (!expectsJapanese) return "Type your answer";
  const allowsRomaji = acceptedAnswers.some((answer) => isMostlyLatinAnswer(answer));
  return allowsRomaji ? "Type in Japanese or romaji" : "Type in Japanese";
}

function isTypedRecallCorrect(input: string, acceptedAnswers: string[]): boolean {
  return (
    isJapaneseTextAnswerCorrect(input, acceptedAnswers) ||
    isRecallAnswerCorrect(input, acceptedAnswers)
  );
}

export function TypedRecallDrill({
  step,
  onAnswer,
  disabled = false,
}: TypedRecallDrillProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const acceptedAnswers = step.acceptedAnswers ?? [];

  function submit() {
    const correct = isTypedRecallCorrect(input, acceptedAnswers);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={<JapaneseText text={step.display} size="hero" className="text-foreground" />}
      footer={
        <>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={resolvePlaceholder(acceptedAnswers)}
            disabled={disabled || result !== null}
            autoComplete="off"
            className="border-white/15 bg-black/30"
            onKeyDown={(event) => {
              if (event.key === "Enter" && result === null && input.trim()) {
                submit();
              }
            }}
          />
          {result === null ? (
            <PrimaryClimbButton
              className="w-full"
              disabled={!input.trim() || disabled}
              onClick={submit}
            >
              Check answer
            </PrimaryClimbButton>
          ) : null}
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={input}
            correctAnswer={acceptedAnswers[0] ?? ""}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}
