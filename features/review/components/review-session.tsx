"use client";

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
import { ReviewStatsPanel } from "@/features/review/components/review-stats-panel";
import { formatReviewStateLabel } from "@/features/review/services/srs.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type { ReviewSessionViewModel } from "@/features/review/types/review.types";
import type { ReviewRating } from "@/features/review/types/review.types";

type ReviewSessionProps = {
  initialSession: ReviewSessionViewModel;
};

export function ReviewSession({ initialSession }: ReviewSessionProps) {
  const [session, setSession] = useState(initialSession);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [lastElevation, setLastElevation] = useState<ElevationAwardViewModel | null>(
    null,
  );

  async function submitRating(rating: ReviewRating) {
    if (!session.currentCard) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewItemId: session.currentCard.id,
          rating,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: ReviewSessionViewModel & {
          elevation?: ElevationAwardViewModel | null;
        };
        error?: string;
      };
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Review failed.");
      }
      setSession(result.data);
      setLastElevation(result.data.elevation ?? null);
      setRevealed(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <ScreenHeader
        title="Review"
        subtitle={`${session.dueCount} item${session.dueCount === 1 ? "" : "s"} due`}
      />

      <ReviewStatsPanel stats={session.stats} />

      {lastElevation ? (
        <Badge variant="secondary">+{lastElevation.epAwarded} EP earned</Badge>
      ) : null}

      {!session.currentCard ? (
        <EmptyState
          title="No reviews due"
          description="Complete lessons to build your review queue. Scheduled reviews will appear here."
        />
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
