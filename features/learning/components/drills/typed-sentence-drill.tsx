"use client";

import { useState } from "react";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { Input } from "@/components/ui/input";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import {
  isJapaneseTextAnswerCorrect,
  pickJapaneseAnswerCorrection,
} from "@/features/learning/utils/recall-answers";

import type { HintPolicyFields } from "@/lib/learning/hint-policy.types";
import { useStepHintPolicy } from "@/features/learning/hooks/use-step-hint-policy";
import { ShowPronunciationButton } from "@/features/learning/components/drills/show-pronunciation-button";

type TypedSentenceDrillProps = HintPolicyFields & {
  prompt: string;
  display: string;
  referenceJapanese?: string;
  sentenceRomaji?: string | null;
  acceptedAnswers: string[];
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function TypedSentenceDrill({
  prompt,
  display,
  referenceJapanese,
  sentenceRomaji,
  acceptedAnswers,
  hintPolicy,
  onAnswer,
  disabled = false,
}: TypedSentenceDrillProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const hints = useStepHintPolicy({ hintPolicy });

  function handleSubmit() {
    const correct = isJapaneseTextAnswerCorrect(value, acceptedAnswers);
    setResult(correct ? "correct" : "incorrect");
    onAnswer(correct);
  }

  return (
    <LessonDrillLayout
      prompt={prompt}
      result={result}
      hero={
        referenceJapanese ? (
          <div className="space-y-2">
            <AnnotatedJapaneseText
              text={referenceJapanese}
              romaji={hints.showRomaji ? sentenceRomaji : null}
              english={hints.showTranslation ? display : null}
              size="lg"
              className="max-w-md text-foreground"
              supportMode="tap"
            />
            <ShowPronunciationButton
              visible={hints.canRevealRomaji}
              revealed={hints.romajiRevealed}
              onReveal={hints.revealRomaji}
            />
          </div>
        ) : (
          <p className="max-w-md text-body text-muted-foreground">{display}</p>
        )
      }
      footer={
        <>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type the sentence in Japanese or romaji"
            disabled={disabled || result !== null}
            className="border-white/15 bg-black/30"
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          <PrimaryClimbButton
            className="w-full"
            disabled={!value.trim() || result !== null || disabled}
            onClick={handleSubmit}
          >
            Check sentence
          </PrimaryClimbButton>
        </>
      }
      explanation={
        result === "incorrect" ? (
          <LearningFailurePanel
            className="mt-3"
            userAnswer={value}
            correctAnswer={pickJapaneseAnswerCorrection(acceptedAnswers, value)}
            seed={0}
          />
        ) : null
      }
    />
  );
}
