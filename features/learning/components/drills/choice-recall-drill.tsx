"use client";

import { useEffect, useState } from "react";

import { AudioPlayback } from "@/components/media/audio-playback";
import { FeedbackSparkOverlay } from "@/components/visual/feedback-spark-overlay";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { DrillCompanionReaction } from "@/features/learning/components/lesson/drill-companion-reaction";
import { LessonExplanationPanel } from "@/features/learning/components/lesson/lesson-explanation-panel";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";

type ChoiceRecallDrillProps = {
  step: LessonRecallStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
  soundEnabled?: boolean;
};

function isJapaneseFocusType(contentType: LessonRecallStep["contentType"]): boolean {
  return (
    contentType === "vocabulary" ||
    contentType === "kanji" ||
    contentType === "hiragana" ||
    contentType === "katakana" ||
    contentType === "grammar"
  );
}

export function ChoiceRecallDrill({
  step,
  onAnswer,
  disabled = false,
  soundEnabled = true,
}: ChoiceRecallDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const result =
    selected === null
      ? null
      : selected === step.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);

  const japaneseFocus = isJapaneseFocusType(step.contentType);
  const correctAnswer = step.options[step.correctIndex];

  useEffect(() => {
    if (result !== "incorrect" || selected === null) return;
    setShakeIndex(selected);
    const timeoutId = window.setTimeout(() => setShakeIndex(null), 420);
    return () => window.clearTimeout(timeoutId);
  }, [result, selected]);

  return (
    <div className="relative flex min-h-[min(32rem,calc(100dvh-12rem))] flex-1 flex-col">
      <FeedbackSparkOverlay active={result === "correct"} />
      <DrillCompanionReaction result={result} />

      <div className="relative flex flex-1 flex-col items-center justify-center px-2 py-6 text-center">
        {step.contentType === "kanji" ? (
          <p
            lang="ja"
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-japanese text-[7rem] font-semibold text-white/[0.06] sm:text-[9rem]"
            aria-hidden
          >
            {step.display}
          </p>
        ) : null}
        <p className="mb-3 text-caption text-muted-foreground">{step.prompt}</p>
        {japaneseFocus ? (
          <JapaneseText
            text={step.display}
            size="hero"
            className="relative text-foreground drop-shadow-sm"
          />
        ) : (
          <p className="font-story text-4xl font-bold text-heading-story sm:text-5xl">
            {step.display}
          </p>
        )}
        {soundEnabled && japaneseFocus ? (
          <div className="relative mt-4 flex justify-center">
            <AudioPlayback audioUrl={null} japaneseText={step.display} label="Listen" />
          </div>
        ) : null}
        {step.phase === "consolidation" ? (
          <p className="relative mt-3 text-caption text-trail-glow">Final recall · no hints</p>
        ) : null}
      </div>

      <TrailAnswerPad
        className="mt-auto"
        options={step.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === step.correctIndex;
          const showResult = selected !== null;
          let state: "default" | "selected" | "correct" | "incorrect" | "disabled" = "default";
          if (showResult && isCorrect) state = "correct";
          else if (showResult && isSelected && !isCorrect) state = "incorrect";
          else if (disabled || selected !== null) state = "disabled";

          return {
            id: option,
            label: option,
            state,
            shake: shakeIndex === index,
            onSelect:
              disabled || selected !== null
                ? undefined
                : () => {
                    setSelected(index);
                    onAnswer(isCorrect);
                  },
          };
        })}
      />

      {result === "incorrect" ? (
        <LessonExplanationPanel
          className="mt-3"
          message="Not quite — here is the right reading."
          correctAnswer={correctAnswer}
        />
      ) : null}
    </div>
  );
}
