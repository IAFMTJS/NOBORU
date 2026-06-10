import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { OFFLINE_REVIEW_CACHE_LIMIT } from "@/lib/offline/constants";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const data = await reviewServerService.getOfflineBundle(
      session.userId,
      OFFLINE_REVIEW_CACHE_LIMIT,
    );
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load review session.",
      400,
    );
  }
}
