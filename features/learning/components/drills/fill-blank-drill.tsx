"use client";

import { useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import { FillBlankOptionTile } from "@/features/learning/components/drills/fill-blank-option-tile";
import { cn } from "@/lib/utils";
import type { LessonFillBlankStep } from "@/features/learning/types/lesson.types";
import { formatFillBlankAnswer } from "@/features/learning/utils/exercise-steps";

type FillBlankDrillProps = {
  step: LessonFillBlankStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function FillBlankSentenceHero({
  step,
  filledJapanese,
}: {
  step: LessonFillBlankStep;
  filledJapanese?: string | null;
}) {
  const displayText = filledJapanese
    ? step.sentenceWithBlank.replace("___", filledJapanese)
    : step.sentenceWithBlank;

  return (
    <div className="space-y-3">
      <AnnotatedJapaneseText
        text={displayText}
        romaji={step.sentenceRomaji}
        size="hero"
        className="text-foreground"
        supportMode="tap"
      />
      <p className="text-body-sm text-muted-foreground">{step.englishHint}</p>
    </div>
  );
}

function FillBlankChoiceMode({
  step,
  onAnswer,
  disabled = false,
}: FillBlankDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const result =
    selected === null
      ? null
      : selected === step.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);
  const correctAnswer = step.options[step.correctIndex];

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={<FillBlankSentenceHero step={step} />}
      footer={
        <>
          {step.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = index === step.correctIndex;
            const showResult = selected !== null;

            return (
              <FillBlankOptionTile
                key={`${option.japanese}-${index}`}
                option={option}
                selected={isSelected}
                disabled={disabled || selected !== null}
                showResult={showResult}
                isCorrect={showResult && isCorrect}
                isIncorrectSelection={showResult && isSelected && !isCorrect}
                layout="row"
                onClick={() => {
                  setSelected(index);
                  onAnswer(isCorrect);
                }}
              />
            );
          })}
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={
              selected === null ? "" : formatFillBlankAnswer(step.options[selected]!)
            }
            correctAnswer={correctAnswer ? formatFillBlankAnswer(correctAnswer) : ""}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}

function FillBlankBlocksMode({
  step,
  onAnswer,
  disabled = false,
}: FillBlankDrillProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const selectedOption = selectedIndex === null ? null : step.options[selectedIndex];
  const showResult = result !== null;

  function handleSelect(index: number) {
    if (showResult || disabled) return;
    setSelectedIndex((current) => (current === index ? null : index));
  }

  function handleClear() {
    if (showResult || disabled) return;
    setSelectedIndex(null);
  }

  function handleCheck() {
    if (selectedIndex === null || showResult || disabled) return;
    const correct = selectedIndex === step.correctIndex;
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  const correctAnswer = step.options[step.correctIndex];

  return (
    <LessonDrillLayout
      prompt={`${step.prompt} · ${step.index}/${step.total}`}
      result={result}
      hero={
        <div className="space-y-4">
          <FillBlankSentenceHero
            step={step}
            filledJapanese={selectedOption?.japanese ?? null}
          />
          <div
            className={cn(
              "min-h-20 rounded-xl border border-dashed p-4 transition-colors",
              selectedOption
                ? "border-trail-glow/35 bg-trail-glow/8"
                : "border-white/20 bg-black/25",
            )}
            aria-label="Your answer for the blank"
          >
            {selectedOption ? (
              <JapaneseText
                text={selectedOption.japanese}
                reading={selectedOption.reading}
                romaji={selectedOption.romaji}
                size="lg"
                className="text-foreground"
              />
            ) : (
              <p className="text-body-sm text-muted-foreground">
                Tap a word below to fill the blank
              </p>
            )}
          </div>
        </div>
      }
      footer={
        <>
          <div className="flex flex-wrap gap-2">
            {step.options.map((option, index) => (
              <FillBlankOptionTile
                key={`${option.japanese}-${index}`}
                option={option}
                selected={selectedIndex === index}
                disabled={disabled || showResult}
                showResult={showResult}
                isCorrect={showResult && index === step.correctIndex}
                isIncorrectSelection={
                  showResult && index === selectedIndex && index !== step.correctIndex
                }
                layout="chip"
                onClick={() => handleSelect(index)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="focus-ring flex-1 rounded-lg border border-white/15 py-2 text-body-sm disabled:opacity-40"
              disabled={selectedIndex === null || showResult || disabled}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <PrimaryClimbButton
            className={cn("w-full", result === "correct" && "trail-glow-warm")}
            disabled={selectedIndex === null || showResult || disabled}
            onClick={handleCheck}
          >
            Check answer
          </PrimaryClimbButton>
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={
              selectedOption ? formatFillBlankAnswer(selectedOption) : ""
            }
            correctAnswer={correctAnswer ? formatFillBlankAnswer(correctAnswer) : ""}
            seed={step.index}
          />
        ) : null
      }
    />
  );
}

export function FillBlankDrill(props: FillBlankDrillProps) {
  const interaction = props.step.interaction ?? "blocks";

  if (interaction === "blocks") {
    return <FillBlankBlocksMode {...props} />;
  }

  return <FillBlankChoiceMode {...props} />;
}
