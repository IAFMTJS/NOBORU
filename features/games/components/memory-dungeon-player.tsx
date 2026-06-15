"use client";

import { useCallback, useEffect, useState } from "react";

import { GlassPanel } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { GameCompleteCard } from "@/features/games/components/game-complete-card";
import type {
  GameCompleteViewModel,
  MemoryDungeonSessionViewModel,
} from "@/features/games/types/game.types";
import { MemoryDungeonDrill } from "@/features/learning/components/drills/memory-dungeon-drill";
import { offlineClient } from "@/features/offline/services/offline-client.service";

type MemoryDungeonPlayerProps = {
  session: MemoryDungeonSessionViewModel;
};

export function MemoryDungeonPlayer({ session }: MemoryDungeonPlayerProps) {
  const [started, setStarted] = useState(false);
  const [roomIndex, setRoomIndex] = useState(0);
  const [totalWrongAttempts, setTotalWrongAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCompleteAttempt, setLastCompleteAttempt] = useState<{
    correctCount: number;
    totalCount: number;
    wrongAttempts: number;
  } | null>(null);
  const [result, setResult] = useState<GameCompleteViewModel | null>(null);
  const [startedAt] = useState(() => Date.now());

  const currentRoom = session.rooms[roomIndex];

  useEffect(() => {
    void offlineClient.cacheGameSession(session.slug, session);
  }, [session]);

  const finishDungeon = useCallback(
    async (wrongAttempts: number) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      const attempt = {
        correctCount: session.totalPairs,
        totalCount: session.totalPairs,
        wrongAttempts,
      };
      setLastCompleteAttempt(attempt);

      try {
        const payload = await offlineClient.completeGame({
          slug: session.slug,
          correctCount: attempt.correctCount,
          totalCount: attempt.totalCount,
          wrongAttempts: attempt.wrongAttempts,
          durationMs: Date.now() - startedAt,
        });
        setResult(payload.result);
        void analyticsService.track({
          name: "game_completed",
          properties: {
            gameSlug: session.slug,
            accuracyPercent: payload.result.accuracyPercent,
            epAwarded: payload.result.epAwarded,
            roomCount: session.roomCount,
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
    [session.roomCount, session.slug, session.totalPairs, startedAt, submitting],
  );

  function handleStart() {
    setStarted(true);
    void analyticsService.track({
      name: "game_started",
      properties: {
        gameSlug: session.slug,
        roomCount: session.roomCount,
      },
    });
  }

  function handleRoomComplete(roomWrongAttempts: number) {
    const nextWrong = totalWrongAttempts + roomWrongAttempts;
    setTotalWrongAttempts(nextWrong);

    const nextRoomIndex = roomIndex + 1;
    if (nextRoomIndex >= session.rooms.length) {
      void finishDungeon(nextWrong);
      return;
    }

    setRoomIndex(nextRoomIndex);
  }

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
      subtitle="Flip cards and clear each dungeon room"
      backHref="/games"
      backLabel="Games"
    >
      {error ? (
        <GlassPanel className="space-y-3 border-destructive/30 bg-destructive/5 p-4">
          <p className="text-body-sm text-destructive" role="alert">
            {error}
          </p>
          {lastCompleteAttempt ? (
            <Button
              className="w-full"
              disabled={submitting}
              onClick={() => void finishDungeon(lastCompleteAttempt.wrongAttempts)}
            >
              {submitting ? "Saving…" : "Retry saving results"}
            </Button>
          ) : null}
        </GlassPanel>
      ) : null}

      {!started ? (
        <GlassPanel className="space-y-4 p-4">
          <p className="text-body-sm text-muted-foreground">
            Navigate {session.roomCount}{" "}
            {session.roomCount === 1 ? "room" : "rooms"} by matching hidden pairs from your
            learned trail content.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{session.totalPairs} pairs total</Badge>
            <Badge variant="outline">{session.roomCount} rooms</Badge>
            <Badge variant="outline">12–22 EP</Badge>
          </div>
          <Button className="w-full" onClick={handleStart}>
            Enter Dungeon
          </Button>
        </GlassPanel>
      ) : currentRoom ? (
        <MemoryDungeonDrill
          key={currentRoom.id}
          room={currentRoom}
          roomIndex={roomIndex}
          roomCount={session.rooms.length}
          onRoomComplete={handleRoomComplete}
        />
      ) : null}
    </StudyHubLayout>
  );
}
