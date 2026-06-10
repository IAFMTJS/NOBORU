import type { FeedbackCategory } from "@/features/feedback/types/feedback.types";

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: "Bug report",
  trail_ux: "Trail clarity",
  lesson_ux: "Lesson interactivity",
  audio: "Audio playback",
  pwa: "Install / offline / PWA",
  content: "Curriculum content",
  other: "Other feedback",
};

export const FEEDBACK_CATEGORY_HINTS: Record<FeedbackCategory, string> = {
  bug: "Something broke or behaved unexpectedly.",
  trail_ux: "Trail map clarity, locked nodes, or navigation.",
  lesson_ux: "Drills, lesson flow, or completion experience.",
  audio: "Lesson audio, listening exercises, or playback quality.",
  pwa: "Install prompt, offline mode, or sync behavior.",
  content: "Vocabulary, grammar, kanji, reading, or listening content.",
  other: "Anything else about your beta climb.",
};

export const FEEDBACK_STATUS_LABELS = {
  new: "New",
  reviewed: "Reviewed",
  resolved: "Resolved",
} as const;

export const FEEDBACK_MESSAGE_MAX_LENGTH = 2000;
