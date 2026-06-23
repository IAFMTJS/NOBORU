import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { reviewServerService } from "@/features/review/services/review-server.service";
import type { ReviewBatchSubmitItem, ReviewRating } from "@/features/review/types/review.types";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = checkRateLimit(rateLimitKey(session.userId, "review-submit-batch"), 120, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many review submissions. Please wait a moment.", 429);
  }

  try {
    const body = (await request.json()) as {
      items?: Array<{
        reviewItemId?: string;
        rating?: ReviewRating;
        clientEventId?: string;
      }>;
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return jsonError("At least one review rating is required.", 400);
    }

    const items: ReviewBatchSubmitItem[] = body.items.map((item, index) => {
      if (!item.reviewItemId || !item.rating) {
        throw new Error(`Review item ${index + 1} is missing required fields.`);
      }

      return {
        reviewItemId: item.reviewItemId,
        rating: item.rating,
        clientEventId: item.clientEventId?.trim() || crypto.randomUUID(),
      };
    });

    const data = await reviewServerService.submitReviewBatch(session.userId, items);

    if (data.gamificationJobs.length > 0) {
      void reviewServerService
        .processReviewGamificationBatch({
          userId: session.userId,
          jobs: data.gamificationJobs,
        })
        .catch((caught) => {
          console.error("Deferred batch review gamification failed.", caught);
        });
    }

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to submit review batch.",
      400,
    );
  }
}
