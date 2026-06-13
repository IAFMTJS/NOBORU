import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { chestService } from "@/features/chests/services/chest.service";

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as {
      chestSlug?: string;
      claimPeriodKey?: string;
    };

    if (!body.chestSlug) {
      return jsonError("chestSlug is required.", 400);
    }

    const data = await chestService.claimChest(
      session.userId,
      body.chestSlug,
      body.claimPeriodKey,
    );
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to claim chest.",
      400,
    );
  }
}
