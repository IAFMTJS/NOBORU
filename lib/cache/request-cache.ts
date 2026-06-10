import { cache } from "react";

import { getAuthSessionUncached } from "@/lib/auth/get-auth-session";
import { getAuthenticatedContextUncached } from "@/features/profile/services/authenticated-context";
import {
  getProfileCoreUncached,
  getProfileWithStatsUncached,
} from "@/features/profile/services/profile-server.uncached";

export type { AuthenticatedContext } from "@/features/profile/services/authenticated-context";

export const getCachedAuthSession = cache(getAuthSessionUncached);

export const getCachedProfileCore = cache(getProfileCoreUncached);

export const getCachedProfileWithStats = cache(getProfileWithStatsUncached);

/** Full profile including summary stats — use on profile page only */
export const getCachedProfile = getCachedProfileWithStats;

export const getCachedAuthenticatedContext = cache(getAuthenticatedContextUncached);
