import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { isPlayableGameSlug } from "@/features/games/constants/game.constants";
import { gameService } from "@/features/games/services/game.service";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { slug } = await params;
  if (!isPlayableGameSlug(slug)) {
    return jsonError("Unknown game.", 404);
  }

  try {
    const weakOnly =
      new URL(request.url).searchParams.get("weakOnly") === "true";
    const data = await gameService.getSession(session.userId, slug, {
      weakOnly,
    });
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load game.",
      400,
    );
  }
}
