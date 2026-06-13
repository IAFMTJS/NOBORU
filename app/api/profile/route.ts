import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";

export async function PATCH(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as { displayName?: string };
    const displayName = body.displayName?.trim();

    if (!displayName) {
      return jsonError("Display name is required.", 400);
    }

    const profile = await profileServerRepository.updateDisplayName(
      session.userId,
      displayName,
    );

    return jsonOk({ displayName: profile.display_name });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to update profile.",
      400,
    );
  }
}
