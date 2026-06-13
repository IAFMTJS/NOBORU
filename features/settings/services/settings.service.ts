import type {
  ThemePreference,
  UpdateThemeInput,
} from "@/features/settings/types/settings.types";

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
}

export const settingsService = new SettingsService();
