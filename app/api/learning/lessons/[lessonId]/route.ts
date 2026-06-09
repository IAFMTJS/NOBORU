import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { lessonService } from "@/features/learning/services/lesson.service";
import { progressService } from "@/features/learning/services/progress.service";

type RouteParams = { params: Promise<{ lessonId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { lessonId } = await params;

  try {
    const data = await lessonService.getLessonSession(lessonId, session.userId);
    if (!data) return notFound("Lesson not found.");
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load lesson.",
      500,
    );
  }
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { lessonId } = await params;

  try {
    const progress = await progressService.startLesson({
      userId: session.userId,
      lessonId,
    });
    return jsonOk(progress, 201);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to start lesson.",
      400,
    );
  }
}
