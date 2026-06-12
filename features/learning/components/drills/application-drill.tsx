"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DrillFeedbackBanner } from "@/features/learning/components/drills/drill-feedback-banner";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { LessonApplicationStep } from "@/features/learning/types/lesson.types";
import {
  isRecallAnswerCorrect,
  normalizeRecallAnswer,
} from "@/features/learning/utils/recall-answers";

type ApplicationDrillProps = {
  step: LessonApplicationStep;
  onAnswer: (correct: boolean) => void;
};

function normalizeJapaneseAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

function isJapaneseAnswerCorrect(
  input: string,
  acceptedAnswers: string[],
): boolean {
  const normalized = normalizeJapaneseAnswer(input);
  if (!normalized) return false;

  return acceptedAnswers.some(
    (answer) => normalizeJapaneseAnswer(answer) === normalized,
  );
}

function resolvePlaceholder(direction: LessonApplicationStep["direction"]): string {
  switch (direction) {
    case "to_japanese":
      return "Type in Japanese";
    case "to_romaji":
      return "Type the romaji reading";
    default:
      return "Type the English meaning";
  }
}

function resolveDescription(direction: LessonApplicationStep["direction"]): string {
  switch (direction) {
    case "to_japanese":
      return "Translate into Japanese using the kana you know";
    case "to_romaji":
      return "Read the kana you know";
    default:
      return "Translate into English";
  }
}

export function ApplicationDrill({ step, onAnswer }: ApplicationDrillProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function handleSubmit() {
    const correct =
      step.direction === "to_japanese"
        ? isJapaneseAnswerCorrect(value, step.acceptedAnswers)
        : isRecallAnswerCorrect(value, step.acceptedAnswers);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  const showJapaneseDisplay =
    step.direction === "to_english" || step.direction === "to_romaji";

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>{resolveDescription(step.direction)}</CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
        {showJapaneseDisplay ? (
          <JapaneseText
            text={step.display}
            romaji={step.displayHint ?? undefined}
            className="text-body-sm"
          />
        ) : step.displayHint ? (
          <p className="text-body-sm text-muted-foreground">{step.displayHint}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={resolvePlaceholder(step.direction)}
          disabled={result !== null}
          aria-label={resolvePlaceholder(step.direction)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
        <Button
          className="w-full"
          disabled={!normalizeRecallAnswer(value) || result !== null}
          onClick={handleSubmit}
        >
          Check answer
        </Button>
        <DrillFeedbackBanner result={result} />
      </CardContent>
    </Card>
  );
}
