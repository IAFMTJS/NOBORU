"use client";

import { useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { Input } from "@/components/ui/input";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";

type TypedSentenceDrillProps = {
  prompt: string;
  display: string;
  acceptedAnswers: string[];
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function TypedSentenceDrill({
  prompt,
  display,
  acceptedAnswers,
  onAnswer,
  disabled = false,
}: TypedSentenceDrillProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function handleSubmit() {
    const normalized = normalizeAnswer(value);
    const correct = acceptedAnswers.some(
      (answer) => normalizeAnswer(answer) === normalized,
    );
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <LessonDrillLayout
      prompt={prompt}
      result={result}
      hero={
        <p className="max-w-md text-body text-muted-foreground">{display}</p>
      }
      footer={
        <>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type the Japanese sentence"
            disabled={disabled || result !== null}
            className="border-white/15 bg-black/30"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          <PrimaryClimbButton
            className="w-full"
            disabled={!value.trim() || result !== null || disabled}
            onClick={handleSubmit}
          >
            Check sentence
          </PrimaryClimbButton>
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={value}
            correctAnswer={acceptedAnswers[0] ?? ""}
            seed={0}
          />
        ) : null
      }
    />
  );
}
