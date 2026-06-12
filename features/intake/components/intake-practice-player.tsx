"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ApplicationDrill } from "@/features/learning/components/drills/application-drill";
import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { TypedRecallDrill } from "@/features/learning/components/drills/typed-recall-drill";
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

  if (finished) {
    const accuracy =
      session.steps.length === 0
        ? 0
        : Math.round((correctCount / session.steps.length) * 100);

    return (
      <PageContainer>
        <ScreenHeader title="Practice complete" subtitle={session.modeLabel} />
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardTitle>Nice climb</CardTitle>
            <CardDescription>
              You practiced with mostly kana you know, mixed with romaji and English prompts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Link href="/learn">Continue on the trail</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/intake">Update what I know</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={session.modeLabel}
        subtitle="Built from your known kana and words"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/intake">Inventory</Link>
          </Button>
        }
      />

      <div className="space-y-4">
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
      </div>
    </PageContainer>
  );
}
