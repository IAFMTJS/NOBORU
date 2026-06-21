import { unstable_cache } from "next/cache";
import { cache } from "react";

import { progressRepository } from "@/features/learning/repositories/learning-path.repository";
import { userProgressCacheTag } from "@/lib/cache/revalidate-user-data";

const USER_PROGRESS_REVALIDATE_SECONDS = 30;

async function fetchProgressRows(userId: string) {
  return progressRepository.listByUserId(userId);
}

/** Cross-request user progress cache layered with per-request dedupe. */
export const getCachedProgressRows = cache((userId: string) =>
  unstable_cache(
    () => fetchProgressRows(userId),
    ["user-progress", userId],
    {
      tags: [userProgressCacheTag(userId)],
      revalidate: USER_PROGRESS_REVALIDATE_SECONDS,
    },
  )(),
);
