"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
import type {
  LessonRecallStep,
  LessonReadingStep,
  LessonSessionViewModel,
  LessonStep,
  LessonTeachStep,
} from "@/features/learning/types/lesson.types";
import { DialoguePlayer } from "@/features/reading/components/dialogue-player";
import { StoryReader } from "@/features/reading/components/story-reader";

type LessonPlayerProps = {
  session: LessonSessionViewModel;
};

function TeachCard({ step }: { step: LessonTeachStep }) {
  const { content } = step;

  if (content.type === "vocabulary") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Vocabulary · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-3">{content.kana}</CardTitle>
          {content.kanji ? (
            <p className="text-heading-5 text-muted-foreground">{content.kanji}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.partOfSpeech ? (
            <Badge variant="secondary">{content.partOfSpeech}</Badge>
          ) : null}
          {content.audioUrl ? (
            <audio controls className="w-full" src={content.audioUrl}>
              <track kind="captions" />
            </audio>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <div key={example.japaneseText} className="space-y-1 text-left">
                  <p className="text-body-sm">{example.japaneseText}</p>
                  {example.romaji ? (
                    <p className="text-caption text-muted-foreground">
                      {example.romaji}
                    </p>
                  ) : null}
                  <p className="text-caption text-muted-foreground">
                    {example.english}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "hiragana") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Hiragana · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-heading-5">{content.romaji}</p>
          <Badge variant="secondary">{content.rowLabel}</Badge>
        </CardContent>
      </Card>
    );
  }

  if (content.type === "katakana") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Katakana · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-heading-5">{content.romaji}</p>
          <Badge variant="secondary">{content.rowLabel}</Badge>
        </CardContent>
      </Card>
    );
  }

  if (content.type === "kanji") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Kanji · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.strokeCount ? (
            <Badge variant="outline">{content.strokeCount} strokes</Badge>
          ) : null}
          {content.onyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              On: {content.onyomi.join(" · ")}
            </p>
          ) : null}
          {content.kunyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Kun: {content.kunyomi.join(" · ")}
            </p>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <div key={example.japaneseText} className="space-y-1 text-left">
                  <p className="text-body-sm">{example.japaneseText}</p>
                  {example.romaji ? (
                    <p className="text-caption text-muted-foreground">
                      {example.romaji}
                    </p>
                  ) : null}
                  <p className="text-caption text-muted-foreground">
                    {example.english}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "grammar") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Grammar · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-4">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.explanation ? (
            <p className="text-body-sm text-muted-foreground">{content.explanation}</p>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <div key={example.japaneseText} className="space-y-1 text-left">
                  <p className="text-body-sm">{example.japaneseText}</p>
                  {example.romaji ? (
                    <p className="text-caption text-muted-foreground">
                      {example.romaji}
                    </p>
                  ) : null}
                  <p className="text-caption text-muted-foreground">
                    {example.english}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return null;
}

