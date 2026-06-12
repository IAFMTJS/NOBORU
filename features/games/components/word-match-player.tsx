"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { offlineClient } from "@/features/offline/services/offline-client.service";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { GameCompleteCard } from "@/features/games/components/game-complete-card";
import type {
  GameCompleteViewModel,
  WordMatchSessionViewModel,
} from "@/features/games/types/game.types";
import { MatchingDrill } from "@/features/learning/components/drills/matching-drill";

type WordMatchPlayerProps = {
  session: WordMatchSessionViewModel;
};

export function WordMatchPlayer({ session }: WordMatchPlayerProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCompleteAttempt, setLastCompleteAttempt] = useState<{
    correctCount: number;
    wrongAttempts: number;
  } | null>(null);
  const [result, setResult] = useState<GameCompleteViewModel | null>(null);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    void offlineClient.cacheGameSession(session.slug, session);
  }, [session]);

  const finishGame = useCallback(
    async (correctCount: number, wrongAttempts: number) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/games/${session.slug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correctCount,
            totalCount: session.step.pairs.length,
            wrongAttempts,
            durationMs: Date.now() - startedAt,
          }),
        });
        const payload = (await response.json()) as {
          success: boolean;
          data?: GameCompleteViewModel;
          error?: string;
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Failed to save game results.");
        }
        setFinished(true);
        setResult(payload.data);
        void analyticsService.track({
          name: "game_completed",
          properties: {
            gameSlug: session.slug,
            mode: session.mode,
            accuracyPercent: payload.data.accuracyPercent,
            epAwarded: payload.data.epAwarded,
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
    [session.mode, session.slug, session.step.pairs.length, startedAt, submitting],
  );

  function handleStart() {
    setStarted(true);
    void analyticsService.track({
      name: "game_started",
      properties: {
        gameSlug: session.slug,
        mode: session.mode,
      },
    });
  }

  function handleAnswer(_correct: boolean, wrongAttempts = 0) {
    const attempt = {
      correctCount: session.step.pairs.length,
      wrongAttempts,
    };
    setLastCompleteAttempt(attempt);
    void finishGame(attempt.correctCount, attempt.wrongAttempts);
  }

  if (result) {
    return (
      <PageContainer>
        <ScreenHeader title={session.modeLabel} subtitle="Mini-game" />
        <GameCompleteCard result={result} title={`${session.modeLabel} Complete`} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={session.modeLabel}
        subtitle="Match pairs from your learned trail content"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/games">Exit</Link>
          </Button>
        }
      />

      {error ? (
        <Card className="border-destructive/30 bg-destructive/5 shadow-elevation-1">
          <CardContent className="space-y-3 p-4">
            <p className="text-body-sm text-destructive" role="alert">
              {error}
            </p>
            {lastCompleteAttempt ? (
              <Button
                className="w-full"
                disabled={submitting}
                onClick={() =>
                  void finishGame(
                    lastCompleteAttempt.correctCount,
                    lastCompleteAttempt.wrongAttempts,
                  )
                }
              >
                {submitting ? "Saving…" : "Retry saving results"}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {!started ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardDescription>
              {session.mode === "vocabulary"
                ? "Match Japanese words to English meanings."
                : "Match kana characters to romaji readings."}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{session.step.pairs.length} pairs</Badge>
              <Badge variant="outline">10–20 EP</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleStart}>
              Start Match
            </Button>
          </CardContent>
        </Card>
      ) : (
        <MatchingDrill step={session.step} onAnswer={handleAnswer} />
      )}
    </PageContainer>
  );
}
