import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { intakeService } from "@/features/intake/services/intake.service";
import type { SaveIntakeInput } from "@/features/intake/types/intake.types";

function parseBody(body: unknown): SaveIntakeInput | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const hiraganaIds = record.hiraganaIds;
  const katakanaIds = record.katakanaIds;
  const vocabularyIds = record.vocabularyIds;

  if (
    !Array.isArray(hiraganaIds) ||
    !Array.isArray(katakanaIds) ||
    !Array.isArray(vocabularyIds)
  ) {
    return null;
  }

  const isStringArray = (value: unknown[]) =>
    value.every((item) => typeof item === "string");

  if (
    !isStringArray(hiraganaIds) ||
    !isStringArray(katakanaIds) ||
    !isStringArray(vocabularyIds)
  ) {
    return null;
  }

  return {
    hiraganaIds,
    katakanaIds,
    vocabularyIds,
  };
}

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const input = parseBody(body);
  if (!input) {
    return jsonError("Invalid intake payload.", 400);
  }

  if (
    input.hiraganaIds.length + input.katakanaIds.length + input.vocabularyIds.length ===
    0
  ) {
    return jsonError("Select at least one kana or word.", 400);
  }

  const result = await intakeService.saveIntake(session.userId, input);
  if (!result.success) {
    return jsonError(result.error ?? "Unable to save intake.", 400);
  }

  return jsonOk({ seededCount: result.seededCount ?? 0 });
}
