import { settingsRepository } from "@/features/settings/repositories/settings.repository";
import type {
  ThemePreference,
  UpdateThemeInput,
} from "@/features/settings/types/settings.types";

class SettingsService {
  async updateTheme(
    input: UpdateThemeInput,
  ): Promise<{ theme: ThemePreference }> {
    const settings = await settingsRepository.updateThemeForCurrentUser(
      input.theme,
    );

    return { theme: settings.preferred_theme };
  }
}

export const settingsService = new SettingsService();
