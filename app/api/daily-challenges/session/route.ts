import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { dailyChallengeService } from "@/features/daily-challenges/services/daily-challenge.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const data = await dailyChallengeService.getRetentionSession(session.userId);
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load daily challenge.",
      400,
    );
  }
}
