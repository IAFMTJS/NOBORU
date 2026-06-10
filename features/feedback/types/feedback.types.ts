export const FEEDBACK_CATEGORIES = [
  "bug",
  "trail_ux",
  "lesson_ux",
  "audio",
  "pwa",
  "content",
  "other",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_STATUSES = ["new", "reviewed", "resolved"] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export type FeedbackRow = {
  id: string;
  user_id: string;
  category: FeedbackCategory;
  rating: number | null;
  message: string;
  route: string | null;
  context: Record<string, unknown> | null;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
};

export type SubmitFeedbackInput = {
  category: FeedbackCategory;
  message: string;
  rating?: number | null;
  route?: string | null;
  context?: Record<string, unknown> | null;
};

export type FeedbackListEntryViewModel = {
  id: string;
  category: FeedbackCategory;
  categoryLabel: string;
  rating: number | null;
  message: string;
  route: string | null;
  status: FeedbackStatus;
  createdAt: string;
};

export type FeedbackFormDefaults = {
  category?: FeedbackCategory;
  route?: string | null;
  context?: Record<string, unknown> | null;
  rating?: number | null;
};
