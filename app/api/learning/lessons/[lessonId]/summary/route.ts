import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { lessonService } from "@/features/learning/services/lesson.service";

type RouteParams = { params: Promise<{ lessonId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { lessonId } = await params;

  try {
    const summary = await lessonService.getLessonSummary(
      lessonId,
      session.userId,
    );
    if (!summary) return notFound("Lesson not found.");
    return jsonOk(summary);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load lesson summary.",
      500,
    );
  }
}
