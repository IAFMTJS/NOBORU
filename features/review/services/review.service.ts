import { PLACEHOLDER_REVIEW_CARD } from "@/features/review/constants/placeholder-review";
import type { ReviewCardViewModel } from "@/features/review/types/review.types";

class ReviewService {
  async getCurrentCard(): Promise<ReviewCardViewModel> {
    return PLACEHOLDER_REVIEW_CARD;
  }
}

export const reviewService = new ReviewService();
