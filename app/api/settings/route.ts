import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";
import type { ThemePreference } from "@/features/settings/types/settings.types";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];

export async function PATCH(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as { theme?: ThemePreference };

    if (!body.theme || !THEME_OPTIONS.includes(body.theme)) {
      return jsonError("A valid theme preference is required.", 400);
    }

    const settings = await settingsServerRepository.updateTheme(
      session.userId,
      body.theme,
    );

    return jsonOk({ theme: settings.preferred_theme });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to update settings.",
      400,
    );
  }
}
