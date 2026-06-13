"use client";

import type {
  ReviewCardViewModel,
  ReviewGamificationViewModel,
  ReviewRating,
  ReviewSessionViewModel,
  ReviewSubmitDeltaViewModel,
} from "@/features/review/types/review.types";
import type { ReviewState } from "@/features/review/repositories/review.repository";
import {
  applySrsRating,
  formatNextReviewLabel,
} from "@/features/review/services/srs.service";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type {
  GameCompleteViewModel,
  GameSessionViewModel,
} from "@/features/games/types/game.types";
import type { LessonSessionViewModel } from "@/features/learning/types/lesson.types";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import { computeTrialGrade } from "@/features/trials/constants/trial.constants";
import type {
  TrialCompleteViewModel,
  TrialSessionViewModel,
} from "@/features/trials/types/trial.types";
import {
  OFFLINE_AUDIO_CACHE_MAX_ENTRIES,
  OFFLINE_BACKGROUND_SYNC_TAG,
  OFFLINE_STORES,
} from "@/lib/offline/constants";
import { getOfflineDb } from "@/lib/offline/db";
import { aggregateSyncGamification } from "@/lib/offline/sync-gamification";
import type {
  OfflineGameCompletePayload,
  OfflineLessonCompletePayload,
  OfflineLessonStartPayload,
  OfflineListeningProgressPayload,
  OfflineReadingProgressPayload,
  OfflineReviewBundle,
  OfflineReviewSubmitPayload,
  OfflineStatusViewModel,
  OfflineSyncBatchResponse,
  OfflineSyncMutation,
  OfflineSyncPayload,
  OfflineTrialCompletePayload,
} from "@/lib/offline/types";

function createMutationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `offline-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isOfflineFetchFailure(error: unknown): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) return true;
  return error instanceof TypeError;
}

function estimateStreakCount(state: ReviewState): number {
  switch (state) {
    case "new":
    case "learning":
      return 0;
    case "good":
      return 1;
    case "strong":
      return 3;
    case "mastered":
      return 5;
    case "legendary":
      return 8;
    default:
      return 0;
  }
}

export function isBrowserOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

class OfflineClientService {
  private syncInFlight: Promise<OfflineSyncBatchResponse> | null = null;

  async cacheLesson(session: LessonSessionViewModel): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.lessons, {
      lessonId: session.lessonId,
      session,
      cachedAt: new Date().toISOString(),
    });
  }

  async getCachedLesson(
    lessonId: string,
  ): Promise<LessonSessionViewModel | null> {
    const db = await getOfflineDb();
    const record = await db.get(OFFLINE_STORES.lessons, lessonId);
    return record?.session ?? null;
  }

  async listCachedLessons(): Promise<LessonSessionViewModel[]> {
    const db = await getOfflineDb();
    const records = await db.getAll(OFFLINE_STORES.lessons);
    return records
      .sort((left, right) => right.cachedAt.localeCompare(left.cachedAt))
      .map((record) => record.session);
  }

  async cacheReviewBundle(bundle: OfflineReviewBundle): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.reviewBundles, bundle);
  }

  async getCachedReviewBundle(
    userId: string,
  ): Promise<OfflineReviewBundle | null> {
    const db = await getOfflineDb();
    return (await db.get(OFFLINE_STORES.reviewBundles, userId)) ?? null;
  }

  async cacheAudio(url: string, blob: Blob): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.audio, {
      url,
      blob,
      cachedAt: new Date().toISOString(),
    });

    const all = await db.getAll(OFFLINE_STORES.audio);
    if (all.length <= OFFLINE_AUDIO_CACHE_MAX_ENTRIES) return;

    const sorted = all.sort((left, right) =>
      left.cachedAt.localeCompare(right.cachedAt),
    );
    const overflow = sorted.slice(0, all.length - OFFLINE_AUDIO_CACHE_MAX_ENTRIES);
    await Promise.all(
      overflow.map((entry) => db.delete(OFFLINE_STORES.audio, entry.url)),
    );
  }

  async getCachedAudioUrl(url: string): Promise<string | null> {
    const db = await getOfflineDb();
    const record = await db.get(OFFLINE_STORES.audio, url);
    if (!record) return null;
    return URL.createObjectURL(record.blob);
  }

  async enqueueMutation(input: {
    type: OfflineSyncMutation["type"];
    payload: OfflineSyncPayload;
    id?: string;
  }): Promise<OfflineSyncMutation> {
    const db = await getOfflineDb();
    const mutation: OfflineSyncMutation = {
      id: input.id ?? createMutationId(),
      type: input.type,
      payload: input.payload,
      clientTimestamp: new Date().toISOString(),
      status: "pending",
      retryCount: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
    };
    await db.add(OFFLINE_STORES.syncQueue, mutation);
    void this.registerBackgroundSync();
    return mutation;
  }

  private async registerBackgroundSync(): Promise<void> {
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

  async markMutationsSyncing(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await getOfflineDb();
    await Promise.all(
      ids.map(async (id) => {
        const mutation = await db.get(OFFLINE_STORES.syncQueue, id);
        if (!mutation) return;
        await db.put(OFFLINE_STORES.syncQueue, {
          ...mutation,
          status: "syncing",
        });
      }),
    );
  }

  async resetSyncingMutations(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await getOfflineDb();
    await Promise.all(
      ids.map(async (id) => {
        const mutation = await db.get(OFFLINE_STORES.syncQueue, id);
        if (!mutation || mutation.status !== "syncing") return;
        await db.put(OFFLINE_STORES.syncQueue, {
          ...mutation,
          status: "pending",
        });
      }),
    );
  }

  async listPendingMutations(): Promise<OfflineSyncMutation[]> {
    const db = await getOfflineDb();
    const all = await db.getAll(OFFLINE_STORES.syncQueue);
    return all
      .filter((mutation) => mutation.status !== "syncing")
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async removeMutations(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await getOfflineDb();
    await Promise.all(ids.map((id) => db.delete(OFFLINE_STORES.syncQueue, id)));
  }

  async markMutationFailed(id: string, error: string): Promise<void> {
    const db = await getOfflineDb();
    const mutation = await db.get(OFFLINE_STORES.syncQueue, id);
    if (!mutation) return;
    await db.put(OFFLINE_STORES.syncQueue, {
      ...mutation,
      status: "failed",
      retryCount: mutation.retryCount + 1,
      lastError: error,
    });
  }

  async setLastSyncedAt(iso: string): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.meta, {
      key: "lastSyncedAt",
      value: iso,
      updatedAt: iso,
    });
  }

  async getLastSyncedAt(): Promise<string | null> {
    const db = await getOfflineDb();
    const record = await db.get(OFFLINE_STORES.meta, "lastSyncedAt");
    return record?.value ?? null;
  }

  async getStatus(userId?: string): Promise<OfflineStatusViewModel> {
    const db = await getOfflineDb();
    const [lessons, queue, audio, reviewBundle, lastSyncedAt] = await Promise.all([
      db.getAll(OFFLINE_STORES.lessons),
      db.getAll(OFFLINE_STORES.syncQueue),
      db.getAll(OFFLINE_STORES.audio),
      userId ? db.get(OFFLINE_STORES.reviewBundles, userId) : Promise.resolve(null),
      this.getLastSyncedAt(),
    ]);

    return {
      isOnline: isBrowserOnline(),
      pendingMutations: queue.filter((mutation) => mutation.status !== "syncing").length,
      cachedLessons: lessons.length,
      cachedReviewCards: reviewBundle?.dueCards.length ?? 0,
      cachedAudioFiles: audio.length,
      lastSyncedAt,
    };
  }

  applyOfflineReview(
    bundle: OfflineReviewBundle,
    reviewItemId: string,
    rating: ReviewRating,
  ): { bundle: OfflineReviewBundle; delta: ReviewSubmitDeltaViewModel } {
    const current = bundle.session.currentCard;
    if (!current || current.id !== reviewItemId) {
      throw new Error("Review card is out of sync with offline cache.");
    }

    const reviewedAt = new Date().toISOString();
    const now = new Date();
    const schedule = applySrsRating({
      state: current.state,
      rating,
      masteryScore: current.masteryScore,
      streakCount: estimateStreakCount(current.state),
      now,
    });

    const updatedCard: ReviewCardViewModel = {
      ...current,
      state: schedule.state,
      masteryScore: schedule.masteryScore,
      nextReviewLabel: formatNextReviewLabel(
        schedule.nextReviewAt.toISOString(),
        schedule.intervalDays,
      ),
    };

    const remainingWithoutCurrent = bundle.dueCards.filter(
      (card) => card.id !== reviewItemId,
    );
    const stillDueInSession = schedule.nextReviewAt.getTime() <= now.getTime();
    const dueCards = stillDueInSession
      ? [...remainingWithoutCurrent, updatedCard]
      : remainingWithoutCurrent;
    const nextCard = dueCards[0] ?? null;
    const historyEntry = {
      id: `${reviewItemId}-${reviewedAt}`,
      contentType: current.contentType,
      term: current.term,
      rating,
      state: schedule.state,
      reviewedAt,
    };

    const session: ReviewSessionViewModel = {
      dueCount: dueCards.length,
      stats: {
        ...bundle.session.stats,
        dueCount: dueCards.length,
      },
      currentCard: nextCard,
      recentHistory: [historyEntry, ...bundle.session.recentHistory].slice(0, 5),
    };

    const updatedBundle: OfflineReviewBundle = {
      ...bundle,
      session,
      dueCards,
      cachedAt: reviewedAt,
    };

    return {
      bundle: updatedBundle,
      delta: {
        dueCount: session.dueCount,
        stats: session.stats,
        currentCard: nextCard,
        recentHistoryEntry: historyEntry,
        elevation: null,
        achievements: [],
        quests: [],
      },
    };
  }

  async fetchLessonSession(lessonId: string): Promise<LessonSessionViewModel> {
    const response = await fetch(`/api/learning/lessons/${lessonId}`);
    const result = (await response.json()) as {
      success: boolean;
      data?: LessonSessionViewModel;
      error?: string;
    };
    if (!result.success || !result.data) {
      throw new Error(result.error ?? "Failed to load lesson.");
    }
    await this.cacheLesson(result.data);
    return result.data;
  }

  async startLesson(lessonId: string): Promise<void> {
    if (isBrowserOnline()) {
      const response = await fetch(`/api/learning/lessons/${lessonId}`, {
        method: "POST",
      });
      const result = (await response.json()) as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error ?? "Unable to start lesson.");
      }
      return;
    }

    await this.enqueueMutation({
      type: "lesson_start",
      payload: { lessonId } satisfies OfflineLessonStartPayload,
    });
  }

  async completeLesson(
    lessonId: string,
    score: number,
  ): Promise<{
    score: number;
    elevation: ElevationAwardViewModel | null;
    achievements: AchievementUnlockViewModel[];
    quests: QuestCompletionViewModel[];
    reviewItemsEnqueued: number;
    queuedOffline: boolean;
  }> {
    if (isBrowserOnline()) {
      try {
        const response = await fetch(`/api/learning/progress/${lessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        });
        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: {
            score: number;
            elevation?: ElevationAwardViewModel | null;
            achievements?: AchievementUnlockViewModel[];
            quests?: QuestCompletionViewModel[];
            reviewItemsEnqueued?: number;
          };
        };
        if (!result.success) {
          throw new Error(result.error ?? "Unable to save progress.");
        }
        return {
          score: result.data?.score ?? score,
          elevation: result.data?.elevation ?? null,
          achievements: result.data?.achievements ?? [],
          quests: result.data?.quests ?? [],
          reviewItemsEnqueued: result.data?.reviewItemsEnqueued ?? 0,
          queuedOffline: false,
        };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    await this.enqueueMutation({
      type: "lesson_complete",
      payload: { lessonId, score } satisfies OfflineLessonCompletePayload,
    });

    const cached = await this.getCachedLesson(lessonId);
    if (cached) {
      await this.cacheLesson({
        ...cached,
        progress: "completed",
        score,
      });
    }

    return {
      score,
      elevation: null,
      achievements: [],
      quests: [],
      reviewItemsEnqueued: 0,
      queuedOffline: true,
    };
  }

  async submitReview(
    bundle: OfflineReviewBundle,
    reviewItemId: string,
    rating: ReviewRating,
  ): Promise<{
    delta: ReviewSubmitDeltaViewModel;
    bundle: OfflineReviewBundle;
    queuedOffline: boolean;
    gamificationPromise: Promise<ReviewGamificationViewModel | null> | null;
  }> {
    const clientEventId = createMutationId();

    if (isBrowserOnline()) {
      try {
        const response = await fetch("/api/review/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewItemId, rating, clientEventId }),
        });
        const result = (await response.json()) as {
          success: boolean;
          data?: ReviewSubmitDeltaViewModel;
          error?: string;
        };
        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Review failed.");
        }

        const updatedBundle: OfflineReviewBundle = {
          ...bundle,
          session: {
            dueCount: result.data.dueCount,
            stats: {
              ...bundle.session.stats,
              dueCount: result.data.dueCount,
            },
            currentCard: result.data.currentCard,
            recentHistory: [
              result.data.recentHistoryEntry,
              ...bundle.session.recentHistory,
            ].slice(0, 5),
          },
          dueCards: result.data.currentCard
            ? [
                result.data.currentCard,
                ...bundle.dueCards.filter(
                  (card) => card.id !== result.data!.currentCard!.id,
                ),
              ]
            : bundle.dueCards.filter((card) => card.id !== reviewItemId),
          cachedAt: new Date().toISOString(),
        };
        await this.cacheReviewBundle(updatedBundle);

        const gamificationPromise = result.data.gamificationPending
          ? this.fetchReviewGamification({
              clientEventId,
              reviewItemId,
              rating,
            }).catch(() => null)
          : null;

        return {
          delta: result.data,
          bundle: updatedBundle,
          queuedOffline: false,
          gamificationPromise,
        };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    const offlineResult = this.applyOfflineReview(bundle, reviewItemId, rating);
    await this.cacheReviewBundle(offlineResult.bundle);
    await this.enqueueMutation({
      id: clientEventId,
      type: "review_submit",
      payload: {
        reviewItemId,
        rating,
        clientEventId,
      } satisfies OfflineReviewSubmitPayload,
    });

    return {
      delta: offlineResult.delta,
      bundle: offlineResult.bundle,
      queuedOffline: true,
      gamificationPromise: null,
    };
  }

  async fetchReviewGamification(input: {
    clientEventId: string;
    reviewItemId: string;
    rating: ReviewRating;
  }): Promise<ReviewGamificationViewModel> {
    const response = await fetch("/api/review/gamification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: ReviewGamificationViewModel;
      error?: string;
    };
    if (!result.success || !result.data) {
      throw new Error(result.error ?? "Failed to load review rewards.");
    }
    return result.data;
  }

  async syncPendingMutations(): Promise<OfflineSyncBatchResponse> {
    if (this.syncInFlight) {
      return this.syncInFlight;
    }

    this.syncInFlight = this.syncPendingMutationsInternal().finally(() => {
      this.syncInFlight = null;
    });

    return this.syncInFlight;
  }

  private async syncPendingMutationsInternal(): Promise<OfflineSyncBatchResponse> {
    if (!isBrowserOnline()) {
      throw new Error("Cannot sync while offline.");
    }

    const pending = await this.listPendingMutations();
    if (pending.length === 0) {
      return { applied: [], failed: [], pendingCount: 0 };
    }

    const pendingIds = pending.map((mutation) => mutation.id);
    await this.markMutationsSyncing(pendingIds);

    try {
      const response = await fetch("/api/sync/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: pending.map((mutation) => ({
            id: mutation.id,
            type: mutation.type,
            payload: mutation.payload,
            clientTimestamp: mutation.clientTimestamp,
          })),
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: OfflineSyncBatchResponse;
        error?: string;
      };

      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Sync failed.");
      }

      const appliedIds = result.data.applied.map((entry) => entry.mutationId);
      await this.removeMutations(appliedIds);

      await Promise.all(
        result.data.failed.map((failure) =>
          this.markMutationFailed(failure.mutationId, failure.error),
        ),
      );

      const unresolvedIds = pendingIds.filter(
        (id) =>
          !appliedIds.includes(id) &&
          !result.data!.failed.some((failure) => failure.mutationId === id),
      );
      await this.resetSyncingMutations(unresolvedIds);

      await this.setLastSyncedAt(new Date().toISOString());
      return {
        ...result.data,
        aggregatedGamification: aggregateSyncGamification(result.data.applied),
      };
    } catch (error) {
      await this.resetSyncingMutations(pendingIds);
      throw error;
    }
  }

  async prefetchAudio(url: string): Promise<void> {
    if (!url || !isBrowserOnline()) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const blob = await response.blob();
      await this.cacheAudio(url, blob);
    } catch {
      // Audio prefetch is best-effort.
    }
  }

  async prefetchAudioBatch(urls: string[]): Promise<void> {
    await Promise.all(urls.map((url) => this.prefetchAudio(url)));
  }

  async cacheGameSession(
    slug: string,
    session: GameSessionViewModel,
  ): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.meta, {
      key: `game-session:${slug}`,
      value: JSON.stringify(session),
      updatedAt: new Date().toISOString(),
    });
  }

  async getCachedGameSession(
    slug: string,
  ): Promise<GameSessionViewModel | null> {
    const db = await getOfflineDb();
    const record = await db.get(OFFLINE_STORES.meta, `game-session:${slug}`);
    if (!record?.value) return null;
    try {
      return JSON.parse(record.value) as GameSessionViewModel;
    } catch {
      return null;
    }
  }

  async cacheTrialSession(session: TrialSessionViewModel): Promise<void> {
    const db = await getOfflineDb();
    await db.put(OFFLINE_STORES.meta, {
      key: `trial-session:${session.slug}`,
      value: JSON.stringify(session),
      updatedAt: new Date().toISOString(),
    });
  }

  async getCachedTrialSession(
    slug: string,
  ): Promise<TrialSessionViewModel | null> {
    const db = await getOfflineDb();
    const record = await db.get(OFFLINE_STORES.meta, `trial-session:${slug}`);
    if (!record?.value) return null;
    try {
      return JSON.parse(record.value) as TrialSessionViewModel;
    } catch {
      return null;
    }
  }

  async saveReadingProgress(input: {
    contentType: "story" | "dialogue";
    contentId: string;
    status: "in_progress" | "completed";
    score: number;
  }): Promise<{ saved: boolean; score: number; queuedOffline: boolean }> {
    if (isBrowserOnline()) {
      try {
        const response = await fetch("/api/reading/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: { saved: boolean; score?: number };
        };
        if (!result.success) {
          throw new Error(result.error ?? "Failed to save reading progress.");
        }
        return {
          saved: true,
          score: result.data?.score ?? input.score,
          queuedOffline: false,
        };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    await this.enqueueMutation({
      type: "reading_progress",
      payload: input satisfies OfflineReadingProgressPayload,
    });

    return { saved: true, score: input.score, queuedOffline: true };
  }

  async saveListeningProgress(input: {
    contentType: "exercise" | "challenge";
    contentId: string;
    status: "in_progress" | "completed";
    score: number;
  }): Promise<{ saved: boolean; score: number; queuedOffline: boolean }> {
    if (isBrowserOnline()) {
      try {
        const response = await fetch("/api/listening/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: { saved: boolean; score?: number };
        };
        if (!result.success) {
          throw new Error(result.error ?? "Failed to save listening progress.");
        }
        return {
          saved: true,
          score: result.data?.score ?? input.score,
          queuedOffline: false,
        };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    await this.enqueueMutation({
      type: "listening_progress",
      payload: input satisfies OfflineListeningProgressPayload,
    });

    return { saved: true, score: input.score, queuedOffline: true };
  }

  async completeGame(input: {
    slug: string;
    correctCount: number;
    totalCount: number;
    wrongAttempts?: number;
    durationMs?: number;
  }): Promise<{ result: GameCompleteViewModel; queuedOffline: boolean }> {
    if (isBrowserOnline()) {
      try {
        const response = await fetch(`/api/games/${input.slug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correctCount: input.correctCount,
            totalCount: input.totalCount,
            wrongAttempts: input.wrongAttempts,
            durationMs: input.durationMs,
          }),
        });
        const payload = (await response.json()) as {
          success: boolean;
          data?: GameCompleteViewModel;
          error?: string;
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Failed to save game results.");
        }
        return { result: payload.data, queuedOffline: false };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    await this.enqueueMutation({
      type: "game_complete",
      payload: input satisfies OfflineGameCompletePayload,
    });

    const accuracyPercent = Math.round(
      (input.correctCount / Math.max(input.totalCount, 1)) * 100,
    );

    return {
      result: {
        slug: input.slug as GameCompleteViewModel["slug"],
        accuracyPercent,
        epAwarded: 0,
        elevation: null,
        quests: [],
      },
      queuedOffline: true,
    };
  }

  async completeTrial(input: {
    slug: string;
    correctCount: number;
    totalCount: number;
    timeSpentSeconds: number;
    startedAt: string;
  }): Promise<{ result: TrialCompleteViewModel; queuedOffline: boolean }> {
    if (isBrowserOnline()) {
      try {
        const response = await fetch(`/api/trials/${input.slug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const payload = (await response.json()) as {
          success: boolean;
          data?: TrialCompleteViewModel;
          error?: string;
        };
        if (!payload.success || !payload.data) {
          throw new Error(payload.error ?? "Failed to save trial results.");
        }
        return { result: payload.data, queuedOffline: false };
      } catch (error) {
        if (!isOfflineFetchFailure(error)) throw error;
      }
    }

    await this.enqueueMutation({
      type: "trial_complete",
      payload: input satisfies OfflineTrialCompletePayload,
    });

    const cachedSession = await this.getCachedTrialSession(input.slug);
    const totalCount = Math.max(input.totalCount, 1);
    const scorePercent = Math.round((input.correctCount / totalCount) * 100);
    const passScore = cachedSession?.passScore ?? 70;
    const passed = scorePercent >= passScore;
    const grade = computeTrialGrade(scorePercent, passed);

    return {
      result: {
        passed,
        scorePercent,
        grade,
        epAwarded: null,
        elevation: null,
        achievements: [],
        quests: [],
        reviewRecommendations: [],
        progress: cachedSession?.progress ?? {
          bestScore: scorePercent,
          bestGrade: grade,
          passed,
          passedAt: passed ? new Date().toISOString() : null,
          attemptCount: 1,
        },
      },
      queuedOffline: true,
    };
  }
}

export const offlineClient = new OfflineClientService();
