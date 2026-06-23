import { cache } from "react";

import {
  getCrossRequestElevationSummary,
  getCrossRequestQuestDashboard,
  getCrossRequestReviewStats,
} from "@/lib/cache/user-data-cache";

/** Per-request dedupe — delegates to cross-request cache when available. */
export const getCachedElevationSummary = cache((userId: string) =>
  getCrossRequestElevationSummary(userId),
);

export const getCachedReviewStats = cache((userId: string) =>
  getCrossRequestReviewStats(userId),
);

export const getCachedQuestDashboard = cache((userId: string) =>
  getCrossRequestQuestDashboard(userId),
);
