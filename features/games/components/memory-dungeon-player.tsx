"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
        const response = await fetch(`/api/games/${session.slug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...attempt,
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
        setResult(payload.data);
        void analyticsService.track({
          name: "game_completed",
          properties: {
            gameSlug: session.slug,
            accuracyPercent: payload.data.accuracyPercent,
            epAwarded: payload.data.epAwarded,
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
      <PageContainer>
        <ScreenHeader title={session.modeLabel} subtitle="Mini-game" />
        <GameCompleteCard
          result={result}
          title={`${session.modeLabel} Complete`}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={session.modeLabel}
        subtitle="Flip cards and clear each dungeon room"
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
                onClick={() => void finishDungeon(lastCompleteAttempt.wrongAttempts)}
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
              Navigate {session.roomCount}{" "}
              {session.roomCount === 1 ? "room" : "rooms"} by matching hidden
              pairs from your learned trail content.
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{session.totalPairs} pairs total</Badge>
              <Badge variant="outline">{session.roomCount} rooms</Badge>
              <Badge variant="outline">12–22 EP</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleStart}>
              Enter Dungeon
            </Button>
          </CardContent>
        </Card>
      ) : currentRoom ? (
        <MemoryDungeonDrill
          key={currentRoom.id}
          room={currentRoom}
          roomIndex={roomIndex}
          roomCount={session.rooms.length}
          onRoomComplete={handleRoomComplete}
        />
      ) : null}
    </PageContainer>
  );
}
