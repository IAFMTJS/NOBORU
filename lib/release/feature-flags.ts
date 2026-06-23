/**
 * Learner feature gates — flip when backend is wired (see remediation plan Phase 6).
 */
export const FEATURE_FLAGS = {
  /** Friends + leaderboard use real league service when true. */
  socialLeagues: true,
  /** Inventory uses live DB rows when true. */
  liveInventory: false,
  /** Memory book uses live collections when true. */
  liveMemoryBook: false,
  /** In-app notifications use live feed when true. */
  liveNotifications: false,
} as const;
