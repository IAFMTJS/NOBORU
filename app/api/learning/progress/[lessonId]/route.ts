import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { progressService } from "@/features/learning/services/progress.service";

type RouteParams = { params: Promise<{ lessonId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { lessonId } = await params;

  try {
    const body = (await request.json()) as { score?: number };
    const data = await progressService.completeLesson({
      userId: session.userId,
      lessonId,
      score: body.score ?? 100,
    });
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to save progress.",
      400,
    );
  }
}
