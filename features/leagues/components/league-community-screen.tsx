"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlassPanel, PrimaryClimbButton } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { FriendsLeaderboardRow } from "@/features/social/components/friends-leaderboard-row";
import type { FriendsDashboardViewModel } from "@/features/friends/types/friends.types";
import type { LeagueDashboardViewModel } from "@/features/leagues/types/league.types";
import type { FriendsLeaderboardViewModel } from "@/features/social/types/social.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";

type LeagueCommunityScreenProps = {
  dashboard: LeagueDashboardViewModel | null;
  friends?: FriendsDashboardViewModel | null;
  defaultTab?: "friends" | "leaderboard";
  title?: string;
};

function formatWeekEnds(iso: string | null): string {
  if (!iso) return "Season in progress";
  const ends = new Date(iso);
  const days = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / 86400000));
  return days === 1 ? "1 day left" : `${days} days left`;
}

function toLeaderboardViewModel(
  dashboard: LeagueDashboardViewModel,
): FriendsLeaderboardViewModel {
  return {
    leagueLabel: dashboard.tierLabel,
    weekEndsAt: dashboard.seasonEndsAt ?? new Date().toISOString(),
    currentUserRank: dashboard.rank,
    entries: dashboard.leaderboard.map((entry) => ({
      rank: entry.rank,
      userId: entry.userId,
      displayName: entry.displayName,
      weeklyEp: entry.weeklyEp,
      regionLabel: dashboard.tierLabel,
      titleLabel: "Climber",
      achievementCount: 0,
      isCurrentUser: entry.rank === dashboard.rank,
    })),
  };
}

export function LeagueCommunityScreen({
  dashboard,
  friends = null,
  defaultTab = "leaderboard",
  title = "Community",
}: LeagueCommunityScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [optedIn, setOptedIn] = useState(dashboard?.optedIn ?? false);
  const [busy, setBusy] = useState(false);

  async function handleOptIn() {
    setBusy(true);
    try {
      const response = await fetch("/api/leagues", { method: "POST" });
      if (response.ok) {
        setOptedIn(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleOptOut() {
    setBusy(true);
    try {
      const response = await fetch("/api/leagues/opt-out", { method: "POST" });
      if (response.ok) {
        setOptedIn(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (!dashboard) {
    return (
      <SecondaryScreenShell title={title} subtitle="Weekly leagues" backHref="/camp" backLabel="Camp">
        <YamaEmptyState
          surface="generic"
          title="Leagues rest between seasons"
          description="A new weekly trail league will open soon. Keep climbing — your EP still counts toward elevation."
          actionHref="/camp"
          actionLabel="Return to camp"
        />
      </SecondaryScreenShell>
    );
  }

  const leaderboard = toLeaderboardViewModel(dashboard);
  const hasFriendsData =
    (friends?.following.length ?? 0) > 0 ||
    (friends?.followers.length ?? 0) > 0 ||
    (friends?.activityFeed.length ?? 0) > 0;

  return (
    <SecondaryScreenShell
      title={title}
      subtitle="Opt-in weekly league — encouragement, not pressure"
      backHref="/camp"
      backLabel="Camp"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
        {!optedIn ? (
          <GlassPanel className="space-y-3 p-4">
            <h2 className="text-body font-semibold">Join the weekly league</h2>
            <p className="text-body-sm text-muted-foreground">
              Compete calmly on weekly EP. You can leave anytime — no streak penalties, no pay-to-win.
            </p>
            <PrimaryClimbButton type="button" disabled={busy} onClick={handleOptIn}>
              {busy ? "Joining…" : "Opt in to league"}
            </PrimaryClimbButton>
          </GlassPanel>
        ) : (
          <>
            <GlassPanel className="mb-4 space-y-3 p-4">
              <div className="space-y-1">
                <p className="text-body-sm font-semibold">{leaderboard.leagueLabel}</p>
                <p className="text-caption text-muted-foreground">
                  {formatWeekEnds(dashboard.seasonEndsAt)}
                  {dashboard.rank ? ` · You are #${dashboard.rank}` : null}
                  {dashboard.weeklyEp > 0 ? ` · ${dashboard.weeklyEp} EP this week` : null}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={handleOptOut}
                className="text-caption text-muted-foreground underline-offset-2 hover:underline"
              >
                {busy ? "Updating…" : "Leave weekly league"}
              </button>
            </GlassPanel>

            <div className="flex gap-2" role="tablist" aria-label="Community sections">
              {(["leaderboard", "friends"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-caption font-medium capitalize transition-colors",
                    activeTab === tab
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-black/40 text-muted-foreground",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "leaderboard" ? (
              <section aria-labelledby="leaderboard-heading" className="space-y-2">
                <h2 id="leaderboard-heading" className="sr-only">
                  Weekly leaderboard
                </h2>
                {leaderboard.entries.length === 0 ? (
                  <YamaEmptyState
                    surface="generic"
                    title="First climbers on the board"
                    description="Complete lessons this week to appear on the league trail."
                  />
                ) : (
                  <ul className="space-y-2">
                    {leaderboard.entries.map((entry) => (
                      <li key={entry.userId}>
                        <FriendsLeaderboardRow entry={entry} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : hasFriendsData && friends ? (
              <section aria-labelledby="friends-heading" className="space-y-3">
                <h2 id="friends-heading" className="text-body font-semibold">
                  Following
                </h2>
                {friends.following.length === 0 ? (
                  <p className="text-body-sm text-muted-foreground">You are not following anyone yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {friends.following.map((friend) => (
                      <li key={friend.userId} className="rounded-lg border border-border bg-black/40 px-3 py-2">
                        <p className="font-medium">{friend.displayName}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {friends.activityFeed.length > 0 ? (
                  <>
                    <h3 className="text-body-sm font-semibold">Recent activity</h3>
                    <ul className="space-y-2">
                      {friends.activityFeed.slice(0, 8).map((item) => (
                        <li key={`${item.userId}-${item.createdAt}`} className="text-body-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{item.displayName}</span>{" "}
                          {item.activityLabel}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : (
              <YamaEmptyState
                surface="generic"
                title="Follow companions on the trail"
                description="When you follow other climbers, their weekly progress and activity will appear here."
                actionHref="/camp"
                actionLabel="Return to camp"
              />
            )}
          </>
        )}

        <PrimaryClimbButton asChild className="mx-auto max-w-md">
          <Link href="/camp">Return to camp</Link>
        </PrimaryClimbButton>
      </div>
    </SecondaryScreenShell>
  );
}
