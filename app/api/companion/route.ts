import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { companionService } from "@/features/companion/services/companion.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const companion = await companionService.getCompanion(session.userId);
  return jsonOk(companion);
}
