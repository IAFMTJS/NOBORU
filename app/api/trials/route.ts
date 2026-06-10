import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { trialService } from "@/features/trials/services/trial.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const [trials, performance] = await Promise.all([
      trialService.listTrials(session.userId),
      trialService.getPerformance(session.userId),
    ]);
    return jsonOk({ trials, performance });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load trials.",
      400,
    );
  }
}
