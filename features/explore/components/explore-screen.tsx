"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { GameCard } from "@/features/games/components/game-card";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import type { GameAvailabilityViewModel } from "@/features/games/types/game.types";
import { getWorldIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

const DISCOVER_CATEGORIES = [
  { label: "Culture", glyph: "雅", iconSlug: "discover" },
  { label: "History", glyph: "史", iconSlug: "discover" },
  { label: "Folklore", glyph: "話", iconSlug: "discover" },
  { label: "Food", glyph: "食", iconSlug: "discover" },
  { label: "Anime", glyph: "映", iconSlug: "discover" },
  { label: "Mythology", glyph: "神", iconSlug: "discover" },
] as const;

const STUDY_TRAILS = [
  { label: "Journey", href: "/learn", glyph: "登", iconSlug: "trails" },
  { label: "Dojo", href: "/dojo", glyph: "道", iconSlug: "trails" },
  { label: "Progress", href: "/progress", glyph: "進", iconSlug: "trails" },
  { label: "Achievements", href: "/achievements", glyph: "誉", iconSlug: "trails" },
] as const;

type ExploreScreenProps = {
  gameAvailability: GameAvailabilityViewModel;
  yama: YamaPresenceViewModel;
};

function DiscoverCategoryTile({
  label,
  glyph,
  iconSlug,
}: {
  label: string;
  glyph: string;
  iconSlug: string;
}) {
  const src = getWorldIconPath(iconSlug);
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-glass-border bg-glass-bg/50 px-3 py-4 text-center opacity-75">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border bg-primary/10">
        {src ? (
          <Image src={src} alt="" width={28} height={28} aria-hidden className="object-contain" />
        ) : (
          <span className="font-japanese text-lg text-primary" aria-hidden>
            {glyph}
          </span>
        )}
      </span>
      <span className="text-body-sm font-medium">{label}</span>
      <span className="text-caption text-muted-foreground">Coming soon</span>
    </div>
  );
}

function WorldSectionGlyph({
  iconSlug,
  glyph,
}: {
  iconSlug?: string;
  glyph: string;
}) {
  const src = iconSlug ? getWorldIconPath(iconSlug) : null;
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={22}
        height={22}
        aria-hidden
        className="shrink-0 object-contain"
      />
    );
  }
  return (
    <span className="font-japanese text-base text-primary" aria-hidden>
      {glyph}
    </span>
  );
}

function WorldSection({
  glyph,
  iconSlug,
  title,
  description,
  children,
  className,
}: {
  glyph: string;
  iconSlug?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlassPanel className={cn("space-y-3 p-4", className)}>
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-primary/10"
          aria-hidden
        >
          <WorldSectionGlyph iconSlug={iconSlug} glyph={glyph} />
        </span>
        <div className="min-w-0 space-y-0.5">
          <StoryTitle as="h3" className="text-sm">
            {title}
          </StoryTitle>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </GlassPanel>
  );
}

export function ExploreScreen({
  gameAvailability,
  yama,
}: ExploreScreenProps) {
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
    <IllustratedScreen
      scrim="none"
      background={
        <SceneImage
          scene="world_map_peaks"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer>
        <ScreenHeader
          variant="story"
          title="World"
          subtitle="Discover Japan — regions, lore, trials, and fellow climbers"
        />

        <GlassPanel className="p-4">
          <YamaPresence
            presence={yama}
            size="md"
            layout="horizontal"
            bubbleClassName="border-glass-border bg-glass-bg/80"
          />
        </GlassPanel>

        <WorldSection
          glyph="探"
          iconSlug="discover"
          title="Discover Japan"
          description="Culture, folklore, and lore along the climb."
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DISCOVER_CATEGORIES.map((cat) => (
              <DiscoverCategoryTile
                key={cat.label}
                label={cat.label}
                glyph={cat.glyph}
                iconSlug={cat.iconSlug}
              />
            ))}
          </div>
        </WorldSection>

        <WorldSection
          glyph="峰"
          iconSlug="world_map"
          title="World Map"
          description="See the full mountain from foothills to celestial summit."
        >
          <PrimaryClimbButton asChild>
            <Link href="/learn/world">Open World Map</Link>
          </PrimaryClimbButton>
        </WorldSection>

        <WorldSection
          glyph="試"
          iconSlug="trials"
          title="Trials"
          description="Timed regional challenges and boss proving grounds."
        >
          <Button className="w-full" variant="outline" asChild>
            <Link href="/trials">Enter Trials</Link>
          </Button>
        </WorldSection>

        <WorldSection
          glyph="遊"
          iconSlug="games"
          title="Mini-Games"
          description={
            hasMiniGame
              ? "Quick sprints that reinforce what you have already learned."
              : "Complete your first lessons to unlock matching and rush drills."
          }
        >
          <div className="space-y-2">
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
          </div>
        </WorldSection>

        <WorldSection glyph="道" iconSlug="trails" title="Study Trails">
          <div className="grid grid-cols-2 gap-2">
            {STUDY_TRAILS.map((trail) => (
              <Button
                key={trail.href}
                variant="outline"
                className="h-auto flex-col gap-1 py-3"
                asChild
              >
                <Link href={trail.href}>
                  <span className="font-japanese text-sm" aria-hidden>
                    {trail.glyph}
                  </span>
                  {trail.label}
                </Link>
              </Button>
            ))}
          </div>
        </WorldSection>

        <WorldSection
          glyph="仲"
          iconSlug="community"
          title="Community"
          description="Opt-in leagues and fellow climbers."
        >
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              loading={joiningLeague}
              onClick={() => void joinLeague()}
            >
              Join weekly league
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/world/social">Friends leaderboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/community">Friends & activity</Link>
            </Button>
          </div>
        </WorldSection>

        <WorldSection
          glyph="集"
          iconSlug="collect"
          title="Collect & Celebrate"
          description="Shop, seasonal festivals, and your climb journal."
        >
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
              <Link href="/world/inventory">
                <span className="font-japanese text-sm" aria-hidden>
                  袋
                </span>
                Backpack
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
              <Link href="/world/shop">
                <span className="font-japanese text-sm" aria-hidden>
                  店
                </span>
                Trail Shop
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
              <Link href="/world/events">
                <span className="font-japanese text-sm" aria-hidden>
                  桜
                </span>
                Sakura Festival
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
              <Link href="/profile/memory-book">
                <span className="font-japanese text-sm" aria-hidden>
                  記
                </span>
                Memory Book
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3" asChild>
              <Link href="/achievements">
                <span className="font-japanese text-sm" aria-hidden>
                  誉
                </span>
                Achievements
              </Link>
            </Button>
          </div>
        </WorldSection>

        <WorldSection
          glyph="頂"
          iconSlug="endgame"
          title="Endgame"
          description="Post-N1 mastery mountains and seasonal events."
        >
          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/endgame">Mastery Mountains</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/world/events">Seasonal events</Link>
            </Button>
          </div>
        </WorldSection>
      </PageContainer>
    </IllustratedScreen>
  );
}
