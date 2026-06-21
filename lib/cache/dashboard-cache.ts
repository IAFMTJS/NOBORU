import { unstable_cache } from "next/cache";
import { cache } from "react";

import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";
import { reviewServerService } from "@/features/review/services/review-server.service";
import {
  userElevationCacheTag,
  userQuestCacheTag,
  userReviewStatsCacheTag,
} from "@/lib/cache/revalidate-user-data";

const USER_DASHBOARD_REVALIDATE_SECONDS = 30;

export const getCachedElevationSummary = cache((userId: string) =>
  unstable_cache(
    () => elevationService.getSummary(userId),
    ["user-elevation-summary", userId],
    {
      tags: [userElevationCacheTag(userId)],
      revalidate: USER_DASHBOARD_REVALIDATE_SECONDS,
    },
  )(),
);

export const getCachedReviewStats = cache((userId: string) =>
  unstable_cache(
    () => reviewServerService.getStats(userId),
    ["user-review-stats", userId],
    {
      tags: [userReviewStatsCacheTag(userId)],
      revalidate: USER_DASHBOARD_REVALIDATE_SECONDS,
    },
  )(),
);

export const getCachedQuestDashboard = cache((userId: string) =>
  unstable_cache(
    () => questService.getQuestDashboard(userId),
    ["user-quest-dashboard", userId],
    {
      tags: [userQuestCacheTag(userId)],
      revalidate: USER_DASHBOARD_REVALIDATE_SECONDS,
    },
  )(),
);
