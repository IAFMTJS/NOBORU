import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { chestService } from "@/features/chests/services/chest.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const chests = await chestService.listEligible(session.userId);
    return jsonOk({ chests });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load chests.",
      400,
    );
  }
}
