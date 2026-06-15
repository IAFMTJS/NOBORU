import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";
import type { ThemePreference } from "@/features/settings/types/settings.types";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];
const LANGUAGE_OPTIONS = ["ja", "en"] as const;

export async function PATCH(request: Request) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  try {
    const body = (await request.json()) as {
      theme?: ThemePreference;
      soundEnabled?: boolean;
      notificationsEnabled?: boolean;
      preferredLanguage?: string;
    };

    if (body.theme) {
      if (!THEME_OPTIONS.includes(body.theme)) {
        return jsonError("A valid theme preference is required.", 400);
      }
      const settings = await settingsServerRepository.updateTheme(
        session.userId,
        body.theme,
      );
      return jsonOk({ theme: settings.preferred_theme });
    }

    const preferencePatch: {
      sound_enabled?: boolean;
      notifications_enabled?: boolean;
      preferred_language?: string;
    } = {};

    if (typeof body.soundEnabled === "boolean") {
      preferencePatch.sound_enabled = body.soundEnabled;
    }
    if (typeof body.notificationsEnabled === "boolean") {
      preferencePatch.notifications_enabled = body.notificationsEnabled;
    }
    if (body.preferredLanguage) {
      if (!LANGUAGE_OPTIONS.includes(body.preferredLanguage as (typeof LANGUAGE_OPTIONS)[number])) {
        return jsonError("A valid language preference is required.", 400);
      }
      preferencePatch.preferred_language = body.preferredLanguage;
    }

    if (Object.keys(preferencePatch).length === 0) {
      return jsonError("No valid settings fields provided.", 400);
    }

    const settings = await settingsServerRepository.updatePreferences(
      session.userId,
      preferencePatch,
    );

    return jsonOk({
      soundEnabled: settings.sound_enabled,
      notificationsEnabled: settings.notifications_enabled,
      preferredLanguage: settings.preferred_language,
    });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to update settings.",
      400,
    );
  }
}
