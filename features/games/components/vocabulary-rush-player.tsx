"use client";

import { useCallback, useEffect, useState } from "react";

import { GlassPanel } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { GameCompleteCard } from "@/features/games/components/game-complete-card";
import type {
  GameCompleteViewModel,
  VocabularyRushSessionViewModel,
} from "@/features/games/types/game.types";
import { rushTimerForStreak } from "@/features/games/services/vocabulary-rush.service";
import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { TrialTimer } from "@/features/trials/components/trial-timer";

type VocabularyRushPlayerProps = {
  session: VocabularyRushSessionViewModel;
};

export function VocabularyRushPlayer({ session }: VocabularyRushPlayerProps) {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(session.lives);
  const [streak, setStreak] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(session.timerStartSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFinalCorrect, setLastFinalCorrect] = useState<number | null>(null);
  const [result, setResult] = useState<GameCompleteViewModel | null>(null);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    void offlineClient.cacheGameSession(session.slug, session);
  }, [session]);

  const currentQuestion = session.questions[questionIndex];
  const progressPercent = Math.round(
    ((questionIndex + (finished ? 1 : 0)) / session.questionCount) * 100,
  );

  const finishGame = useCallback(
    async (finalCorrect: number) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);
      setTimerRunning(false);

      try {
        const payload = await offlineClient.completeGame({
          slug: session.slug,
          correctCount: finalCorrect,
          totalCount: session.questionCount,
          durationMs: Date.now() - startedAt,
        });
        setFinished(true);
        setResult(payload.result);
        void analyticsService.track({
          name: "game_completed",
          properties: {
            gameSlug: session.slug,
            accuracyPercent: payload.result.accuracyPercent,
            epAwarded: payload.result.epAwarded,
          },
        });
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : "Failed to save game results.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [session.questionCount, session.slug, startedAt, submitting],
  );

  const advanceOrFinish = useCallback(
    (wasCorrect: boolean, nextCorrect: number, nextLives: number) => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= session.questionCount || nextLives <= 0) {
        setLastFinalCorrect(nextCorrect);
        void finishGame(nextCorrect);
        return;
      }
      setQuestionIndex(nextIndex);
      setStreak((current) => {
        const nextStreak = wasCorrect ? current + 1 : 0;
        setTimerSeconds(rushTimerForStreak(nextStreak));
        return nextStreak;
      });
      setTimeExpired(false);
      setTimerRunning(true);
    },
    [finishGame, questionIndex, session.questionCount],
  );

  const handleExpired = useCallback(() => {
    if (finished) return;
    setTimeExpired(true);
    setTimerRunning(false);
    const nextLives = lives - 1;
    setLives(nextLives);
    advanceOrFinish(false, correctCount, nextLives);
  }, [advanceOrFinish, correctCount, finished, lives]);

  useEffect(() => {
    if (started && !finished && currentQuestion) {
      setTimerRunning(true);
    }
  }, [currentQuestion, finished, started]);

  function handleStart() {
    setStarted(true);
    setTimerRunning(true);
    void analyticsService.track({
      name: "game_started",
      properties: {
        gameSlug: session.slug,
        mode: "vocabulary",
      },
    });
  }

  function handleAnswer(correct: boolean) {
    if (finished || submitting) return;
    setTimerRunning(false);
    const nextCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(nextCorrect);

    if (!correct) {
      const nextLives = lives - 1;
      setLives(nextLives);
      advanceOrFinish(false, nextCorrect, nextLives);
      return;
    }

    advanceOrFinish(true, nextCorrect, lives);
  }

  const headerAction =
    started && !finished && !result ? (
      <TrialTimer
        timeLimitSeconds={timerSeconds}
        running={timerRunning}
        onExpired={handleExpired}
      />
    ) : null;

  if (result) {
    return (
      <StudyHubLayout
        scene="study_atmosphere"
        title={session.modeLabel}
        subtitle="Mini-game"
        backHref="/games"
        backLabel="Games"
      >
        <GameCompleteCard result={result} title={`${session.modeLabel} Complete`} />
      </StudyHubLayout>
    );
  }

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={session.modeLabel}
      subtitle={
        session.modeLabel === "Vocabulary Rush"
          ? "Fast recall from your learned vocabulary"
          : "Fast kana recall from your learned characters"
      }
      backHref="/games"
      backLabel="Games"
      action={headerAction}
    >
      {error ? (
        <GlassPanel className="space-y-3 border-destructive/30 bg-destructive/5 p-4">
          <p className="text-body-sm text-destructive" role="alert">
            {error}
          </p>
          {lastFinalCorrect !== null ? (
            <Button
              className="w-full"
              disabled={submitting}
              onClick={() => void finishGame(lastFinalCorrect)}
            >
              {submitting ? "Saving…" : "Retry saving results"}
            </Button>
          ) : null}
        </GlassPanel>
      ) : null}

      {!started ? (
        <GlassPanel className="space-y-4 p-4">
          <p className="text-body-sm text-muted-foreground">
            Answer {session.questionCount} vocabulary prompts before you run out of lives.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{session.lives} lives</Badge>
            <Badge variant="outline">Timer speeds up on streaks</Badge>
            <Badge variant="outline">10–25 EP</Badge>
          </div>
          <Button className="w-full" onClick={handleStart}>
            Start Rush
          </Button>
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ProgressBar value={progressPercent} label="Rush progress" showValue />
            <div className="flex gap-2">
              <Badge variant="outline">
                {lives} {lives === 1 ? "life" : "lives"} left
              </Badge>
              {streak > 1 ? (
                <Badge variant="secondary">{streak} streak</Badge>
              ) : null}
            </div>
          </div>
          {timeExpired ? (
            <p className="text-body-sm text-warning-foreground" role="status">
              Time&apos;s up — moving to the next question.
            </p>
          ) : null}
          {currentQuestion ? (
            <ChoiceRecallDrill
              key={questionIndex}
              step={currentQuestion}
              onAnswer={handleAnswer}
            />
          ) : null}
        </div>
      )}
    </StudyHubLayout>
  );
}
