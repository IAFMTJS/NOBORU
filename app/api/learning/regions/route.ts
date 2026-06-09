import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { learningPathService } from "@/features/learning/services/learning-path.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const data = await learningPathService.getLearningPath(session.userId);
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load learning path.",
      500,
    );
  }
}
