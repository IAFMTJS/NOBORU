import { cache } from "react";

import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";
import { reviewServerService } from "@/features/review/services/review-server.service";

export const getCachedElevationSummary = cache((userId: string) =>
  elevationService.getSummary(userId),
);

export const getCachedReviewStats = cache((userId: string) =>
  reviewServerService.getStats(userId),
);

export const getCachedQuestDashboard = cache((userId: string) =>
  questService.getQuestDashboard(userId),
);
