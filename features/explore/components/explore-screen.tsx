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

type ExploreScreenProps = {
  gameAvailability: GameAvailabilityViewModel;
};

export function ExploreScreen({ gameAvailability }: ExploreScreenProps) {
  const hasMiniGame =
    gameAvailability.wordMatch.available ||
    gameAvailability.vocabularyRush.available ||
    gameAvailability.kanjiHunter.available;

  return (
    <PageContainer>
      <ScreenHeader
        title="Explore"
        subtitle="Trials, challenges, and fellow climbers"
      />

      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardHeader>
          <CardTitle>Trials</CardTitle>
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
          {hasMiniGame ? (
            <>
              {gameAvailability.wordMatch.available ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/games/word-match">
                    Word Match
                    <Badge variant="secondary" className="ml-2">
                      {gameAvailability.wordMatch.poolSize}
                    </Badge>
                  </Link>
                </Button>
              ) : null}
              {gameAvailability.vocabularyRush.available ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/games/vocabulary-rush">
                    Vocabulary Rush
                    <Badge variant="secondary" className="ml-2">
                      {gameAvailability.vocabularyRush.poolSize}
                    </Badge>
                  </Link>
                </Button>
              ) : null}
              {gameAvailability.kanjiHunter.available ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/games/kanji-hunter">
                    Kanji Hunter
                    <Badge variant="secondary" className="ml-2">
                      {gameAvailability.kanjiHunter.poolSize}
                    </Badge>
                  </Link>
                </Button>
              ) : null}
              {gameAvailability.vocabularyRush.available ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/games/vocabulary-rush?weakOnly=true">
                    Weak Vocabulary Sprint
                  </Link>
                </Button>
              ) : null}
            </>
          ) : null}
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/games">Open Games Hub</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>
            Leagues and social features are still climbing toward launch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/community">Community Preview</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/feedback">Share beta feedback</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
