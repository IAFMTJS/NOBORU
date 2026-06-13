import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { friendsService } from "@/features/friends/services/friends.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const dashboard = await friendsService.getDashboard(session.userId);
  return jsonOk(dashboard);
}
