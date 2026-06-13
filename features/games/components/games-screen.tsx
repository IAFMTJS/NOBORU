import Link from "next/link";
import { Mountain, Sparkles, Swords } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GameCard } from "@/features/games/components/game-card";
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

  const hasMiniGame =
    availability.wordMatch.available ||
    availability.vocabularyRush.available ||
    availability.kanjiHunter.available ||
    availability.memoryDungeon.available;

  return (
    <PageContainer>
      <ScreenHeader
        title="Games"
        subtitle="Educational challenges that reinforce mastery"
      />

      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Trials</CardTitle>
          </div>
          <CardDescription>
            Timed regional challenges and boss proving grounds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/trials">Enter Trials</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Mini-Games</CardTitle>
          <CardDescription>
            {hasMiniGame
              ? "Quick sprints that reinforce what you have already learned."
              : "Complete your first lessons to unlock matching and rush drills."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {availability.wordMatch.available ? (
            <GameCard
              href="/games/word-match"
              title={wordMatchLabel}
              description="Match pairs in one focused round. Falls back to kana when vocabulary is still thin."
              gameSlug="word-match"
              badge={`${availability.wordMatch.poolSize} items`}
            />
          ) : (
            <GameCard
              href="#"
              title={wordMatchLabel}
              description="Complete more lessons to unlock matching drills."
              gameSlug="word-match"
              disabled
            />
          )}

          {availability.vocabularyRush.available ? (
            <GameCard
              href="/games/vocabulary-rush"
              title="Vocabulary Rush"
              description="Ten timed recall questions with three lives."
              gameSlug="vocabulary-rush"
              badge={`${availability.vocabularyRush.poolSize} words`}
            />
          ) : (
            <GameCard
              href="#"
              title="Vocabulary Rush"
              description="Learn more vocabulary on the trail to unlock."
              gameSlug="vocabulary-rush"
              disabled
            />
          )}

          {availability.kanjiHunter.available ? (
            <GameCard
              href="/games/kanji-hunter"
              title="Kanji Hunter"
              description="Timed kanji meaning recall with three lives."
              gameSlug="kanji-hunter"
              badge={`${availability.kanjiHunter.poolSize} kanji`}
            />
          ) : (
            <GameCard
              href="#"
              title="Kanji Hunter"
              description="Learn more kanji on the trail to unlock."
              gameSlug="kanji-hunter"
              disabled
            />
          )}

          {availability.memoryDungeon.available ? (
            <GameCard
              href="/games/memory-dungeon"
              title="Memory Dungeon"
              description="Flip hidden pairs across vocabulary and kanji rooms."
              gameSlug="memory-dungeon"
              badge={`${availability.memoryDungeon.roomCount} rooms`}
            />
          ) : (
            <GameCard
              href="#"
              title="Memory Dungeon"
              description="Learn more on the trail to unlock the dungeon."
              gameSlug="memory-dungeon"
              disabled
            />
          )}

          {availability.vocabularyRush.available ? (
            <GameCard
              href="/games/vocabulary-rush?weakOnly=true"
              title="Weak Vocabulary Sprint"
              description="Focus on words that need more practice."
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
            />
          ) : null}

          <GameCard
            href="/explore"
            title="Explore Hub"
            description="Return to the full Explore hub for trials and study trails."
            icon={<Mountain className="h-5 w-5" aria-hidden />}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
