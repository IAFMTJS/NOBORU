"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { DrillFeedbackBanner } from "@/features/learning/components/drills/drill-feedback-banner";
import type { MemoryDungeonRoom } from "@/features/games/types/game.types";

type MemoryCard = {
  id: string;
  pairId: string;
  label: string;
};

type MemoryDungeonDrillProps = {
  room: MemoryDungeonRoom;
  roomIndex: number;
  roomCount: number;
  onRoomComplete: (wrongAttempts: number) => void;
};

function buildDeck(room: MemoryDungeonRoom): MemoryCard[] {
  const cards: MemoryCard[] = [];
  for (const pair of room.pairs) {
    cards.push(
      { id: `${pair.pairId}-a`, pairId: pair.pairId, label: pair.faceA },
      { id: `${pair.pairId}-b`, pairId: pair.pairId, label: pair.faceB },
    );
  }

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return cards;
}

export function MemoryDungeonDrill({
  room,
  roomIndex,
  roomCount,
  onRoomComplete,
}: MemoryDungeonDrillProps) {
  const deck = useMemo(() => buildDeck(room), [room]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [locked, setLocked] = useState(false);

  const matchedCount = matchedPairIds.length;
  const progressPercent = Math.round((matchedCount / room.pairs.length) * 100);

  function finishIfComplete(nextMatched: string[]) {
    if (nextMatched.length === room.pairs.length) {
      setResult("correct");
      window.setTimeout(() => onRoomComplete(wrongAttempts), 600);
    }
  }

  function handleCardClick(card: MemoryCard) {
    if (locked || matchedPairIds.includes(card.pairId)) return;
    if (revealedIds.includes(card.id)) return;

    if (!selectedId) {
      setSelectedId(card.id);
      setRevealedIds([card.id]);
      return;
    }

    if (selectedId === card.id) {
      setSelectedId(null);
      setRevealedIds([]);
      return;
    }

    const firstCard = deck.find((entry) => entry.id === selectedId);
    if (!firstCard) return;

    const nextRevealed = [selectedId, card.id];
    setRevealedIds(nextRevealed);
    setLocked(true);

    if (firstCard.pairId === card.pairId) {
      const nextMatched = [...matchedPairIds, card.pairId];
      setMatchedPairIds(nextMatched);
      setSelectedId(null);
      setLocked(false);
      setRevealedIds([]);
      finishIfComplete(nextMatched);
      return;
    }

    setWrongAttempts((current) => current + 1);
    setResult("incorrect");
    window.setTimeout(() => {
      setResult(null);
      setSelectedId(null);
      setRevealedIds([]);
      setLocked(false);
    }, 900);
  }

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Room {roomIndex + 1} of {roomCount} · {room.title}
        </CardDescription>
        <CardTitle className="text-heading-5">{room.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar value={progressPercent} label="Room progress" showValue />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {deck.map((card) => {
            const isMatched = matchedPairIds.includes(card.pairId);
            const isRevealed = revealedIds.includes(card.id) || isMatched;

            return (
              <Button
                key={card.id}
                type="button"
                variant="outline"
                className={cn(
                  "h-20 whitespace-normal px-2 py-2 text-center text-body-sm leading-snug",
                  isMatched && "border-success/50 bg-success/10 text-success",
                  isRevealed && !isMatched && "border-primary bg-primary/10",
                  !isRevealed && "bg-muted/40 text-muted-foreground",
                )}
                disabled={locked || isMatched || result === "correct"}
                onClick={() => handleCardClick(card)}
                aria-pressed={isRevealed}
              >
                {isRevealed || isMatched ? card.label : "?"}
              </Button>
            );
          })}
        </div>
        <DrillFeedbackBanner
          result={result}
          message={
            result === "correct"
              ? "Room cleared!"
              : result === "incorrect"
                ? "Those cards do not match."
                : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
