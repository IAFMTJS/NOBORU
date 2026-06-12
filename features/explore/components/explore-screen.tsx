import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  Clock,
  Languages,
  Mountain,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { GameArtImage } from "@/components/media/game-art-image";
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
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import type { GameAvailabilityViewModel } from "@/features/games/types/game.types";

type ExploreScreenProps = {
  gameAvailability: GameAvailabilityViewModel;
  yama: YamaPresenceViewModel;
};

type GameCardProps = {
  href: string;
  title: string;
  description: string;
  gameSlug?: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
};

function GameCardArt({
  gameSlug,
  icon,
  title,
}: {
  gameSlug?: string;
  icon?: ReactNode;
  title: string;
}) {
  if (gameSlug) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60">
        <GameArtImage slug={gameSlug} alt={title} className="h-full w-full object-cover" sizes="56px" />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
  );
}

function GameCard({ href, title, description, gameSlug, icon, badge, disabled }: GameCardProps) {
  if (disabled) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 opacity-80">
        <GameCardArt gameSlug={gameSlug} icon={icon} title={title} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-body-sm font-medium">{title}</p>
            <Badge variant="outline" className="text-[10px]">
              Soon
            </Badge>
          </div>
          <p className="text-caption text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-elevation-1 transition-colors hover:border-primary/30 hover:bg-primary/5"
    >
      <GameCardArt gameSlug={gameSlug} icon={icon} title={title} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-medium">{title}</p>
          {badge ? (
            <Badge variant="secondary" className="text-[10px]">
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export function ExploreScreen({ gameAvailability, yama }: ExploreScreenProps) {
  const hasMiniGame =
    gameAvailability.wordMatch.available ||
    gameAvailability.vocabularyRush.available ||
    gameAvailability.kanjiHunter.available ||
    gameAvailability.memoryDungeon.available;

  return (
    <PageContainer>
      <ScreenHeader
        title="Explore"
        subtitle="Trials, challenges, and fellow climbers"
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
          {gameAvailability.vocabularyRush.available ? (
            <GameCard
              href="/games/vocabulary-rush?weakOnly=true"
              title="Weak Vocabulary Sprint"
              description="Focus on words that need more practice."
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
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
            <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            More challenges are being carved into the mountain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <GameCard
            href="#"
            title="Reading Challenge"
            description="Timed comprehension sprints through graded passages."
            gameSlug="reading-challenge"
            disabled
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Study Trails</CardTitle>
          </div>
          <CardDescription>
            Browse content libraries and track your climb.
          </CardDescription>
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
              Review
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
