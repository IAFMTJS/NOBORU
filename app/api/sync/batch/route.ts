import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { offlineSyncServerService } from "@/features/offline/services/sync-server.service";
import type { OfflineSyncBatchRequest } from "@/lib/offline/types";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = await checkRateLimit(rateLimitKey(session.userId, "sync-batch"), 60, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many sync requests. Please wait a moment.", 429);
  }

  try {
    const body = (await request.json()) as OfflineSyncBatchRequest;
    if (!Array.isArray(body.mutations)) {
      return jsonError("Mutations array is required.", 400);
    }

    const data = await offlineSyncServerService.applyBatch(
      session.userId,
      body,
    );
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to sync offline changes.",
      400,
    );
  }
}
