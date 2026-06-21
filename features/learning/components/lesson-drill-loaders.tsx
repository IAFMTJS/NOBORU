"use client";

import dynamic from "next/dynamic";

import type { LessonStep } from "@/features/learning/types/lesson.types";

function DrillSkeleton() {
  return (
    <div
      className="h-48 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
      aria-hidden
    />
  );
}

const ApplicationDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/application-drill").then(
      (module) => module.ApplicationDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const ChoiceRecallDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/choice-recall-drill").then(
      (module) => module.ChoiceRecallDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const FillBlankDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/fill-blank-drill").then(
      (module) => module.FillBlankDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const MatchingDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/matching-drill").then(
      (module) => module.MatchingDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const TypedRecallDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/typed-recall-drill").then(
      (module) => module.TypedRecallDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const TypedSentenceDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/typed-sentence-drill").then(
      (module) => module.TypedSentenceDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const WordBankDrill = dynamic(
  () =>
    import("@/features/learning/components/drills/word-bank-drill").then(
      (module) => module.WordBankDrill,
    ),
  { loading: () => <DrillSkeleton /> },
);

const LevelUpCeremony = dynamic(
  () =>
    import("@/components/visual/world/level-up-ceremony").then(
      (module) => module.LevelUpCeremony,
    ),
  { loading: () => null },
);

type RecallHandler = (correct: boolean) => void;

type LessonDrillStepProps = {
  step: Extract<
    LessonStep,
    | { kind: "application" }
    | { kind: "recall" }
    | { kind: "matching" }
    | { kind: "fill_blank" }
    | { kind: "word_bank" }
    | { kind: "sentence_typed" }
  >;
  onAnswer: RecallHandler;
  soundEnabled?: boolean;
};

export function LessonDrillStep({
  step,
  onAnswer,
  soundEnabled = true,
}: LessonDrillStepProps) {
  switch (step.kind) {
    case "application":
      return <ApplicationDrill step={step} onAnswer={onAnswer} />;
    case "recall":
      return step.mode === "typed" ? (
        <TypedRecallDrill step={step} onAnswer={onAnswer} />
      ) : (
        <ChoiceRecallDrill
          step={step}
          onAnswer={onAnswer}
          soundEnabled={soundEnabled}
        />
      );
    case "matching":
      return <MatchingDrill step={step} onAnswer={onAnswer} />;
    case "fill_blank":
      return <FillBlankDrill step={step} onAnswer={onAnswer} />;
    case "word_bank":
      return <WordBankDrill step={step} onAnswer={onAnswer} />;
    case "sentence_typed":
      return (
        <TypedSentenceDrill
          prompt={step.prompt}
          display={step.englishHint}
          acceptedAnswers={step.acceptedAnswers}
          onAnswer={onAnswer}
        />
      );
    default:
      return null;
  }
}

export { LevelUpCeremony };
