"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
import { AudioPlayback } from "@/features/listening/components/audio-playback";
import type { ListeningExerciseDetailViewModel } from "@/features/listening/types/listening.types";

type ListeningExercisePlayerProps = {
  exercise: ListeningExerciseDetailViewModel;
  embedded?: boolean;
  onComplete?: (score: number) => void;
};

export function ListeningExercisePlayer({
  exercise,
  embedded = false,
  onComplete,
}: ListeningExercisePlayerProps) {
  const [phase, setPhase] = useState<"listen" | "quiz" | "done">(
    exercise.completed ? "done" : "listen",
  );
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedCorrect, setSelectedCorrect] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(exercise.score);

  useEffect(() => {
    if (exercise.completed || embedded) return;
    void fetch("/api/listening/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: "exercise",
        contentId: exercise.id,
        status: "in_progress",
        score: 0,
      }),
    });
  }, [embedded, exercise.completed, exercise.id]);

  async function saveProgress(finalScore: number) {
    if (embedded) {
      onComplete?.(finalScore);
      setPhase("done");
      setScore(finalScore);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/listening/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "exercise",
          contentId: exercise.id,
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

  const content = (
    <div className="space-y-4">
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {phase === "listen" ? (
        <>
          <Card className="shadow-elevation-1">
            <CardHeader>
              <CardDescription>Listen carefully before answering.</CardDescription>
              <CardTitle className="text-heading-5">{exercise.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AudioPlayback
                audioUrl={exercise.audioUrl}
                japaneseText={exercise.japaneseText}
              />
              {revealed ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-body">{exercise.japaneseText}</p>
                  {exercise.romaji ? (
                    <p className="text-body-sm text-muted-foreground">{exercise.romaji}</p>
                  ) : null}
                  {exercise.english ? (
                    <p className="text-body-sm text-muted-foreground">{exercise.english}</p>
                  ) : null}
                </div>
              ) : (
                <Button variant="ghost" className="w-full" onClick={() => setRevealed(true)}>
                  Show Transcript
                </Button>
              )}
            </CardContent>
          </Card>
          <Button className="w-full" onClick={() => setPhase("quiz")}>
            Answer Question
          </Button>
        </>
      ) : null}

      {phase === "quiz" ? (
        <>
          <Card className="shadow-elevation-1">
            <CardHeader>
              <CardDescription>Listening comprehension</CardDescription>
              <CardTitle className="text-heading-5">{exercise.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exercise.options.map((option, index) => (
                <Button
                  key={option}
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                  disabled={answered}
                  onClick={() => {
                    setAnswered(true);
                    setSelectedCorrect(index === exercise.correctOptionIndex);
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
            onClick={() => void saveProgress(selectedCorrect ? 100 : 0)}
          >
            Submit Answer
          </Button>
        </>
      ) : null}

      {phase === "done" ? (
        <Card className="border-success/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Exercise Complete</CardTitle>
            <CardDescription>Score {score}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!embedded ? (
              <>
                <Button className="w-full" asChild>
                  <Link href="/learn/listening">Back to Listening</Link>
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
        title={exercise.title}
        subtitle="Listen and answer"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/listening">Back</Link>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        {exercise.jlptLevel ? (
          <Badge variant="outline">{exercise.jlptLevel.toUpperCase()}</Badge>
        ) : null}
        {exercise.completed ? <Badge variant="secondary">Completed</Badge> : null}
      </div>
      {content}
    </PageContainer>
  );
}
