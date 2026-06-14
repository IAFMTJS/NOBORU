"use client";

import { useState } from "react";

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
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { LessonFillBlankStep } from "@/features/learning/types/lesson.types";

type FillBlankDrillProps = {
  step: LessonFillBlankStep;
  onAnswer: (correct: boolean) => void;
};

export function FillBlankDrill({ step, onAnswer }: FillBlankDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const result =
    selected === null
      ? null
      : selected === step.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Production · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
        <JapaneseText text={step.sentenceWithBlank} size="lg" />
        <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {step.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === step.correctIndex;
          const showResult = selected !== null;

          return (
            <Button
              key={`${option}-${index}`}
              variant="outline"
              className={cn(
                "h-auto w-full justify-start whitespace-normal px-4 py-3 text-left transition-colors duration-200 motion-reduce:transition-none",
                showResult && isCorrect && "border-success/40 bg-success/10",
                showResult && isSelected && !isCorrect && "border-destructive/40 bg-destructive/10",
              )}
              disabled={selected !== null}
              onClick={() => {
                setSelected(index);
                onAnswer(isCorrect);
              }}
            >
              {option}
            </Button>
          );
        })}
        <DrillFeedbackBanner result={result} />
      </CardContent>
    </Card>
  );
}
