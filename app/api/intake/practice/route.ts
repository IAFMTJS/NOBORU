import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { intakeService } from "@/features/intake/services/intake.service";
import type { IntakePracticeMode } from "@/features/intake/types/intake.types";

function parseMode(value: string | null): IntakePracticeMode | null {
  if (value === "reinforce" || value === "grow") return value;
  return null;
}

export async function GET(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const mode = parseMode(new URL(request.url).searchParams.get("mode"));
  if (!mode) {
    return jsonError("Practice mode must be reinforce or grow.", 400);
  }

  try {
    const data = await intakeService.getPracticeSession(session.userId, mode);
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load practice.",
      400,
    );
  }
}
