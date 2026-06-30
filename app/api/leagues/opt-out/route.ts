import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { leagueService } from "@/features/leagues/services/league.service";

export async function POST() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = await checkRateLimit(rateLimitKey(session.userId, "leagues-opt-out"), 10, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many requests. Try again shortly.", 429);
  }

  const dashboard = await leagueService.optOut(session.userId);
  return jsonOk(dashboard);
}
