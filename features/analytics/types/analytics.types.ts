export const ANALYTICS_EVENT_NAMES = [
  "lesson_started",
  "lesson_completed",
  "review_submitted",
  "trial_completed",
  "game_started",
  "game_completed",
  "pwa_install_prompt_accepted",
  "pwa_install_prompt_dismissed",
  "trail_continue_clicked",
  "feedback_submitted",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsEventPayload = {
  name: AnalyticsEventName;
  occurredAt: string;
  properties?: Record<string, string | number | boolean | null>;
};

export type AnalyticsIngestResult = {
  accepted: boolean;
  eventId: string;
};
