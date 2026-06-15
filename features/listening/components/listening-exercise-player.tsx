"use client";

import Link from "next/link";
import { useState } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { StoryTitle } from "@/components/visual";
import { AudioPlayback } from "@/features/listening/components/audio-playback";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LessonShell } from "@/features/learning/components/lesson/lesson-shell";
import type { ListeningExerciseDetailViewModel } from "@/features/listening/types/listening.types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useMountOnceEffect } from "@/lib/hooks/use-mount-once-effect";

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

  useMountOnceEffect(() => {
    void offlineClient.saveListeningProgress({
      contentType: "exercise",
      contentId: exercise.id,
      status: "in_progress",
      score: 0,
    });
  }, !exercise.completed && !embedded);

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
      const result = await offlineClient.saveListeningProgress({
        contentType: "exercise",
        contentId: exercise.id,
        status: "completed",
        score: finalScore,
      });
      if (!result.saved) {
        throw new Error("Unable to save progress.");
      }
      setScore(result.score);
      setPhase("done");
      onComplete?.(finalScore);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function renderPhase() {
    if (phase === "listen") {
      return (
        <LessonDrillLayout
          prompt={`Listening post · ${exercise.title}`}
          hero={
            <div className="flex flex-col items-center gap-4">
              <p className="font-story text-sm text-trail-glow">Sound carries on the mountain wind</p>
              <div className="scale-125">
                <AudioPlayback
                  audioUrl={exercise.audioUrl}
                  japaneseText={exercise.japaneseText}
                />
              </div>
              {revealed ? (
                <div className="space-y-1 text-body-sm text-muted-foreground">
                  <p>{exercise.japaneseText}</p>
                  {exercise.romaji ? <p>{exercise.romaji}</p> : null}
                </div>
              ) : (
                <button
                  type="button"
                  className="text-caption text-trail-glow underline-offset-2 hover:underline"
                  onClick={() => setRevealed(true)}
                >
                  Show transcript
                </button>
              )}
            </div>
          }
          footer={
            <PrimaryClimbButton className="w-full" onClick={() => setPhase("quiz")}>
              Answer question
            </PrimaryClimbButton>
          }
        />
      );
    }

    if (phase === "quiz") {
      return (
        <LessonDrillLayout
          prompt="Listening comprehension"
          hero={
            <p className="font-story text-xl font-semibold text-heading-story">{exercise.question}</p>
          }
          footer={
            <>
              <TrailAnswerPad
                options={exercise.options.map((option, index) => ({
                  id: option,
                  label: option,
                  state:
                    answered && index === exercise.correctOptionIndex
                      ? "correct"
                      : answered
                        ? "disabled"
                        : "default",
                  onSelect: answered
                    ? undefined
                    : () => {
                        setAnswered(true);
                        setSelectedCorrect(index === exercise.correctOptionIndex);
                      },
                }))}
              />
              <PrimaryClimbButton
                className="mt-3 w-full"
                disabled={!answered || saving}
                onClick={() => void saveProgress(selectedCorrect ? 100 : 0)}
              >
                Submit answer
              </PrimaryClimbButton>
            </>
          }
        />
      );
    }

    if (phase === "done") {
      return (
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-success/30 bg-black/45 p-5 text-center">
          <StoryTitle as="h2" className="text-lg">
            Listening complete
          </StoryTitle>
          <p className="text-caption text-muted-foreground">Score {score}%</p>
          {!embedded ? (
            <div className="space-y-2">
              <PrimaryClimbButton asChild className="w-full">
                <Link href="/learn/listening">Return to listening trail</Link>
              </PrimaryClimbButton>
            </div>
          ) : null}
        </div>
      );
    }

    return null;
  }

  const body = (
    <>
      {error ? <p className="mb-3 text-caption text-destructive">{error}</p> : null}
      {renderPhase()}
    </>
  );

  if (embedded) {
    return body;
  }

  return (
    <LessonShell
      scene="study_atmosphere"
      header={
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center gap-2 border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
          <Link
            href="/study"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/75 hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Study
          </Link>
          <StoryTitle as="h1" className="truncate text-sm">
            {exercise.title}
          </StoryTitle>
        </div>
      }
    >
      {body}
    </LessonShell>
  );
}
