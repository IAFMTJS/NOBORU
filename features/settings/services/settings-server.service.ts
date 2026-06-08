import { authServerRepository } from "@/features/authentication/repositories/auth-server.repository";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";
import type {
  SettingsViewModel,
  ThemePreference,
} from "@/features/settings/types/settings.types";

function mapSettingsToViewModel(
  settings: {
    preferred_theme: ThemePreference;
    daily_goal: number;
    notifications_enabled: boolean;
    sound_enabled: boolean;
    preferred_language: string;
  },
  email: string,
): SettingsViewModel {
  return {
    email,
    theme: settings.preferred_theme,
    dailyGoalMinutes: settings.daily_goal,
    notificationsEnabled: settings.notifications_enabled,
    soundEnabled: settings.sound_enabled,
    preferredLanguage: settings.preferred_language,
  };
}

class SettingsServerService {
  async getSettings(): Promise<SettingsViewModel | null> {
    const user = await authServerRepository.getUser();
    if (!user) {
      return null;
    }

    const settings = await settingsServerRepository.ensureSettings(user.id);
    return mapSettingsToViewModel(settings, user.email ?? "");
  }
}

export const settingsServerService = new SettingsServerService();
