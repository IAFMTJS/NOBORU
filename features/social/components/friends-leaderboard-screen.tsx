"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { FriendsLeaderboardRow } from "@/features/social/components/friends-leaderboard-row";
import type { FriendsLeaderboardViewModel } from "@/features/social/types/social.types";

type FriendsLeaderboardScreenProps = {
  leaderboard: FriendsLeaderboardViewModel;
};

function formatWeekEnds(iso: string): string {
  const ends = new Date(iso);
  const days = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / 86400000));
  return days === 1 ? "1 day left" : `${days} days left`;
}

export function FriendsLeaderboardScreen({ leaderboard }: FriendsLeaderboardScreenProps) {
  const { entries, leagueLabel, weekEndsAt, currentUserRank } = leaderboard;

  return (
    <IllustratedScreen
      scrim="full"
      background={
        <div className="h-full bg-gradient-to-b from-background via-primary/5 to-background" />
      }
    >
      <PageContainer className="space-y-5">
        <Link
          href="/world"
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          World
        </Link>

        <header className="space-y-2">
          <StoryTitle as="h1">Friends & League</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Opt-in weekly climb — encouragement, not pressure.
          </p>
        </header>

        <GlassPanel variant="header" className="space-y-1 p-4">
          <p className="text-body-sm font-semibold">{leagueLabel}</p>
          <p className="text-caption text-muted-foreground">
            {formatWeekEnds(weekEndsAt)}
            {currentUserRank ? ` · You are #${currentUserRank}` : null}
          </p>
        </GlassPanel>

        <section aria-labelledby="leaderboard-heading" className="space-y-2">
          <h2 id="leaderboard-heading" className="sr-only">
            Weekly leaderboard
          </h2>
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.userId}>
                <FriendsLeaderboardRow entry={entry} />
              </li>
            ))}
          </ul>
        </section>

        <PrimaryClimbButton asChild>
          <Link href="/community">View full community</Link>
        </PrimaryClimbButton>
      </PageContainer>
    </IllustratedScreen>
  );
}
