import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { lessonService } from "@/features/learning/services/lesson.service";

type RouteParams = { params: Promise<{ lessonId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { lessonId } = await params;

  try {
    const labels = await lessonService.getLessonPreviewLabels(
      lessonId,
      session.userId,
    );
    if (labels === null) return notFound("Lesson not found.");
    return jsonOk({ labels });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load lesson preview.",
      500,
    );
  }
}
