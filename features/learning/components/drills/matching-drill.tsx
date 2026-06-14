"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/visual/drill-glass-card";
import { cn } from "@/lib/utils";
import { DrillFeedbackBanner } from "@/features/learning/components/drills/drill-feedback-banner";
import type { LessonMatchingStep } from "@/features/learning/types/lesson.types";

type MatchingDrillProps = {
  step: LessonMatchingStep;
  onAnswer: (correct: boolean, wrongAttempts?: number) => void;
};

function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function MatchingDrill({ step, onAnswer }: MatchingDrillProps) {
  const answerOptions = useMemo(
    () => shuffleItems(step.pairs.map((pair) => pair.answer)),
    [step.pairs],
  );

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [matchedPromptIds, setMatchedPromptIds] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function handleAnswerClick(answer: string) {
    if (!selectedPromptId || result !== null) return;

    const pair = step.pairs.find((entry) => entry.id === selectedPromptId);
    if (!pair) return;

    if (pair.answer === answer) {
      const nextMatched = [...matchedPromptIds, selectedPromptId];
      setMatchedPromptIds(nextMatched);
      setSelectedPromptId(null);

      if (nextMatched.length === step.pairs.length) {
        setResult("correct");
        onAnswer(wrongAttempts === 0, wrongAttempts);
      }
      return;
    }

    setWrongAttempts((current) => current + 1);
    setResult("incorrect");
    setSelectedPromptId(null);
    window.setTimeout(() => setResult(null), 900);
  }

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Matching drill · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-caption text-muted-foreground">Japanese</p>
            {step.pairs.map((pair) => {
              const matched = matchedPromptIds.includes(pair.id);
              const selected = selectedPromptId === pair.id;
              return (
                <Button
                  key={pair.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-start whitespace-normal px-4 py-3 text-left",
                    selected && "border-primary bg-primary/5",
                    matched && "border-success/40 bg-success/10",
                  )}
                  disabled={matched || result === "correct"}
                  onClick={() => setSelectedPromptId(pair.id)}
                >
                  {pair.prompt}
                </Button>
              );
            })}
          </div>
          <div className="space-y-2">
            <p className="text-caption text-muted-foreground">Meanings / readings</p>
            {answerOptions.map((answer) => (
              <Button
                key={answer}
                type="button"
                variant="outline"
                className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                disabled={!selectedPromptId || result === "correct"}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </Button>
            ))}
          </div>
        </div>
        <DrillFeedbackBanner
          result={result}
          message={
            result === "correct"
              ? "All matched!"
              : result === "incorrect"
                ? "That pair does not match."
                : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
