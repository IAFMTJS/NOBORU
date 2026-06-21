import { cache } from "react";

import { progressRepository } from "@/features/learning/repositories/learning-path.repository";

/** Per-request dedupe for progress reads. Do not wrap in unstable_cache — repository uses the cookie-backed Supabase client. */
export const getCachedProgressRows = cache((userId: string) =>
  progressRepository.listByUserId(userId),
);
