"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BETA_RELEASE } from "@/lib/release/beta.constants";
import { OFFICIAL_RELEASE } from "@/lib/release/release.constants";
import type { LeagueDashboardViewModel } from "@/features/leagues/types/league.types";
import type { FriendsDashboardViewModel } from "@/features/friends/types/friends.types";

export function CommunityScreen() {
  const [league, setLeague] = useState<LeagueDashboardViewModel | null>(null);
  const [friends, setFriends] = useState<FriendsDashboardViewModel | null>(null);

  useEffect(() => {
    void fetch("/api/leagues")
      .then((r) => r.json())
      .then((payload: { success: boolean; data?: LeagueDashboardViewModel }) => {
        if (payload.success && payload.data) setLeague(payload.data);
      });
    void fetch("/api/friends")
      .then((r) => r.json())
      .then((payload: { success: boolean; data?: FriendsDashboardViewModel }) => {
        if (payload.success && payload.data) setFriends(payload.data);
      });
  }, []);

  return (
    <PageContainer>
      <ScreenHeader
        title="Community"
        subtitle="Fellow climbers, leagues, and shared ascents"
      />

      <Card className="mb-4 border-primary/20 shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">
            {BETA_RELEASE.enabled ? "Beta climbers welcome" : OFFICIAL_RELEASE.label}
          </CardTitle>
          <CardDescription>
            Follow climbers, join opt-in leagues, and share calm encouragement — never
            streak pressure.
          </CardDescription>
        </CardHeader>
        <Button asChild>
          <Link href="/feedback">Share feedback</Link>
        </Button>
      </Card>

      <Card className="mb-4 shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Weekly League</CardTitle>
          <CardDescription>
            {league?.optedIn
              ? `${league.tierLabel} · ${league.weeklyEp} EP this week`
              : "Opt in to climb alongside others. Gentle demotion, no guilt."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {league?.optedIn && league.rank ? (
            <Badge variant="outline">Rank #{league.rank}</Badge>
          ) : null}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/explore">Manage league in Explore</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Activity Feed</CardTitle>
          <CardDescription>
            {friends?.activityFeed.length
              ? "Recent climbs from people you follow"
              : "Follow climbers to see their trail milestones"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {friends?.activityFeed.slice(0, 5).map((entry) => (
            <p key={`${entry.userId}-${entry.createdAt}`} className="text-body-sm">
              <span className="font-medium">{entry.displayName}</span> — {entry.activityLabel}
            </p>
          )) ?? (
            <p className="text-body-sm text-muted-foreground">No activity yet.</p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
