import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { leagueService } from "@/features/leagues/services/league.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const dashboard = await leagueService.getDashboard(session.userId);
  return jsonOk(dashboard);
}

export async function POST() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const dashboard = await leagueService.optIn(session.userId);
  return jsonOk(dashboard);
}
