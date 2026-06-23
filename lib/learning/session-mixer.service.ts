import {
  REVIEW_CONTENT_RATIO,
} from "@/lib/learning/learning-architecture.constants";
import type { SessionMixCounts } from "@/lib/learning/learning-architecture.types";

export function computeSessionMixCounts(totalCount: number): SessionMixCounts {
  if (totalCount <= 0) {
    return { total: 0, review: 0, new: 0 };
  }

  const review = Math.floor(totalCount * REVIEW_CONTENT_RATIO);
  const clampedReview = Math.min(review, totalCount);
  const newCount = totalCount - clampedReview;

  return {
    total: totalCount,
    review: clampedReview,
    new: newCount,
  };
}

export type SessionMixItem = {
  id: string;
  isReview: boolean;
};

/**
 * Mixes review and new items at approximately 70% / 30% for a learning session.
 * Preserves input order within each bucket; interleaves review-first for retention.
 */
export function mixSessionItems<T extends SessionMixItem>(
  reviewItems: T[],
  newItems: T[],
  totalCount: number,
): T[] {
  const counts = computeSessionMixCounts(totalCount);
  const selectedReview = reviewItems.slice(0, counts.review);
  const selectedNew = newItems.slice(0, counts.new);

  const mixed: T[] = [];
  let reviewIndex = 0;
  let newIndex = 0;

  while (
    mixed.length < totalCount &&
    (reviewIndex < selectedReview.length || newIndex < selectedNew.length)
  ) {
    const reviewRemaining = selectedReview.length - reviewIndex;
    const newRemaining = selectedNew.length - newIndex;
    const slotsRemaining = totalCount - mixed.length;

    const preferReview =
      reviewRemaining > 0 &&
      (newRemaining === 0 ||
        reviewRemaining / Math.max(slotsRemaining, 1) >= REVIEW_CONTENT_RATIO);

    if (preferReview) {
      mixed.push(selectedReview[reviewIndex]!);
      reviewIndex += 1;
    } else if (newRemaining > 0) {
      mixed.push(selectedNew[newIndex]!);
      newIndex += 1;
    } else {
      mixed.push(selectedReview[reviewIndex]!);
      reviewIndex += 1;
    }
  }

  return mixed;
}