function ReadingCard({
  step,
  onAnswer,
}: {
  step: LessonReadingStep;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const { content } = step;

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Reading · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{content.title}</CardTitle>
        <p className="text-heading-4 leading-relaxed">{content.japaneseText}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.romaji ? (
          <p className="text-body-sm text-muted-foreground">{content.romaji}</p>
        ) : null}
        {content.english ? (
          <p className="text-body-sm text-muted-foreground">{content.english}</p>
        ) : null}
        <p className="text-body font-medium">{content.question}</p>
        {content.options.map((option, index) => (
          <Button
            key={option}
            variant="outline"
            className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
            disabled={selected !== null}
            onClick={() => {
              setSelected(index);
              onAnswer(index === content.correctOptionIndex);
            }}
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function RecallCard({
  step,
  onAnswer,
}: {
  step: LessonRecallStep;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Recall · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{step.prompt}</CardTitle>
        <p className="text-heading-3">{step.display}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {step.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === step.correctIndex;
          const showResult = selected !== null;

          return (
            <Button
              key={option}
              variant="outline"
              className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
              disabled={selected !== null}
              onClick={() => {
                setSelected(index);
                onAnswer(isCorrect);
              }}
              data-selected={isSelected || undefined}
              data-correct={showResult && isCorrect ? true : undefined}
            >
              {option}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function LessonPlayer({ session }: LessonPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(session.progress === "completed");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recallCorrect, setRecallCorrect] = useState(0);
  const [recallTotal, setRecallTotal] = useState(0);
  const [recallAnswered, setRecallAnswered] = useState(false);
  const [embeddedComplete, setEmbeddedComplete] = useState(false);
  const [completedScore, setCompletedScore] = useState(session.score);

  const checkStepCount = useMemo(
    () =>
      session.steps.filter(
        (step) =>
          step.kind === "recall" ||
          step.kind === "reading" ||
          step.kind === "story" ||
          step.kind === "dialogue",
      ).length,
    [session.steps],
  );

  const currentStep: LessonStep | undefined = session.steps[stepIndex];
  const progressPercent = Math.round(
    ((stepIndex + 1) / session.steps.length) * 100,
  );

  useEffect(() => {
    setRecallAnswered(false);
    setEmbeddedComplete(false);
  }, [stepIndex]);

  async function handleStart() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/learning/lessons/${session.lessonId}`, {
        method: "POST",
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!result.success) {
        throw new Error(result.error ?? "Unable to start lesson.");
      }
      setStarted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start lesson.");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(score: number) {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/learning/progress/${session.lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        },
      );
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: { score: number };
      };
      if (!result.success) {
        throw new Error(result.error ?? "Unable to save progress.");
      }
      setCompletedScore(result.data?.score ?? score);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function goNext() {
    const nextIndex = stepIndex + 1;
    const nextStep = session.steps[nextIndex];

    if (nextStep?.kind === "complete") {
      const score =
        recallTotal === 0
          ? 100
          : Math.round((recallCorrect / recallTotal) * 100);
      void handleComplete(score);
    }

    setStepIndex(nextIndex);
  }

  function handleRecallAnswer(correct: boolean) {
    setRecallTotal((current) => current + 1);
    if (correct) setRecallCorrect((current) => current + 1);
    setRecallAnswered(true);
  }

  if (!currentStep) {
    return null;
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={session.title}
        subtitle={`${session.type} lesson · ${session.xpReward} XP`}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${session.regionSlug}`}>Exit</Link>
          </Button>
        }
      />

      <ProgressBar value={progressPercent} label="Lesson progress" showValue />

      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {currentStep.kind === "intro" ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardDescription className="capitalize">
              {currentStep.lessonType} lesson
            </CardDescription>
            <CardTitle className="text-heading-4">{currentStep.title}</CardTitle>
            {currentStep.description ? (
              <CardDescription>{currentStep.description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body-sm text-muted-foreground">
              {checkStepCount} checks · {currentStep.xpReward} XP reward
            </p>
            {session.progress === "completed" ? (
              <Badge variant="secondary">Already completed · {session.score}%</Badge>
            ) : null}
            {!started ? (
              <Button className="w-full" loading={saving} onClick={() => void handleStart()}>
                {session.progress === "completed" ? "Review Lesson" : "Start Lesson"}
              </Button>
            ) : (
              <Button className="w-full" onClick={goNext}>
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      {currentStep.kind === "teach" ? (
        <>
          <TeachCard step={currentStep} />
          <Button className="w-full" onClick={goNext}>
            Continue
          </Button>
        </>
      ) : null}

      {currentStep.kind === "recall" ? (
        <>
          <RecallCard step={currentStep} onAnswer={handleRecallAnswer} />
          <Button
            className="w-full"
            onClick={goNext}
            disabled={!recallAnswered}
          >
            Continue
          </Button>
        </>
      ) : null}

      {currentStep.kind === "reading" ? (
        <>
          <ReadingCard step={currentStep} onAnswer={handleRecallAnswer} />
          <Button
            className="w-full"
            onClick={goNext}
            disabled={!recallAnswered}
          >
            Continue
          </Button>
        </>
      ) : null}

      {currentStep.kind === "story" ? (
        <>
          <StoryReader
            embedded
            story={{
              id: currentStep.content.id,
              title: currentStep.content.title,
              slug: currentStep.content.slug,
              summary: currentStep.content.summary,
              jlptLevel: "n5",
              estimatedReadTime: currentStep.content.sections.length * 2,
              sections: currentStep.content.sections,
              questions: currentStep.content.questions,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= 60) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
          <Button className="w-full" onClick={goNext} disabled={!embeddedComplete}>
            Continue
          </Button>
        </>
      ) : null}

      {currentStep.kind === "dialogue" ? (
        <>
          <DialoguePlayer
            embedded
            dialogue={{
              id: currentStep.content.id,
              title: currentStep.content.title,
              slug: currentStep.content.slug,
              description: currentStep.content.description,
              jlptLevel: "n5",
              nodes: currentStep.content.nodes,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= 60) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
          <Button className="w-full" onClick={goNext} disabled={!embeddedComplete}>
            Continue
          </Button>
        </>
      ) : null}

      {currentStep.kind === "complete" ? (
        <Card className="border-success/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Lesson Complete</CardTitle>
            <CardDescription>
              Score {completedScore}% · {session.xpReward} XP earned
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href={`/learn/${session.regionSlug}`}>Back to Region</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn">Learning Path</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </PageContainer>
  );
}
