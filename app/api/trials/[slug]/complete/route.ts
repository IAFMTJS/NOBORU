import { jsonError, jsonOk } from "@/lib/api/responses";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { requireAuthSession } from "@/lib/auth/require-session";
import { trialService } from "@/features/trials/services/trial.service";

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const limit = checkRateLimit(rateLimitKey(session.userId, "trial-complete"), 30, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many requests. Try again shortly.", 429);
  }

  const { slug } = await params;

  try {
    const body = (await request.json()) as {
      correctCount?: number;
      totalCount?: number;
      timeSpentSeconds?: number;
      startedAt?: string;
    };

    if (
      body.correctCount === undefined ||
      body.totalCount === undefined ||
      !body.startedAt
    ) {
      return jsonError("Trial result payload is incomplete.", 400);
    }

    const data = await trialService.completeTrial(session.userId, slug, {
      correctCount: body.correctCount,
      totalCount: body.totalCount,
      timeSpentSeconds: body.timeSpentSeconds ?? 0,
      startedAt: body.startedAt,
    });

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to complete trial.",
      400,
    );
  }
}
