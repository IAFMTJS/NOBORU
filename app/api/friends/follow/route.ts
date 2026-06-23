import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { friendsService } from "@/features/friends/services/friends.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = checkRateLimit(rateLimitKey(session.userId, "friends-follow"), 60, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many requests. Try again shortly.", 429);
  }

  const body = (await request.json()) as { targetUserId?: string };
  if (!body.targetUserId) {
    return jsonError("targetUserId is required.", 400);
  }
  if (body.targetUserId === session.userId) {
    return jsonError("You cannot follow yourself.", 400);
  }

  await friendsService.follow(session.userId, body.targetUserId);
  const dashboard = await friendsService.getDashboard(session.userId);
  return jsonOk(dashboard);
}
