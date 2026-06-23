import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { shopServerService } from "@/features/shop/services/shop-server.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = checkRateLimit(rateLimitKey(session.userId, "shop-purchase"), 30, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many purchase attempts. Please wait a moment.", 429);
  }

  try {
    const body = (await request.json()) as { itemId?: string };
    if (!body.itemId?.trim()) {
      return jsonError("Item ID is required.", 400);
    }

    const result = await shopServerService.purchase(session.userId, body.itemId.trim());
    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonOk(result);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to complete purchase.",
      400,
    );
  }
}
