export type ThemePreference = "light" | "dark" | "system";

export type UserSettingsRow = {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  reduced_motion: boolean;
  high_contrast: boolean;
  daily_goal: number;
  preferred_theme: ThemePreference;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

export type SettingsViewModel = {
  email: string;
  theme: ThemePreference;
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  preferredLanguage: string;
};

export type UpdateThemeInput = {
  theme: ThemePreference;
};
