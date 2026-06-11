"use client";

import Link from "next/link";
import { useState } from "react";

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
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewSessionHub } from "@/features/review/components/review-session-hub";
import { ReviewStatsPanel } from "@/features/review/components/review-stats-panel";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { formatReviewStateLabel } from "@/features/review/services/srs.service";
import { AchievementUnlockFeedback } from "@/features/achievements/components/achievement-unlock-feedback";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { QuestCompleteFeedback } from "@/features/quests/components/quest-complete-feedback";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import type { OfflineReviewBundle } from "@/lib/offline/types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type { ReviewSessionViewModel } from "@/features/review/types/review.types";
import type { ReviewRating } from "@/features/review/types/review.types";

type ReviewSessionProps = {
  initialSession: ReviewSessionViewModel;
  offlineBundle: OfflineReviewBundle;
  onBundleChange: (bundle: OfflineReviewBundle) => void;
  sessionLimit?: number | null;
  contentType?: string | null;
  weakOnly?: boolean;
};

export function ReviewSession({
  initialSession,
  offlineBundle,
  onBundleChange,
  sessionLimit = null,
  contentType = null,
  weakOnly = false,
}: ReviewSessionProps) {
  const [session, setSession] = useState(initialSession);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [lastElevation, setLastElevation] = useState<ElevationAwardViewModel | null>(
    null,
  );
  const [lastAchievements, setLastAchievements] = useState<
    AchievementUnlockViewModel[]
  >([]);
  const [lastQuests, setLastQuests] = useState<QuestCompletionViewModel[]>([]);
  const [lastReviewFeedback, setLastReviewFeedback] = useState<
    ReturnType<typeof yamaService.resolveReviewFeedback> | null
  >(null);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [sessionEpEarned, setSessionEpEarned] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(
    Boolean(sessionLimit || contentType || weakOnly),
  );

  const quickSessionTarget = sessionLimit && sessionLimit > 0 ? sessionLimit : null;
  const sessionComplete =
    sessionFinished ||
    (quickSessionTarget !== null && sessionCompletedCount >= quickSessionTarget) ||
    (sessionStarted &&
      quickSessionTarget === null &&
      sessionCompletedCount > 0 &&
      !session.currentCard);

  async function submitRating(rating: ReviewRating) {
    if (!session.currentCard) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await offlineClient.submitReview(
        offlineBundle,
        session.currentCard.id,
        rating,
      );
      setSession((previous) => ({
        dueCount: result.delta.dueCount,
        stats: result.delta.stats,
        currentCard: result.delta.currentCard,
        recentHistory: [
          result.delta.recentHistoryEntry,
          ...previous.recentHistory,
        ].slice(0, 5),
      }));
      onBundleChange(result.bundle);
      setLastElevation(result.delta.elevation ?? null);
      setLastAchievements(result.delta.achievements ?? []);
      setLastQuests(result.delta.quests ?? []);
      setLastReviewFeedback(yamaService.resolveReviewFeedback(rating));
      setRevealed(false);
      setSessionCompletedCount((current) => current + 1);
      if (result.delta.elevation) {
        setSessionEpEarned((current) => current + result.delta.elevation!.epAwarded);
      }
      const nextCount = sessionCompletedCount + 1;
      if (quickSessionTarget !== null && nextCount >= quickSessionTarget) {
        setSessionFinished(true);
      } else if (
        quickSessionTarget === null &&
        !result.delta.currentCard &&
        nextCount > 0
      ) {
        setSessionFinished(true);
      }
      void analyticsService.track({
        name: "review_submitted",
        properties: {
          rating,
          contentType: session.currentCard.contentType,
          queuedOffline: result.queuedOffline,
        },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Review failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={quickSessionTarget ? "Quick Review" : "Review"}
        subtitle={
          weakOnly && contentType
            ? `Weak ${contentType} sprint · ${session.dueCount} due overall`
            : quickSessionTarget
              ? `${sessionCompletedCount}/${quickSessionTarget} in this sprint · ${session.dueCount} due overall`
              : `${session.dueCount} item${session.dueCount === 1 ? "" : "s"} due`
        }
      />

      {!sessionStarted && session.currentCard ? (
        <ReviewSessionHub stats={session.stats} />
      ) : null}

      {sessionStarted || !session.currentCard ? (
        <ReviewStatsPanel stats={session.stats} />
      ) : null}

      {error ? (
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {lastElevation ? (
        <Badge variant="secondary">+{lastElevation.epAwarded} EP earned</Badge>
      ) : null}

      <AchievementUnlockFeedback achievements={lastAchievements} />
      <QuestCompleteFeedback completions={lastQuests} />

      {lastReviewFeedback ? (
        <YamaPresence presence={lastReviewFeedback} size="sm" />
      ) : null}

      {sessionComplete ? (
        <Card className="border-success/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Sprint complete</CardTitle>
            <CardDescription>
              {sessionCompletedCount} review
              {sessionCompletedCount === 1 ? "" : "s"} finished
              {sessionEpEarned > 0 ? ` · +${sessionEpEarned} EP` : ""}
              {session.dueCount > 0
                ? ` · ${session.dueCount} still due`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <YamaPresence
              presence={yamaService.resolveCelebration("lesson_complete")}
              size="md"
              layout="vertical"
              className="items-center"
            />
            {session.dueCount > 0 ? (
              <Button className="w-full" asChild>
                <Link href="/review">Continue reviewing</Link>
              </Button>
            ) : null}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn">Continue Climbing</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/home">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      ) : !sessionStarted && session.currentCard ? (
        <Button className="w-full" size="lg" onClick={() => setSessionStarted(true)}>
          Start Review
        </Button>
      ) : !session.currentCard ? (
        <div className="space-y-4">
          <YamaPresence
            presence={yamaService.resolveReviewEmpty()}
            size="md"
            layout="vertical"
            className="items-center"
          />
          <EmptyState
            title="No reviews due"
            description="Complete lessons to build your review queue. Scheduled reviews will appear here."
          />
        </div>
      ) : (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline" className="capitalize">
                {session.currentCard.contentType}
              </Badge>
              <Badge variant="secondary">
                {formatReviewStateLabel(session.currentCard.state)}
              </Badge>
              <Badge variant="outline">
                {session.currentCard.masteryScore}% mastery
              </Badge>
            </div>
            <CardDescription className="text-center">
              {session.currentCard.nextReviewLabel}
            </CardDescription>
            <CardTitle className="text-center text-heading-1">
              {session.currentCard.term}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {revealed ? (
              <>
                <p className="text-body-sm text-muted-foreground">
                  {session.currentCard.reading}
                </p>
                <p className="text-body">{session.currentCard.meaning}</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    disabled={submitting}
                    onClick={() => void submitRating("again")}
                  >
                    Again
                  </Button>
                  <Button
                    variant="outline"
                    disabled={submitting}
                    onClick={() => void submitRating("good")}
                  >
                    Good
                  </Button>
                  <Button
                    variant="outline"
                    disabled={submitting}
                    onClick={() => void submitRating("strong")}
                  >
                    Strong
                  </Button>
                </div>
              </>
            ) : (
              <Button className="w-full" onClick={() => setRevealed(true)}>
                Show Answer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {session.recentHistory.length > 0 ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardTitle className="text-heading-6">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.recentHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="text-body-sm font-medium">{entry.term}</p>
                  <p className="text-caption capitalize text-muted-foreground">
                    {entry.contentType} · {formatReviewStateLabel(entry.state)}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {entry.rating}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </PageContainer>
  );
}
