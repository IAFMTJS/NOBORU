import { unstable_cache } from "next/cache";

import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import {
  userElevationCacheTag,
  userProgressCacheTag,
  userQuestCacheTag,
  userReviewStatsCacheTag,
} from "@/lib/cache/revalidate-user-data";

const USER_DATA_CACHE_SECONDS = 45;

export function getCrossRequestElevationSummary(userId: string) {
  return unstable_cache(
    () => elevationService.getSummary(userId),
    ["user-elevation-summary", userId],
    {
      revalidate: USER_DATA_CACHE_SECONDS,
      tags: [userElevationCacheTag(userId)],
    },
  )();
}

export function getCrossRequestReviewStats(userId: string) {
  return unstable_cache(
    () => reviewServerService.getStats(userId),
    ["user-review-stats", userId],
    {
      revalidate: USER_DATA_CACHE_SECONDS,
      tags: [userReviewStatsCacheTag(userId)],
    },
  )();
}

export function getCrossRequestQuestDashboard(userId: string) {
  return unstable_cache(
    () => questService.getQuestDashboard(userId),
    ["user-quest-dashboard", userId],
    {
      revalidate: USER_DATA_CACHE_SECONDS,
      tags: [userQuestCacheTag(userId)],
    },
  )();
}

export function getCrossRequestProgressRows(userId: string) {
  return unstable_cache(
    () => getCachedProgressRows(userId),
    ["user-progress-rows", userId],
    {
      revalidate: USER_DATA_CACHE_SECONDS,
      tags: [userProgressCacheTag(userId)],
    },
  )();
}
