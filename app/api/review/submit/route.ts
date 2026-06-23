import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { reviewServerService } from "@/features/review/services/review-server.service";
import type { ReviewRating } from "@/features/review/types/review.types";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = checkRateLimit(rateLimitKey(session.userId, "review-submit"), 180, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many review submissions. Please wait a moment.", 429);
  }

  try {
    const body = (await request.json()) as {
      reviewItemId?: string;
      rating?: ReviewRating;
      clientEventId?: string;
    };

    if (!body.reviewItemId || !body.rating) {
      return jsonError("Review item ID and rating are required.", 400);
    }

    const clientEventId = body.clientEventId?.trim() || undefined;
    const data = await reviewServerService.submitReviewFast(
      session.userId,
      body.reviewItemId,
      body.rating,
      clientEventId,
    );

    if (clientEventId && data.gamificationPending) {
      void reviewServerService
        .processReviewGamification({
          userId: session.userId,
          reviewItemId: body.reviewItemId,
          rating: body.rating,
          clientEventId,
        })
        .catch((caught) => {
          console.error("Deferred review gamification failed.", caught);
        });
    }

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to submit review.",
      400,
    );
  }
}
