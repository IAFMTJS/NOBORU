"use client";

import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { MatchingDrill } from "@/features/learning/components/drills/matching-drill";
import { TypedRecallDrill } from "@/features/learning/components/drills/typed-recall-drill";
import type { TrialStepViewModel } from "@/features/trials/types/trial.types";

type TrialStepCardProps = {
  step: TrialStepViewModel;
  onAnswer: (correct: boolean) => void;
};

export function TrialStepCard({ step, onAnswer }: TrialStepCardProps) {
  if (step.kind === "typed_recall") {
    return (
      <TypedRecallDrill
        step={{
          kind: "recall",
          mode: "typed",
          contentType: "vocabulary",
          index: step.index,
          total: step.total,
          prompt: step.prompt,
          display: step.display,
          options: [],
          correctIndex: 0,
          acceptedAnswers: step.acceptedAnswers ?? [],
        }}
        onAnswer={onAnswer}
      />
    );
  }

  if (step.kind === "choice_recall") {
    return (
      <ChoiceRecallDrill
        step={{
          kind: "recall",
          mode: "choice",
          contentType: "vocabulary",
          index: step.index,
          total: step.total,
          prompt: step.prompt,
          display: step.display,
          options: step.options ?? [],
          correctIndex: step.correctIndex ?? 0,
        }}
        onAnswer={onAnswer}
      />
    );
  }

  return (
    <MatchingDrill
      step={{
        kind: "matching",
        index: step.index,
        total: step.total,
        prompt: step.prompt,
        pairs: (step.pairs ?? []).map((pair) => ({
          id: pair.id,
          prompt: pair.prompt,
          answer: pair.answer,
        })),
      }}
      onAnswer={onAnswer}
    />
  );
}
