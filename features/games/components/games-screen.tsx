import Link from "next/link";

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
import type { GameAvailabilityViewModel } from "@/features/games/types/game.types";

type GamesScreenProps = {
  availability: GameAvailabilityViewModel;
};

export function GamesScreen({ availability }: GamesScreenProps) {
  const wordMatchLabel =
    availability.wordMatch.mode === "kana"
      ? "Kana Match"
      : availability.wordMatch.mode === "vocabulary"
        ? "Word Match"
        : "Word Match";

  return (
    <PageContainer>
      <ScreenHeader
        title="Games"
        subtitle="Educational challenges that reinforce mastery"
      />
      <Card className="border-primary/20 shadow-elevation-1">
        <CardHeader>
          <CardTitle>Trials</CardTitle>
          <CardDescription>
            Timed regional and N5 boss challenges using interactive recall drills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/trials">Open Trials</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Mini-Games</CardTitle>
          <CardDescription>
            Short sprints using vocabulary and kana you have already learned on the trail.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm font-medium">{wordMatchLabel}</p>
              {availability.wordMatch.available ? (
                <Badge variant="secondary">
                  {availability.wordMatch.poolSize} items ready
                </Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-caption text-muted-foreground">
              Match pairs in one focused round. Falls back to kana when vocabulary is still thin.
            </p>
            <Button
              className="w-full"
              disabled={!availability.wordMatch.available}
              asChild={availability.wordMatch.available}
            >
              {availability.wordMatch.available ? (
                <Link href="/games/word-match">Play {wordMatchLabel}</Link>
              ) : (
                <span>Complete more lessons to unlock</span>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm font-medium">Memory Dungeon</p>
              {availability.memoryDungeon.available ? (
                <Badge variant="secondary">
                  {availability.memoryDungeon.roomCount} rooms ·{" "}
                  {availability.memoryDungeon.poolSize} pairs
                </Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-caption text-muted-foreground">
              Flip hidden pairs across vocabulary and kanji rooms in a dungeon crawl.
            </p>
            <Button
              className="w-full"
              disabled={!availability.memoryDungeon.available}
              asChild={availability.memoryDungeon.available}
            >
              {availability.memoryDungeon.available ? (
                <Link href="/games/memory-dungeon">Play Memory Dungeon</Link>
              ) : (
                <span>Learn more on the trail to unlock</span>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm font-medium">Kanji Hunter</p>
              {availability.kanjiHunter.available ? (
                <Badge variant="secondary">
                  {availability.kanjiHunter.poolSize} kanji ready
                </Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-caption text-muted-foreground">
              Timed kanji meaning recall with three lives.
            </p>
            <Button
              className="w-full"
              disabled={!availability.kanjiHunter.available}
              asChild={availability.kanjiHunter.available}
            >
              {availability.kanjiHunter.available ? (
                <Link href="/games/kanji-hunter">Play Kanji Hunter</Link>
              ) : (
                <span>Learn more kanji on the trail</span>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm font-medium">Weak Vocabulary Rush</p>
              <Badge variant="outline">Weak areas</Badge>
            </div>
            <p className="text-caption text-muted-foreground">
              Sprint through vocabulary you are still strengthening in review.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/games/vocabulary-rush?weakOnly=true">
                Play Weak Sprint
              </Link>
            </Button>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm font-medium">Vocabulary Rush</p>
              {availability.vocabularyRush.available ? (
                <Badge variant="secondary">
                  {availability.vocabularyRush.poolSize} words ready
                </Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-caption text-muted-foreground">
              Ten timed recall questions with three lives. Speed increases as your streak grows.
            </p>
            <Button
              className="w-full"
              disabled={!availability.vocabularyRush.available}
              asChild={availability.vocabularyRush.available}
            >
              {availability.vocabularyRush.available ? (
                <Link href="/games/vocabulary-rush">Play Vocabulary Rush</Link>
              ) : (
                <span>Learn more vocabulary on the trail</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
