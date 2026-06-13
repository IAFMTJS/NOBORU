"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Clock,
  Compass,
  Globe,
  Languages,
  Mountain,
  Sparkles,
  Swords,
  Target,
  Tent,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

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
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import type { GameAvailabilityViewModel } from "@/features/games/types/game.types";

const DISCOVER_CATEGORIES = [
  { label: "Culture", href: "/explore" },
  { label: "History", href: "/explore" },
  { label: "Folklore", href: "/explore" },
  { label: "Food", href: "/explore" },
  { label: "Anime", href: "/explore" },
  { label: "Mythology", href: "/explore" },
] as const;

type ExploreScreenProps = {
  gameAvailability: GameAvailabilityViewModel;
  yama: YamaPresenceViewModel;
};

export function ExploreScreen({ gameAvailability, yama }: ExploreScreenProps) {
  const [joiningLeague, setJoiningLeague] = useState(false);

  const hasMiniGame =
    gameAvailability.wordMatch.available ||
    gameAvailability.vocabularyRush.available ||
    gameAvailability.kanjiHunter.available ||
    gameAvailability.memoryDungeon.available;

  async function joinLeague() {
    setJoiningLeague(true);
    try {
      await fetch("/api/leagues", { method: "POST" });
    } finally {
      setJoiningLeague(false);
    }
  }

  return (
    <PageContainer>
      <ScreenHeader
        title="Explore"
        subtitle="Discover Japan — trials, culture, and fellow climbers"
      />

      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardContent className="p-4">
          <YamaPresence
            presence={yama}
            size="md"
            layout="horizontal"
            bubbleClassName="border-primary/20 bg-card/80"
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Discover Japan</CardTitle>
          </div>
          <CardDescription>Culture, folklore, and lore along the climb.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {DISCOVER_CATEGORIES.map((cat) => (
            <Button key={cat.label} variant="outline" className="h-auto py-2" asChild>
              <Link href={cat.href}>
                <Compass className="mr-1 h-4 w-4" aria-hidden />
                {cat.label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>World Map</CardTitle>
          </div>
          <CardDescription>See the full mountain from foothills to celestial summit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" asChild>
            <Link href="/learn/world">Open world map</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/camp">
              <Tent className="mr-2 h-4 w-4" aria-hidden />
              Fox Camp
            </Link>
          </Button>
        </CardContent>
      </Card>

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
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" aria-hidden />
            <CardTitle>Mini-Games</CardTitle>
          </div>
          <CardDescription>
            {hasMiniGame
              ? "Quick sprints that reinforce what you have already learned."
              : "Complete your first lessons to unlock matching and rush drills."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {gameAvailability.wordMatch.available ? (
            <GameCard
              href="/games/word-match"
              title="Word Match"
              description="Match Japanese words to English meanings."
              gameSlug="word-match"
              badge={`${gameAvailability.wordMatch.poolSize} words`}
            />
          ) : null}
          {gameAvailability.vocabularyRush.available ? (
            <GameCard
              href="/games/vocabulary-rush"
              title="Vocabulary Rush"
              description="Fast recall under pressure — lives and timer included."
              gameSlug="vocabulary-rush"
              badge={`${gameAvailability.vocabularyRush.poolSize} words`}
            />
          ) : null}
          {gameAvailability.kanjiHunter.available ? (
            <GameCard
              href="/games/kanji-hunter"
              title="Kanji Hunter"
              description="Spot the right reading or meaning before time runs out."
              gameSlug="kanji-hunter"
              badge={`${gameAvailability.kanjiHunter.poolSize} kanji`}
            />
          ) : null}
          {gameAvailability.memoryDungeon.available ? (
            <GameCard
              href="/games/memory-dungeon"
              title="Memory Dungeon"
              description="Flip hidden pairs across dungeon rooms of vocabulary and kanji."
              gameSlug="memory-dungeon"
              badge={`${gameAvailability.memoryDungeon.roomCount} rooms`}
            />
          ) : null}
          <GameCard
            href="/games"
            title="Games Hub"
            description="Browse all available mini-games in one place."
            icon={<Mountain className="h-5 w-5" aria-hidden />}
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Study Trails</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
            <Link href="/learn">
              <Mountain className="h-4 w-4" aria-hidden />
              Learning Path
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
            <Link href="/review">
              <Target className="h-4 w-4" aria-hidden />
              Training Grounds
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
            <Link href="/progress">
              <Languages className="h-4 w-4" aria-hidden />
              Progress
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
            <Link href="/achievements">
              <Trophy className="h-4 w-4" aria-hidden />
              Achievements
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Community</CardTitle>
          </div>
          <CardDescription>Opt-in leagues and fellow climbers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            loading={joiningLeague}
            onClick={() => void joinLeague()}
          >
            Join weekly league
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/community">Friends & activity</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
            <CardTitle>Endgame</CardTitle>
          </div>
          <CardDescription>Post-N1 mastery mountains and seasonal events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/endgame">Mastery Mountains</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
