"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { GlassPanel, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { ApplicationDrill } from "@/features/learning/components/drills/application-drill";
import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { TypedRecallDrill } from "@/features/learning/components/drills/typed-recall-drill";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type { IntakePracticeSessionViewModel } from "@/features/intake/types/intake.types";

type IntakePracticePlayerProps = {
  session: IntakePracticeSessionViewModel;
};

export function IntakePracticePlayer({ session }: IntakePracticePlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentStep = session.steps[stepIndex];
  const progressPercent =
    session.steps.length === 0
      ? 0
      : Math.round(((finished ? session.steps.length : stepIndex) / session.steps.length) * 100);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setCorrectCount((count) => count + 1);
    }
    setAnswered(true);
  }, []);

  function goNext() {
    const isLast = stepIndex >= session.steps.length - 1;
    if (isLast) {
      setFinished(true);
      return;
    }
    setAnswered(false);
    setStepIndex((index) => index + 1);
  }

  if (session.steps.length === 0) {
    return (
      <StudyHubLayout
        scene="study_atmosphere"
        title={session.modeLabel}
        subtitle="Built from your known kana and words"
        backHref="/learn/intake"
        backLabel="Inventory"
      >
        <YamaEmptyState
          surface="generic"
          title="Practice awaits your inventory"
          description="Add kana or vocabulary to your trail inventory before practicing here."
          actionHref="/learn/intake"
          actionLabel="Update inventory"
        />
      </StudyHubLayout>
    );
  }

  if (finished) {
    const accuracy =
      session.steps.length === 0
        ? 0
        : Math.round((correctCount / session.steps.length) * 100);

    return (
      <StudyHubLayout
        scene="study_atmosphere"
        title="Practice complete"
        subtitle={session.modeLabel}
        backHref="/learn/intake"
        backLabel="Inventory"
      >
        <GlassPanel className="space-y-4 p-4">
          <div className="space-y-1">
            <StoryTitle as="h2" className="text-lg">
              Nice climb
            </StoryTitle>
            <p className="text-body-sm text-muted-foreground">
              You practiced with mostly kana you know, mixed with romaji and English prompts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-heading-4">{correctCount}</p>
              <p className="text-caption text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-heading-4">{accuracy}%</p>
              <p className="text-caption text-muted-foreground">Accuracy</p>
            </div>
          </div>
          {session.newKanaCharacters.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              New kana in this session:{" "}
              <span className="font-medium text-foreground">
                {session.newKanaCharacters.join(" ")}
              </span>
            </p>
          ) : null}
          <Button className="w-full" asChild>
            <Link href="/tree">Continue on the trail</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/learn/intake">Update what I know</Link>
          </Button>
        </GlassPanel>
      </StudyHubLayout>
    );
  }

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={session.modeLabel}
      subtitle="Built from your known kana and words"
      backHref="/learn/intake"
      backLabel="Inventory"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{session.knownHiraganaCount} hiragana</Badge>
        <Badge variant="secondary">{session.knownKatakanaCount} katakana</Badge>
        <Badge variant="secondary">{session.knownVocabularyCount} words</Badge>
      </div>

      <ProgressBar value={progressPercent} label="Session progress" showValue />

      {currentStep?.kind === "application" ? (
        <ApplicationDrill key={stepIndex} step={currentStep} onAnswer={handleAnswer} />
      ) : null}

      {currentStep?.kind === "recall" && currentStep.mode === "choice" ? (
        <ChoiceRecallDrill key={stepIndex} step={currentStep} onAnswer={handleAnswer} />
      ) : null}

      {currentStep?.kind === "recall" && currentStep.mode === "typed" ? (
        <TypedRecallDrill key={stepIndex} step={currentStep} onAnswer={handleAnswer} />
      ) : null}

      <Button className="w-full" onClick={goNext} disabled={!answered}>
        Continue
      </Button>
    </StudyHubLayout>
  );
}
