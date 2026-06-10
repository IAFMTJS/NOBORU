import { FEEDBACK_MESSAGE_MAX_LENGTH } from "@/features/feedback/constants/feedback.constants";
import {
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
  type SubmitFeedbackInput,
} from "@/features/feedback/types/feedback.types";

export function isFeedbackCategory(value: string): value is FeedbackCategory {
  return FEEDBACK_CATEGORIES.includes(value as FeedbackCategory);
}

export function validateSubmitFeedbackInput(
  input: unknown,
): { ok: true; value: SubmitFeedbackInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Feedback payload must be an object." };
  }

  const candidate = input as Partial<SubmitFeedbackInput>;

  if (!candidate.category || !isFeedbackCategory(candidate.category)) {
    return { ok: false, error: "Select a valid feedback category." };
  }

  if (!candidate.message || typeof candidate.message !== "string") {
    return { ok: false, error: "Feedback message is required." };
  }

  const message = candidate.message.trim();
  if (message.length < 8) {
    return { ok: false, error: "Please share at least 8 characters of feedback." };
  }

  if (message.length > FEEDBACK_MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      error: `Feedback must be ${FEEDBACK_MESSAGE_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (
    candidate.rating !== undefined &&
    candidate.rating !== null &&
    (!Number.isInteger(candidate.rating) ||
      candidate.rating < 1 ||
      candidate.rating > 5)
  ) {
    return { ok: false, error: "Rating must be between 1 and 5." };
  }

  if (candidate.route !== undefined && candidate.route !== null && typeof candidate.route !== "string") {
    return { ok: false, error: "Route must be a string when provided." };
  }

  if (
    candidate.context !== undefined &&
    candidate.context !== null &&
    (typeof candidate.context !== "object" || Array.isArray(candidate.context))
  ) {
    return { ok: false, error: "Context must be an object when provided." };
  }

  return {
    ok: true,
    value: {
      category: candidate.category,
      message,
      rating: candidate.rating ?? null,
      route: candidate.route?.trim() || null,
      context: candidate.context ?? null,
    },
  };
}
