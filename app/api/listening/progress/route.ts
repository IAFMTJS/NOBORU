import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = await checkRateLimit(rateLimitKey(session.userId, "listening-progress"), 90, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many requests. Try again shortly.", 429);
  }

  try {
    const body = (await request.json()) as {
      contentType?: "exercise" | "challenge";
      contentId?: string;
      status?: "in_progress" | "completed";
      score?: number;
    };

    if (!body.contentType || !body.contentId) {
      return jsonError("Content type and content ID are required.", 400);
    }

    if (body.status === "in_progress") {
      await listeningProgressService.markInProgress(
        session.userId,
        body.contentType,
        body.contentId,
      );
      return jsonOk({ saved: true });
    }

    const score = body.score ?? 0;

    if (body.contentType === "exercise") {
      await listeningProgressService.saveExerciseProgress(
        session.userId,
        body.contentId,
        score,
      );
    } else {
      await listeningProgressService.saveChallengeProgress(
        session.userId,
        body.contentId,
        score,
      );
    }

    return jsonOk({ saved: true, score });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to save listening progress.",
      400,
    );
  }
}
