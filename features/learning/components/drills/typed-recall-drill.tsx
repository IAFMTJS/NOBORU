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
import { isRecallAnswerCorrect } from "@/features/learning/utils/recall-answers";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";

type TypedRecallDrillProps = {
  step: LessonRecallStep;
  onAnswer: (correct: boolean) => void;
};

export function TypedRecallDrill({ step, onAnswer }: TypedRecallDrillProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const acceptedAnswers = step.acceptedAnswers ?? [];

  function submit() {
    const correct = isRecallAnswerCorrect(input, acceptedAnswers);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Type your answer · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
        <JapaneseText text={step.display} size="xl" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your answer"
          disabled={result !== null}
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === "Enter" && result === null && input.trim()) {
              submit();
            }
          }}
        />
        <DrillFeedbackBanner
          result={result}
          message={
            result === "correct"
              ? "Correct!"
              : result === "incorrect"
                ? `Expected: ${acceptedAnswers[0]}`
                : undefined
          }
        />
        {result === null ? (
          <Button className="w-full" disabled={!input.trim()} onClick={submit}>
            Check Answer
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
