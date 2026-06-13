import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { titleService } from "@/features/profile/services/title.service";

export async function GET() {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const titles = await titleService.listTitles(session.userId);
  return jsonOk(titles);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as { titleId?: string };
    if (!body.titleId) {
      return jsonError("titleId is required.", 400);
    }

    const titles = await titleService.equipTitle(session.userId, body.titleId);
    return jsonOk(titles);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to equip title.",
      400,
    );
  }
}
