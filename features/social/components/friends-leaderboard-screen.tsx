"use client";

import Link from "next/link";
import { useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { FriendsLeaderboardRow } from "@/features/social/components/friends-leaderboard-row";
import { RecognitionPost } from "@/components/visual/world/recognition-post";
import { MessengerBoardRow } from "@/components/visual/world/messenger-board-row";
import type {
  FriendViewModel,
  FriendsDashboardViewModel,
  FriendsLeaderboardViewModel,
} from "@/features/social/types/social.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";

type SocialTab = "friends" | "leaderboard";

type FriendsLeaderboardScreenProps = {
  leaderboard: FriendsLeaderboardViewModel;
  friends: FriendsDashboardViewModel;
  defaultTab?: SocialTab;
};

function formatWeekEnds(iso: string): string {
  const ends = new Date(iso);
  const days = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / 86400000));
  return days === 1 ? "1 day left" : `${days} days left`;
}

function formatActivityTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function FriendCompanionRow({ friend }: { friend: FriendViewModel }) {
  return (
    <RecognitionPost
      displayName={friend.displayName}
      titleLabel={friend.titleLabel}
      regionLabel={friend.regionLabel}
      achievementCount={friend.achievementCount}
    />
  );
}

function FriendActivityRow({
  displayName,
  activityLabel,
  createdAt,
}: {
  displayName: string;
  activityLabel: string;
  createdAt: string;
}) {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <MessengerBoardRow
      title={displayName}
      body={activityLabel}
      time={formatActivityTime(createdAt)}
      timeDateTime={createdAt}
      leading={
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-body-sm font-semibold text-primary"
          aria-hidden
        >
          {initial}
        </span>
      }
    />
  );
}

export function FriendsLeaderboardScreen({
  leaderboard,
  friends,
  defaultTab = "leaderboard",
}: FriendsLeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState<SocialTab>(defaultTab);
  const { entries, leagueLabel, weekEndsAt, currentUserRank } = leaderboard;

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="social_gathering"
          alt="Mountain gathering at dusk"
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/camp"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Camp
          </Link>

          <GlassPanel variant="header" className="space-y-3 rounded-card p-4">
            <div className="space-y-1">
              <StoryTitle as="h1" className="text-base">
                Community
              </StoryTitle>
              <p className="text-caption text-muted-foreground">
                Friends and weekly league — encouragement, not pressure
              </p>
            </div>
            <div
              className="flex gap-1 rounded-full border border-glass-border bg-black/30 p-1"
              role="tablist"
              aria-label="Community views"
            >
              {(
                [
                  { id: "friends" as const, label: "Friends" },
                  { id: "leaderboard" as const, label: "League" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-full px-3 py-1.5 text-caption font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </GlassPanel>
        </header>

        <main
          className="relative z-10 flex-1 overflow-y-auto px-4 py-2"
          role="tabpanel"
          aria-label={activeTab === "friends" ? "Friends" : "League leaderboard"}
        >
          <div className="mx-auto max-w-md space-y-4 pb-4">
            {activeTab === "leaderboard" ? (
              <>
                <GlassPanel className="space-y-1 p-4">
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
              </>
            ) : (
              <>
                <GlassPanel className="space-y-2 p-4">
                  <StoryTitle as="h2" className="text-sm">
                    Following
                  </StoryTitle>
                  {friends.following.length === 0 ? (
                    <YamaEmptyState
                      surface="generic"
                      title="Companions await discovery"
                      description="Hidden travelers walk the same trails — seek fellow climbers at camp."
                      actionHref="/camp"
                      actionLabel="Return to camp"
                    />
                  ) : (
                    <ul className="space-y-2">
                      {friends.following.map((friend) => (
                        <li key={friend.userId}>
                          <FriendCompanionRow friend={friend} />
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassPanel>

                <section aria-labelledby="activity-heading" className="space-y-2">
                  <h2 id="activity-heading" className="text-body-sm font-semibold">
                    Recent activity
                  </h2>
                  {friends.activityFeed.length === 0 ? (
                    <YamaEmptyState
                      surface="generic"
                      title="Quiet trails ahead"
                      description="Friend milestones will appear here when climbers you follow make progress."
                    />
                  ) : (
                    <ul className="space-y-2">
                      {friends.activityFeed.map((activity) => (
                        <li key={`${activity.userId}-${activity.createdAt}`}>
                          <FriendActivityRow
                            displayName={activity.displayName}
                            activityLabel={activity.activityLabel}
                            createdAt={activity.createdAt}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <PrimaryClimbButton asChild className="mx-auto max-w-md">
            <Link href="/camp">Return to camp</Link>
          </PrimaryClimbButton>
        </footer>
      </div>
    </IllustratedScreen>
  );
}
