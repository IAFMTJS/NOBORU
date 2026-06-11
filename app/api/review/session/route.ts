import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { OFFLINE_REVIEW_CACHE_LIMIT } from "@/lib/offline/constants";

export async function GET(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const searchParams = new URL(request.url).searchParams;
  const limitParam = searchParams.get("limit");
  const requestedLimit = limitParam ? Number.parseInt(limitParam, 10) : null;
  const cacheLimit =
    requestedLimit && Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, OFFLINE_REVIEW_CACHE_LIMIT)
      : OFFLINE_REVIEW_CACHE_LIMIT;
  const contentType = searchParams.get("contentType") ?? undefined;
  const weakOnly = searchParams.get("weakOnly") === "true";

  try {
    const data = await reviewServerService.getOfflineBundle(
      session.userId,
      cacheLimit,
      { contentType, weakOnly },
    );
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load review session.",
      400,
    );
  }
}
