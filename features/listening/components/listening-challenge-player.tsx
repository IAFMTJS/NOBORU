"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AudioPlayback } from "@/features/listening/components/audio-playback";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type { ListeningChallengeDetailViewModel } from "@/features/listening/types/listening.types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useMountOnceEffect } from "@/lib/hooks/use-mount-once-effect";

type ListeningChallengePlayerProps = {
  challenge: ListeningChallengeDetailViewModel;
  embedded?: boolean;
  onComplete?: (score: number) => void;
};

export function ListeningChallengePlayer({
  challenge,
  embedded = false,
  onComplete,
}: ListeningChallengePlayerProps) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<"listen" | "quiz">("listen");
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(challenge.completed);
  const [score, setScore] = useState(challenge.score);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentExercise = challenge.exercises[exerciseIndex];
  const progressPercent =
    challenge.exercises.length === 0
      ? 100
      : Math.round(((exerciseIndex + (phase === "quiz" ? 0.5 : 0)) / challenge.exercises.length) * 100);

  useMountOnceEffect(() => {
    void offlineClient.saveListeningProgress({
      contentType: "challenge",
      contentId: challenge.id,
      status: "in_progress",
      score: 0,
    });
  }, !challenge.completed && !embedded);

  useEffect(() => {
    setPhase("listen");
    setRevealed(false);
    setAnswered(false);
  }, [exerciseIndex]);

  async function saveProgress(finalScore: number) {
    if (embedded) {
      onComplete?.(finalScore);
      setFinished(true);
      setScore(finalScore);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await offlineClient.saveListeningProgress({
        contentType: "challenge",
        contentId: challenge.id,
        status: "completed",
        score: finalScore,
      });
      if (!result.saved) {
        throw new Error("Unable to save progress.");
      }
      setScore(result.score);
      setFinished(true);
      onComplete?.(finalScore);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function handleAnswer(index: number) {
    if (!currentExercise) return;
    setAnswered(true);
    if (index === currentExercise.correctOptionIndex) {
      setCorrectCount((current) => current + 1);
    }
  }

  function handleContinue() {
    if (!currentExercise || !answered) return;

    if (exerciseIndex + 1 >= challenge.exercises.length) {
      void saveProgress(
        challenge.exercises.length === 0
          ? 100
          : Math.round((correctCount / challenge.exercises.length) * 100),
      );
      return;
    }

    setExerciseIndex((current) => current + 1);
  }

  const content = (
    <div className="space-y-4">
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {challenge.exercises.length === 0 ? (
        <YamaEmptyState
          surface="trail"
          title="Challenge route not yet revealed"
          description="This listening path will open as exercises are added to the pavilion."
          actionHref="/learn/listening"
          actionLabel="Return to listening pavilion"
        />
      ) : null}

      {!finished && currentExercise ? (
        <>
          <ProgressBar value={progressPercent} label="Challenge progress" showValue />

          {phase === "listen" ? (
            <>
              <GlassPanel className="space-y-4 p-4 shadow-elevation-1">
                <p className="text-caption text-muted-foreground">
                  Part {exerciseIndex + 1} of {challenge.exercises.length}
                </p>
                <p className="text-heading-5 font-medium">{currentExercise.title}</p>
                <AudioPlayback
                  audioUrl={currentExercise.audioUrl}
                  japaneseText={currentExercise.japaneseText}
                />
                {revealed ? (
                  <p className="text-body-sm text-muted-foreground">
                    {currentExercise.japaneseText}
                  </p>
                ) : (
                  <Button variant="ghost" className="w-full" onClick={() => setRevealed(true)}>
                    Show Transcript
                  </Button>
                )}
              </GlassPanel>
              <Button className="w-full" onClick={() => setPhase("quiz")}>
                Answer Question
              </Button>
            </>
          ) : null}

          {phase === "quiz" ? (
            <>
              <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
                <p className="text-caption text-muted-foreground">{currentExercise.title}</p>
                <p className="text-heading-5 font-medium">{currentExercise.question}</p>
                {currentExercise.options.map((option, index) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                    disabled={answered}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </GlassPanel>
              <Button
                className="w-full"
                disabled={!answered || saving}
                loading={saving}
                onClick={handleContinue}
              >
                {exerciseIndex + 1 >= challenge.exercises.length ? "Finish Challenge" : "Continue"}
              </Button>
            </>
          ) : null}
        </>
      ) : null}

      {finished ? (
        <GlassPanel className="space-y-3 border-success/30 p-4 shadow-elevation-1">
          <p className="font-story text-story-title">Challenge Complete</p>
          <p className="text-caption text-muted-foreground">Score {score}%</p>
          <Button className="w-full" asChild>
            <Link href="/learn/listening">Back to Listening</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/learn/mount-n5">Back to Mount N5</Link>
          </Button>
        </GlassPanel>
      ) : null}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={challenge.title}
      subtitle={challenge.description ?? "Multi-part listening challenge"}
      backHref="/study"
      backLabel="Back to Study"
    >
      <div className="flex flex-wrap items-center gap-2">
        {challenge.jlptLevel ? (
          <Badge variant="outline">{challenge.jlptLevel.toUpperCase()}</Badge>
        ) : null}
        <Badge variant="outline">{challenge.exercises.length} parts</Badge>
        {challenge.completed ? <Badge variant="secondary">Completed</Badge> : null}
      </div>
      {content}
    </StudyHubLayout>
  );
}
