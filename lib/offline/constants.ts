export const OFFLINE_DB_NAME = "noboru-offline";
export const OFFLINE_DB_VERSION = 1;

export const OFFLINE_STORES = {
  lessons: "lessons",
  reviewBundles: "review_bundles",
  syncQueue: "sync_queue",
  audio: "audio",
  meta: "meta",
} as const;

export const OFFLINE_SYNC_MUTATION_TYPES = [
  "lesson_start",
  "lesson_complete",
  "review_submit",
] as const;

export const OFFLINE_REVIEW_CACHE_LIMIT = 25;
export const OFFLINE_AUDIO_CACHE_MAX_ENTRIES = 48;
