"use client";

import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { MatchingDrill } from "@/features/learning/components/drills/matching-drill";
import { TypedRecallDrill } from "@/features/learning/components/drills/typed-recall-drill";
import { isJapaneseSurfaceText } from "@/features/learning/components/japanese-answer-label";
import { deriveKanaRomaji, deriveSentenceRomaji } from "@/features/learning/utils/kana-romaji";
import type { TrialStepKind, TrialStepViewModel } from "@/features/trials/types/trial.types";

type TrialStepCardProps = {
  step: TrialStepViewModel;
  onAnswer: (correct: boolean) => void;
};

const TRIAL_LIFECYCLE = "applied" as const;

function resolveTrialDisplayRomaji(display: string): string | null {
  if (!isJapaneseSurfaceText(display)) return null;
  return deriveSentenceRomaji(display) || deriveKanaRomaji(display) || null;
}

const TYPED_STEP_KINDS = new Set<TrialStepKind>([
  "typed_recall",
  "writing_application",
  "applied_vocabulary",
]);

const CHOICE_STEP_KINDS = new Set<TrialStepKind>([
  "choice_recall",
  "reading_comprehension",
  "listening_comprehension",
  "grammar_context",
  "story_comprehension",
]);

export function TrialStepCard({ step, onAnswer }: TrialStepCardProps) {
  const displayRomaji = resolveTrialDisplayRomaji(step.display);

  if (TYPED_STEP_KINDS.has(step.kind)) {
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
          romaji: displayRomaji,
          options: [],
          correctIndex: 0,
          acceptedAnswers: step.acceptedAnswers ?? [],
          lifecycleStage: TRIAL_LIFECYCLE,
        }}
        onAnswer={onAnswer}
      />
    );
  }

  if (CHOICE_STEP_KINDS.has(step.kind)) {
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
          romaji: displayRomaji,
          options: step.options ?? [],
          correctIndex: step.correctIndex ?? 0,
          lifecycleStage: TRIAL_LIFECYCLE,
        }}
        onAnswer={onAnswer}
        lifecycleStage={TRIAL_LIFECYCLE}
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
          promptRomaji: resolveTrialDisplayRomaji(pair.prompt),
        })),
      }}
      onAnswer={onAnswer}
      lifecycleStage={TRIAL_LIFECYCLE}
    />
  );
}
