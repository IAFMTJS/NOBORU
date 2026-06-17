import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { dailyChallengeService } from "@/features/daily-challenges/services/daily-challenge.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as {
      correctCount?: number;
      totalCount?: number;
      vocabularyIds?: string[];
      correctVocabularyIds?: string[];
      clientEventId?: string;
    };

    if (
      body.correctCount === undefined ||
      body.totalCount === undefined ||
      !Array.isArray(body.vocabularyIds) ||
      !Array.isArray(body.correctVocabularyIds)
    ) {
      return jsonError("Daily challenge completion payload is incomplete.", 400);
    }

    const data = await dailyChallengeService.completeRetentionSession(
      session.userId,
      {
        correctCount: body.correctCount,
        totalCount: body.totalCount,
        vocabularyIds: body.vocabularyIds,
        correctVocabularyIds: body.correctVocabularyIds,
        clientEventId: body.clientEventId?.trim() || undefined,
      },
    );

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to complete daily challenge.",
      400,
    );
  }
}
