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
import type { LessonWordBankStep } from "@/features/learning/types/lesson.types";

type WordBankDrillProps = {
  step: LessonWordBankStep;
  onAnswer: (correct: boolean) => void;
};

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function WordBankDrill({ step, onAnswer }: WordBankDrillProps) {
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
    if (result !== null) return;
    setSelected((current) => [...current, token]);
  }

  function handleUndo() {
    if (result !== null) return;
    setSelected((current) => current.slice(0, -1));
  }

  function handleClear() {
    if (result !== null) return;
    setSelected([]);
  }

  function handleCheck() {
    const correct = arraysEqual(selected, step.correctOrder);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Production · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
        <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="min-h-14 rounded-lg border border-dashed border-border bg-muted/30 p-3"
          aria-label="Your sentence"
        >
          {selected.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">Tap words below to build the sentence</p>
          ) : (
            <p className="text-heading-5 leading-relaxed">{selected.join("")}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {remainingTokens.map((token, index) => (
            <Button
              key={`${token}-${index}`}
              type="button"
              variant="outline"
              size="sm"
              className="text-heading-6"
              disabled={result !== null}
              onClick={() => handleSelect(token)}
            >
              {token}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={selected.length === 0 || result !== null}
            onClick={handleUndo}
          >
            Undo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={selected.length === 0 || result !== null}
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>

        <Button
          className={cn("w-full", result === "correct" && "border-success/40 bg-success/10")}
          disabled={selected.length !== step.correctOrder.length || result !== null}
          onClick={handleCheck}
        >
          Check sentence
        </Button>
        <DrillFeedbackBanner result={result} />
      </CardContent>
    </Card>
  );
}
