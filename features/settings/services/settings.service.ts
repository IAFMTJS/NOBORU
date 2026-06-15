import type {
  ThemePreference,
  UpdateThemeInput,
} from "@/features/settings/types/settings.types";

type UpdatePreferencesInput = {
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
  preferredLanguage?: string;
};

class SettingsService {
  async updateTheme(
    input: UpdateThemeInput,
  ): Promise<{ theme: ThemePreference }> {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: input.theme }),
    });

    const result = (await response.json()) as {
      success: boolean;
      data?: { theme: ThemePreference };
      error?: string;
    };

    if (!result.success || !result.data) {
      throw new Error(result.error ?? "Unable to update theme.");
    }

    return { theme: result.data.theme };
  }

  async updatePreferences(
    input: UpdatePreferencesInput,
  ): Promise<{
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    preferredLanguage: string;
  }> {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = (await response.json()) as {
      success: boolean;
      data?: {
        soundEnabled: boolean;
        notificationsEnabled: boolean;
        preferredLanguage: string;
      };
      error?: string;
    };

    if (!result.success || !result.data) {
      throw new Error(result.error ?? "Unable to update preferences.");
    }

    return result.data;
  }
}

export const settingsService = new SettingsService();
