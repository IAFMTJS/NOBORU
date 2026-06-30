"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AudioPlayback } from "@/components/media/audio-playback";
import { FeedbackSparkOverlay } from "@/components/visual/feedback-spark-overlay";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { DrillCompanionReaction } from "@/features/learning/components/lesson/drill-companion-reaction";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { DrillRecognitionTimer } from "@/features/learning/components/drills/drill-recognition-timer";
import {
  JapaneseAnswerLabel,
  isJapaneseSurfaceText,
} from "@/features/learning/components/japanese-answer-label";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { DrillDifficultyProps } from "@/features/learning/types/drill-difficulty.types";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import { resolveRecallStepRomaji } from "@/features/learning/utils/exercise-steps";
import { resolveLifecycleStageFromPhase } from "@/features/learning/utils/drill-lifecycle";
import { resolveDifficultyProfile } from "@/lib/learning/difficulty-scaling.service";
import {
  applyDifficultyToChoiceOptions,
  recognitionTimerSeconds,
  resolveFuriganaReading,
  shouldAutoFailOnRecognitionTimeout,
  shouldShowDrillHints,
} from "@/lib/learning/drill-difficulty.utils";
import { shouldDisableDrillHints } from "@/lib/learning/lesson-phase.constants";

type ChoiceRecallDrillProps = DrillDifficultyProps & {
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
  lifecycleStage,
  difficultyProfile,
}: ChoiceRecallDrillProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(true);

  const profile =
    difficultyProfile ??
    resolveDifficultyProfile(
      lifecycleStage ?? resolveLifecycleStageFromPhase(step.phase, step.lifecycleStage),
    );

  const scaled = useMemo(
    () =>
      applyDifficultyToChoiceOptions(step.options, step.correctIndex, profile.choiceCount),
    [profile.choiceCount, step.correctIndex, step.options],
  );

  const furiganaReading = resolveFuriganaReading({
    display: step.display,
    reading: step.reading,
    profile,
  });
  const showHints =
    shouldShowDrillHints(profile) && !shouldDisableDrillHints(step.stage);
  const timerSeconds = recognitionTimerSeconds(profile);
  const enforceTimeout = shouldAutoFailOnRecognitionTimeout(profile);

  const result =
    selected === null
      ? null
      : selected === scaled.correctIndex
        ? ("correct" as const)
        : ("incorrect" as const);

  const japaneseFocus = isJapaneseFocusType(step.contentType);
  const correctAnswer = scaled.options[scaled.correctIndex];
  const displayRomaji = resolveRecallStepRomaji(step);
  const japaneseChoiceOptions =
    step.optionMeta !== undefined
      ? step.optionMeta.length > 0
      : scaled.options.some((option) => isJapaneseSurfaceText(option));

  const handleTimeout = useCallback(() => {
    if (selected !== null || disabled) return;
    setSelected(-1);
    setSelectedLabel("");
    setTimerRunning(false);
    onAnswer(false);
  }, [disabled, onAnswer, selected]);

  useEffect(() => {
    if (result !== "incorrect" || selected === null || selected < 0) return;
    if (selected >= 0) setShakeIndex(selected);
    const timeoutId = window.setTimeout(() => setShakeIndex(null), 420);
    return () => window.clearTimeout(timeoutId);
  }, [result, selected]);

  return (
    <div className="relative flex min-h-[min(32rem,calc(100dvh-12rem))] flex-1 flex-col">
      <FeedbackSparkOverlay active={result === "correct"} />
      <DrillCompanionReaction result={result} />

      <div className="relative flex flex-1 flex-col items-center justify-center px-2 py-6 text-center">
        {timerSeconds ? (
          <div className="absolute right-2 top-2">
            <DrillRecognitionTimer
              seconds={timerSeconds}
              running={timerRunning && selected === null}
              enforceTimeout={enforceTimeout}
              onExpired={handleTimeout}
            />
          </div>
        ) : null}
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
            reading={furiganaReading}
            romaji={displayRomaji}
            size="hero"
            className="relative text-foreground drop-shadow-sm"
          />
        ) : (
          <p className="font-story text-4xl font-bold text-heading-story sm:text-5xl">
            {step.display}
          </p>
        )}
        {soundEnabled && japaneseFocus && showHints ? (
          <div className="relative mt-4 flex justify-center">
            <AudioPlayback audioUrl={null} japaneseText={step.display} label="Listen" />
          </div>
        ) : null}
        {step.phase === "consolidation" && showHints ? (
          <p className="relative mt-3 text-caption text-trail-glow">Final recall · no hints</p>
        ) : null}
      </div>

      <TrailAnswerPad
        className="mt-auto"
        options={scaled.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === scaled.correctIndex;
          const showResult = selected !== null;
          let state: "default" | "selected" | "correct" | "incorrect" | "disabled" = "default";
          if (showResult && isCorrect) state = "correct";
          else if (showResult && isSelected && !isCorrect) state = "incorrect";
          else if (disabled || selected !== null) state = "disabled";

          return {
            id: option,
            label: japaneseChoiceOptions ? (
              <JapaneseAnswerLabel
                text={option}
                reading={step.optionMeta?.[index]?.reading}
                romaji={step.optionMeta?.[index]?.romaji}
              />
            ) : (
              option
            ),
            state,
            shake: shakeIndex === index,
            onSelect:
              disabled || selected !== null
                ? undefined
                : () => {
                    setSelected(index);
                    setSelectedLabel(option);
                    setTimerRunning(false);
                    onAnswer(isCorrect);
                  },
          };
        })}
      />

      {result === "incorrect" && correctAnswer ? (
        <LearningFailurePanel
          className="mt-3"
          userAnswer={selectedLabel ?? ""}
          correctAnswer={correctAnswer}
          seed={step.index}
        />
      ) : null}
    </div>
  );
}
