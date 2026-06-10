import { FEEDBACK_CATEGORY_LABELS } from "@/features/feedback/constants/feedback.constants";
import { feedbackRepository } from "@/features/feedback/repositories/feedback.repository";
import type {
  FeedbackListEntryViewModel,
  SubmitFeedbackInput,
} from "@/features/feedback/types/feedback.types";

function mapFeedbackRow(row: Awaited<ReturnType<typeof feedbackRepository.create>>): FeedbackListEntryViewModel {
  return {
    id: row.id,
    category: row.category,
    categoryLabel: FEEDBACK_CATEGORY_LABELS[row.category],
    rating: row.rating,
    message: row.message,
    route: row.route,
    status: row.status,
    createdAt: row.created_at,
  };
}

class FeedbackService {
  async submit(userId: string, input: SubmitFeedbackInput): Promise<FeedbackListEntryViewModel> {
    const row = await feedbackRepository.create({
      userId,
      category: input.category,
      message: input.message,
      rating: input.rating ?? null,
      route: input.route ?? null,
      context: input.context ?? null,
    });

    return mapFeedbackRow(row);
  }

  async listRecentForAdmin(): Promise<FeedbackListEntryViewModel[]> {
    const rows = await feedbackRepository.listRecent();
    return rows.map(mapFeedbackRow);
  }
}

export const feedbackService = new FeedbackService();
