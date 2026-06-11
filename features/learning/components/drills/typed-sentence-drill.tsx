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

type TypedSentenceDrillProps = {
  prompt: string;
  display: string;
  acceptedAnswers: string[];
  onAnswer: (correct: boolean) => void;
};

function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function TypedSentenceDrill({
  prompt,
  display,
  acceptedAnswers,
  onAnswer,
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
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>Sentence production</CardDescription>
        <CardTitle className="text-heading-5">{prompt}</CardTitle>
        <p className="text-body-sm text-muted-foreground">{display}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type the Japanese sentence"
          disabled={result !== null}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
        <Button
          className="w-full"
          disabled={!value.trim() || result !== null}
          onClick={handleSubmit}
        >
          Check sentence
        </Button>
        <DrillFeedbackBanner result={result} />
      </CardContent>
    </Card>
  );
}
