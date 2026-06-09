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
import type { StoryDetailViewModel } from "@/features/reading/types/reading.types";

type StoryReaderProps = {
  story: StoryDetailViewModel;
  embedded?: boolean;
  onComplete?: (score: number) => void;
};

export function StoryReader({ story, embedded = false, onComplete }: StoryReaderProps) {
  const [phase, setPhase] = useState<"read" | "quiz" | "done">(
    story.completed ? "done" : "read",
  );
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answered, setAnswered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(story.score);

  const currentSection = story.sections[sectionIndex];
  const currentQuestion = story.questions[questionIndex];
  const readProgress = useMemo(() => {
    if (story.sections.length === 0) return 100;
    return Math.round(((sectionIndex + 1) / story.sections.length) * 100);
  }, [sectionIndex, story.sections.length]);

  useEffect(() => {
    if (story.completed || embedded) return;
    void fetch("/api/reading/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: "story",
        contentId: story.id,
        status: "in_progress",
        score: 0,
      }),
    });
  }, [embedded, story.completed, story.id]);

  async function saveProgress(finalScore: number) {
    if (embedded) {
      onComplete?.(finalScore);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/reading/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "story",
          contentId: story.id,
          status: "completed",
          score: finalScore,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!result.success) {
        throw new Error(result.error ?? "Unable to save progress.");
      }
      setScore(finalScore);
      setPhase("done");
      onComplete?.(finalScore);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function finishQuiz(totalCorrect: number) {
    const finalScore =
      story.questions.length === 0
        ? 100
        : Math.round((totalCorrect / story.questions.length) * 100);
    void saveProgress(finalScore);
  }

  const content = (
    <div className="space-y-4">
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {phase === "read" && currentSection ? (
        <>
          <ProgressBar value={readProgress} label="Story progress" showValue />
          <Card className="shadow-elevation-1">
            <CardHeader>
              <CardDescription>
                Section {sectionIndex + 1} of {story.sections.length}
              </CardDescription>
              <CardTitle className="text-heading-4 leading-relaxed">
                {currentSection.japaneseText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentSection.romaji ? (
                <p className="text-body-sm text-muted-foreground">
                  {currentSection.romaji}
                </p>
              ) : null}
              {currentSection.english ? (
                <p className="text-body-sm text-muted-foreground">
                  {currentSection.english}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Button
            className="w-full"
            onClick={() => {
              if (sectionIndex + 1 >= story.sections.length) {
                setPhase(story.questions.length > 0 ? "quiz" : "done");
                if (story.questions.length === 0) {
                  void saveProgress(100);
                }
                return;
              }
              setSectionIndex((current) => current + 1);
            }}
          >
            {sectionIndex + 1 >= story.sections.length ? "Start Questions" : "Continue"}
          </Button>
        </>
      ) : null}

      {phase === "quiz" && currentQuestion ? (
        <>
          <Card className="shadow-elevation-1">
            <CardHeader>
              <CardDescription>
                Question {questionIndex + 1} of {story.questions.length}
              </CardDescription>
              <CardTitle className="text-heading-5">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={option}
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                  disabled={answered}
                  onClick={() => {
                    setAnswered(true);
                    const isCorrect = index === currentQuestion.correctOptionIndex;
                    setAnswers((current) => [...current, isCorrect]);
                  }}
                >
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Button
            className="w-full"
            disabled={!answered || saving}
            loading={saving}
            onClick={() => {
              if (questionIndex + 1 >= story.questions.length) {
                const totalCorrect = answers.filter(Boolean).length;
                finishQuiz(totalCorrect);
                return;
              }
              setQuestionIndex((current) => current + 1);
              setAnswered(false);
            }}
          >
            Continue
          </Button>
        </>
      ) : null}

      {phase === "done" ? (
        <Card className="border-success/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Story Complete</CardTitle>
            <CardDescription>Score {score}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!embedded ? (
              <>
                <Button className="w-full" asChild>
                  <Link href="/learn/reading">Back to Reading</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/learn/mount-n5">Back to Mount N5</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={story.title}
        subtitle={story.summary ?? "N5 reading story"}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/reading">Back</Link>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        {story.jlptLevel ? (
          <Badge variant="outline">{story.jlptLevel.toUpperCase()}</Badge>
        ) : null}
        <Badge variant="outline">{story.estimatedReadTime} min</Badge>
        {story.completed ? <Badge variant="secondary">Completed</Badge> : null}
      </div>
      {content}
    </PageContainer>
  );
}
