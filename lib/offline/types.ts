import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type { GameCompleteViewModel } from "@/features/games/types/game.types";
import type { LessonSessionViewModel } from "@/features/learning/types/lesson.types";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import type {
  ReviewCardViewModel,
  ReviewRating,
  ReviewSessionViewModel,
} from "@/features/review/types/review.types";
import type { TrialCompleteViewModel } from "@/features/trials/types/trial.types";
import type { OFFLINE_SYNC_MUTATION_TYPES } from "@/lib/offline/constants";

export type OfflineSyncMutationType =
  (typeof OFFLINE_SYNC_MUTATION_TYPES)[number];

export type OfflineSyncStatus = "pending" | "syncing" | "failed";

export type OfflineLessonStartPayload = {
  lessonId: string;
};

export type OfflineLessonCompletePayload = {
  lessonId: string;
  score: number;
};

export type OfflineReviewSubmitPayload = {
  reviewItemId: string;
  rating: ReviewRating;
  clientEventId: string;
};

export type OfflineReadingProgressPayload = {
  contentType: "story" | "dialogue";
  contentId: string;
  status: "in_progress" | "completed";
  score: number;
};

export type OfflineListeningProgressPayload = {
  contentType: "exercise" | "challenge";
  contentId: string;
  status: "in_progress" | "completed";
  score: number;
};

export type OfflineGameCompletePayload = {
  slug: string;
  correctCount: number;
  totalCount: number;
  wrongAttempts?: number;
  durationMs?: number;
};

export type OfflineTrialCompletePayload = {
  slug: string;
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
  startedAt: string;
};

export type OfflineSyncPayload =
  | OfflineLessonStartPayload
  | OfflineLessonCompletePayload
  | OfflineReviewSubmitPayload
  | OfflineReadingProgressPayload
  | OfflineListeningProgressPayload
  | OfflineGameCompletePayload
  | OfflineTrialCompletePayload;

export type OfflineSyncMutation = {
  id: string;
  type: OfflineSyncMutationType;
  payload: OfflineSyncPayload;
  clientTimestamp: string;
  status: OfflineSyncStatus;
  retryCount: number;
  lastError: string | null;
  createdAt: string;
};

export type OfflineLessonRecord = {
  lessonId: string;
  session: LessonSessionViewModel;
  cachedAt: string;
};

export type OfflineReviewBundle = {
  userId: string;
  session: ReviewSessionViewModel;
  dueCards: ReviewCardViewModel[];
  cachedAt: string;
};

export type OfflineAudioRecord = {
  url: string;
  blob: Blob;
  cachedAt: string;
};

export type OfflineMetaRecord = {
  key: string;
  value: string;
  updatedAt: string;
};

export type OfflineSyncConflictResolution =
  | "applied"
  | "already_applied"
  | "server_wins"
  | "merged";

export type OfflineSyncGamificationResult = {
  elevation: ElevationAwardViewModel | null;
  achievements: AchievementUnlockViewModel[];
  quests: QuestCompletionViewModel[];
};

export type OfflineSyncResultItem = {
  mutationId: string;
  resolution: OfflineSyncConflictResolution;
  message?: string;
  gamification?: OfflineSyncGamificationResult;
  gameComplete?: GameCompleteViewModel;
  trialComplete?: TrialCompleteViewModel;
};

export type OfflineSyncBatchRequest = {
  mutations: Array<{
    id: string;
    type: OfflineSyncMutationType;
    payload: OfflineSyncPayload;
    clientTimestamp: string;
  }>;
};

export type OfflineSyncBatchResponse = {
  applied: OfflineSyncResultItem[];
  failed: Array<{ mutationId: string; error: string }>;
  pendingCount: number;
  aggregatedGamification?: OfflineSyncGamificationResult | null;
};

export type OfflineStatusViewModel = {
  isOnline: boolean;
  pendingMutations: number;
  cachedLessons: number;
  cachedReviewCards: number;
  cachedAudioFiles: number;
  lastSyncedAt: string | null;
};
