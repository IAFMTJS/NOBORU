"use client";

import type {
  ReviewBatchSubmitItem,
  ReviewGamificationViewModel,
  ReviewRating,
  ReviewSubmitDeltaViewModel,
} from "@/features/review/types/review.types";
import {
  isBrowserOnline,
  offlineClient,
} from "@/features/offline/services/offline-client.service";
import {
  OFFLINE_BACKGROUND_SYNC_TAG,
  REVIEW_BATCH_FLUSH_SIZE,
} from "@/lib/offline/constants";
import type { OfflineReviewBundle } from "@/lib/offline/types";

type PendingReviewRating = ReviewBatchSubmitItem & {
  bundle: OfflineReviewBundle;
};

function createClientEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `review-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

class ReviewBatchClientService {
  private buffer: PendingReviewRating[] = [];
  private flushInFlight: Promise<ReviewSubmitDeltaViewModel | null> | null = null;

  enqueue(input: {
    bundle: OfflineReviewBundle;
    reviewItemId: string;
    rating: ReviewRating;
  }): Promise<{
    delta: ReviewSubmitDeltaViewModel;
    bundle: OfflineReviewBundle;
    queuedOffline: boolean;
    gamificationPromise: Promise<ReviewGamificationViewModel | null> | null;
  }> {
    if (!isBrowserOnline()) {
      return offlineClient.submitReview(
        input.bundle,
        input.reviewItemId,
        input.rating,
      );
    }

    const clientEventId = createClientEventId();
    const offlineResult = offlineClient.applyOfflineReview(
      input.bundle,
      input.reviewItemId,
      input.rating,
    );

    this.buffer.push({
      reviewItemId: input.reviewItemId,
      rating: input.rating,
      clientEventId,
      bundle: offlineResult.bundle,
    });

    void offlineClient.cacheReviewBundle(offlineResult.bundle);
    void this.flushSoon();

    return Promise.resolve({
      delta: offlineResult.delta,
      bundle: offlineResult.bundle,
      queuedOffline: false,
      gamificationPromise: null,
    });
  }

  async flush(): Promise<ReviewSubmitDeltaViewModel | null> {
    if (this.flushInFlight) {
      return this.flushInFlight;
    }

    this.flushInFlight = this.flushInternal().finally(() => {
      this.flushInFlight = null;
    });

    return this.flushInFlight;
  }

  private flushSoon(): void {
    if (this.buffer.length >= REVIEW_BATCH_FLUSH_SIZE) {
      void this.flush();
    }
  }

  private async flushInternal(): Promise<ReviewSubmitDeltaViewModel | null> {
    if (!isBrowserOnline() || this.buffer.length === 0) {
      return null;
    }

    const batch = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch("/api/review/submit/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: batch.map((entry) => ({
            reviewItemId: entry.reviewItemId,
            rating: entry.rating,
            clientEventId: entry.clientEventId,
          })),
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          lastDelta: ReviewSubmitDeltaViewModel;
          gamificationJobs: ReviewBatchSubmitItem[];
        };
        error?: string;
      };

      if (!result.success || !result.data?.lastDelta) {
        throw new Error(result.error ?? "Review batch failed.");
      }

      const lastBundle = batch[batch.length - 1]?.bundle;
      if (lastBundle) {
        const syncedBundle: OfflineReviewBundle = {
          ...lastBundle,
          session: {
            dueCount: result.data.lastDelta.dueCount,
            stats:
              result.data.lastDelta.stats.totalCount > 0
                ? result.data.lastDelta.stats
                : {
                    ...lastBundle.session.stats,
                    dueCount: result.data.lastDelta.dueCount,
                  },
            currentCard: result.data.lastDelta.currentCard,
            recentHistory: [
              result.data.lastDelta.recentHistoryEntry,
              ...lastBundle.session.recentHistory,
            ].slice(0, 5),
          },
          dueCards: result.data.lastDelta.currentCard
            ? [
                result.data.lastDelta.currentCard,
                ...lastBundle.dueCards.filter(
                  (card) => card.id !== result.data!.lastDelta.currentCard!.id,
                ),
              ]
            : lastBundle.dueCards.filter(
                (card) => card.id !== batch[batch.length - 1]?.reviewItemId,
              ),
          cachedAt: new Date().toISOString(),
        };
        await offlineClient.cacheReviewBundle(syncedBundle);
      }

      if (result.data.gamificationJobs.length > 0) {
        void this.pollBatchGamification(result.data.gamificationJobs);
      }

      return result.data.lastDelta;
    } catch (error) {
      await Promise.all(
        batch.map((entry) =>
          offlineClient.submitReview(entry.bundle, entry.reviewItemId, entry.rating),
        ),
      );
      throw error;
    }
  }

  private async pollBatchGamification(
    jobs: ReviewBatchSubmitItem[],
  ): Promise<void> {
    await Promise.all(
      jobs.map((job) =>
        offlineClient
          .fetchReviewGamification({
            clientEventId: job.clientEventId,
            reviewItemId: job.reviewItemId,
            rating: job.rating,
          })
          .catch(() => null),
      ),
    );
  }
}

export const reviewBatchClient = new ReviewBatchClientService();

export async function registerOfflineBackgroundSync(): Promise<void> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("SyncManager" in window)
  ) {
    return;
  }

    try {
      const registration = await navigator.serviceWorker.ready;
      const syncManager = registration as ServiceWorkerRegistration & {
        sync?: { register: (tag: string) => Promise<void> };
      };
      await syncManager.sync?.register(OFFLINE_BACKGROUND_SYNC_TAG);
    } catch {
    // Background Sync is optional and browser-dependent.
  }
}
