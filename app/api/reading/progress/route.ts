import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as {
      contentType?: "story" | "dialogue";
      contentId?: string;
      status?: "in_progress" | "completed";
      score?: number;
    };

    if (!body.contentType || !body.contentId) {
      return jsonError("Content type and content ID are required.", 400);
    }

    if (body.status === "in_progress") {
      await readingProgressService.markInProgress(
        session.userId,
        body.contentType,
        body.contentId,
      );
      return jsonOk({ saved: true });
    }

    const score = body.score ?? 0;

    if (body.contentType === "story") {
      await readingProgressService.saveStoryProgress(
        session.userId,
        body.contentId,
        score,
      );
    } else {
      await readingProgressService.saveDialogueProgress(
        session.userId,
        body.contentId,
        score,
      );
    }

    return jsonOk({ saved: true, score });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to save reading progress.",
      400,
    );
  }
}
