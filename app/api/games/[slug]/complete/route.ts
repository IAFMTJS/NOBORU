import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { isPlayableGameSlug } from "@/features/games/constants/game.constants";
import { gameService } from "@/features/games/services/game.service";

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { slug } = await params;
  if (!isPlayableGameSlug(slug)) {
    return jsonError("Unknown game.", 404);
  }

  const limit = await checkRateLimit(rateLimitKey(session.userId, "game-complete"), 90, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many game submissions. Please wait a moment.", 429);
  }

  try {
    const body = (await request.json()) as {
      correctCount?: number;
      totalCount?: number;
      wrongAttempts?: number;
      durationMs?: number;
    };

    if (body.correctCount === undefined || body.totalCount === undefined) {
      return jsonError("Game result payload is incomplete.", 400);
    }

    const data = await gameService.completeGame(session.userId, slug, {
      correctCount: body.correctCount,
      totalCount: body.totalCount,
      wrongAttempts: body.wrongAttempts,
      durationMs: body.durationMs,
    });

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to complete game.",
      400,
    );
  }
}
