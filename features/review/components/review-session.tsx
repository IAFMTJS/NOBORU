"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
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
import { reviewBatchClient } from "@/features/review/services/review-batch-client.service";
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

  useEffect(() => {
    if (!sessionComplete) return;
    void reviewBatchClient.flush().catch(() => undefined);
  }, [sessionComplete]);

  useEffect(() => {
    return () => {
      void reviewBatchClient.flush().catch(() => undefined);
    };
  }, []);

  async function submitRating(rating: ReviewRating) {
    if (!session.currentCard) return;

    const ratedCard = session.currentCard;
    const previousSession = session;
    const previousBundle = offlineBundle;
    const optimistic = offlineClient.applyOfflineReview(
      offlineBundle,
      ratedCard.id,
      rating,
    );

    setSession({
      dueCount: optimistic.delta.dueCount,
      stats: {
        ...previousSession.stats,
        dueCount: optimistic.delta.dueCount,
      },
      currentCard: optimistic.delta.currentCard,
      recentHistory: [
        optimistic.delta.recentHistoryEntry,
        ...previousSession.recentHistory,
      ].slice(0, 5),
    });
    onBundleChange(optimistic.bundle);
    setLastReviewFeedback(yamaService.resolveReviewFeedback(rating));
    setRevealed(false);
    setSessionCompletedCount((current) => current + 1);
    const nextCount = sessionCompletedCount + 1;
    let finishedAfterOptimistic = false;
    if (quickSessionTarget !== null && nextCount >= quickSessionTarget) {
      setSessionFinished(true);
      finishedAfterOptimistic = true;
    } else if (
      quickSessionTarget === null &&
      !optimistic.delta.currentCard &&
      nextCount > 0
    ) {
      setSessionFinished(true);
      finishedAfterOptimistic = true;
    }

    setError(null);

    void reviewBatchClient
      .enqueue({
        bundle: optimistic.bundle,
        reviewItemId: ratedCard.id,
        rating,
      })
      .then((result) => {
        setSession((previous) => ({
          dueCount: result.delta.dueCount,
          stats:
            result.delta.stats.totalCount > 0
              ? result.delta.stats
              : {
                  ...previous.stats,
                  dueCount: result.delta.dueCount,
                },
          currentCard: result.delta.currentCard,
          recentHistory: [
            result.delta.recentHistoryEntry,
            ...previous.recentHistory,
          ].slice(0, 5),
        }));
        onBundleChange(result.bundle);

        void analyticsService.track({
          name: "review_submitted",
          properties: {
            rating,
            contentType: ratedCard.contentType,
            queuedOffline: result.queuedOffline,
          },
        });

        if (result.gamificationPromise) {
          void result.gamificationPromise.then((gamification) => {
            if (!gamification?.ready) return;
            setLastElevation(gamification.elevation);
            setLastAchievements(gamification.achievements);
            setLastQuests(gamification.quests);
            if (gamification.stats) {
              setSession((previous) => ({
                ...previous,
                stats: gamification.stats!,
              }));
            }
            if (gamification.elevation) {
              setSessionEpEarned(
                (current) => current + gamification.elevation!.epAwarded,
              );
            }
          });
        } else {
          setLastElevation(result.delta.elevation ?? null);
          setLastAchievements(result.delta.achievements ?? []);
          setLastQuests(result.delta.quests ?? []);
          if (result.delta.elevation) {
            setSessionEpEarned(
              (current) => current + result.delta.elevation!.epAwarded,
            );
          }
        }
      })
      .catch((caught) => {
        setSession(previousSession);
        onBundleChange(previousBundle);
        setSessionCompletedCount((current) => Math.max(0, current - 1));
        if (finishedAfterOptimistic) {
          setSessionFinished(false);
        }
        setError(caught instanceof Error ? caught.message : "Review failed.");
      });
  }

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene="review_atmosphere"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="space-y-4 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(3.75rem+env(safe-area-inset-top))]">
        <header className="space-y-1 text-center">
          <StoryTitle as="h1" className="text-trail-glow">
            {quickSessionTarget ? "Spirit Trials" : "Mountain Review"}
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            {weakOnly && contentType
              ? `Weak ${contentType} sprint · ${session.dueCount} due overall`
              : quickSessionTarget
                ? `${sessionCompletedCount}/${quickSessionTarget} in this sprint · ${session.dueCount} due overall`
                : `${session.dueCount} item${session.dueCount === 1 ? "" : "s"} due`}
          </p>
        </header>

      {!sessionStarted && session.currentCard ? (
        <ReviewSessionHub stats={session.stats} />
      ) : null}

      {sessionComplete ? (
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
        <GlassPanel className="space-y-3 border-success/30 p-4">
          <div className="space-y-1">
            <h2 className="text-heading-5 font-semibold">Sprint complete</h2>
            <p className="text-body-sm text-muted-foreground">
              {sessionCompletedCount} review
              {sessionCompletedCount === 1 ? "" : "s"} finished
              {sessionEpEarned > 0 ? ` · +${sessionEpEarned} EP` : ""}
              {session.dueCount > 0 ? ` · ${session.dueCount} still due` : ""}
            </p>
          </div>
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
          <PrimaryClimbButton className="w-full" asChild>
            <Link href="/learn">Continue Climbing</Link>
          </PrimaryClimbButton>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/camp">Return to Camp</Link>
          </Button>
        </GlassPanel>
      ) : !sessionStarted && session.currentCard ? (
        <Button className="w-full" size="lg" onClick={() => setSessionStarted(true)}>
          Start Review
        </Button>
      ) : !session.currentCard ? (
        <YamaEmptyState
          surface="review"
          title="No reviews due"
          description="Complete lessons to build your review queue. Scheduled reviews will appear here."
        />
      ) : (
        <GlassPanel className="space-y-4 border-trail-glow/20 p-4">
          <div className="space-y-2 text-center">
            <p className="text-caption font-medium uppercase tracking-widest text-trail-glow/80">
              {formatReviewStateLabel(session.currentCard.state)} · {session.currentCard.contentType}
            </p>
            <h2 className="font-story text-4xl font-bold text-heading-story sm:text-5xl">
              <span lang="ja" className="font-japanese">
                {session.currentCard.term}
              </span>
            </h2>
            <p className="text-caption text-muted-foreground">
              {session.currentCard.nextReviewLabel}
            </p>
          </div>
          <div className="space-y-4 text-center">
            {revealed ? (
              <>
                <p className="text-body-sm text-muted-foreground">
                  {session.currentCard.reading}
                </p>
                <p className="text-body">{session.currentCard.meaning}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Button variant="outline" onClick={() => void submitRating("again")}>
                    Again
                  </Button>
                  <Button variant="outline" onClick={() => void submitRating("hard")}>
                    Hard
                  </Button>
                  <Button onClick={() => void submitRating("good")}>
                    Good
                  </Button>
                  <Button variant="secondary" onClick={() => void submitRating("easy")}>
                    Easy
                  </Button>
                </div>
              </>
            ) : (
              <Button className="w-full" onClick={() => setRevealed(true)}>
                Show Answer
              </Button>
            )}
          </div>
        </GlassPanel>
      )}

      {session.recentHistory.length > 0 ? (
        <GlassPanel className="space-y-3 p-4">
          <h3 className="text-heading-6 font-semibold">Recent Reviews</h3>
          <div className="space-y-3">
            {session.recentHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                <p className="text-body-sm font-medium">
                  <span lang="ja" className="font-japanese">
                    {entry.term}
                  </span>
                </p>
                  <p className="text-caption capitalize text-muted-foreground">
                    {entry.contentType} · {formatReviewStateLabel(entry.state)}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {entry.rating}
                </Badge>
              </div>
            ))}
          </div>
        </GlassPanel>
      ) : null}
      </div>
    </IllustratedScreen>
  );
}
