"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { LessonKnowledgeInventoryStep } from "@/features/learning/types/lesson.types";

type KnowledgeInventoryCardProps = {
  step: LessonKnowledgeInventoryStep;
};

function resolveScriptLabel(script: LessonKnowledgeInventoryStep["script"]): string {
  return script === "katakana" ? "Katakana" : "Hiragana";
}

export function KnowledgeInventoryCard({ step }: KnowledgeInventoryCardProps) {
  const scriptLabel = resolveScriptLabel(step.script);
  const progressPercent =
    step.totalCount === 0
      ? 0
      : Math.round((step.learnedCount / step.totalCount) * 100);

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>Your trail inventory</CardDescription>
        <CardTitle className="text-heading-5">
          {scriptLabel} you know so far
        </CardTitle>
        <p className="text-body-sm text-muted-foreground">
          These application questions use mostly the {scriptLabel.toLowerCase()}{" "}
          characters you have already learned. Romaji and English hints fill in
          the rest until you master more.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-muted-foreground">Characters learned</span>
            <span className="font-medium">
              {step.learnedCount} / {step.totalCount}
            </span>
          </div>
          <ProgressBar value={progressPercent} />
        </div>
        <div className="flex flex-wrap gap-2">
          {step.learnedCharacters.map((entry) => (
            <span
              key={`${entry.character}-${entry.romaji}`}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border bg-muted/40 px-2 text-lg"
              title={entry.romaji}
            >
              {entry.character}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
