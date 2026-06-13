import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { reviewServerService } from "@/features/review/services/review-server.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as {
      clientEventId?: string;
      reviewItemId?: string;
      rating?: "again" | "good" | "strong";
    };

    if (!body.clientEventId) {
      return jsonError("Client event ID is required.", 400);
    }

    let result = await reviewServerService.getGamificationResult(
      session.userId,
      body.clientEventId,
    );

    if (
      !result.ready &&
      body.reviewItemId &&
      body.rating
    ) {
      result = await reviewServerService.processReviewGamification({
        userId: session.userId,
        reviewItemId: body.reviewItemId,
        rating: body.rating,
        clientEventId: body.clientEventId,
      });
    }

    return jsonOk(result);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load gamification.",
      400,
    );
  }
}
