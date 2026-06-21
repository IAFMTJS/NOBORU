import { createClient as createServerClient } from "@/lib/supabase/server";
import { ensureSettings } from "@/lib/supabase/ensure-user-records";

import type {
  ThemePreference,
  UserSettingsRow,
} from "@/features/settings/types/settings.types";

const USER_SETTINGS_COLUMNS =
  "id, user_id, notifications_enabled, sound_enabled, reduced_motion, high_contrast, daily_goal, preferred_theme, preferred_language, created_at, updated_at" as const;

class SettingsServerRepository {
  async findByUserId(userId: string): Promise<UserSettingsRow | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("user_settings")
      .select(USER_SETTINGS_COLUMNS)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow | null;
  }

  async updateTheme(
    userId: string,
    theme: ThemePreference,
  ): Promise<UserSettingsRow> {
    const supabase = await createServerClient();
    await ensureSettings(supabase, { userId, preferredTheme: theme });

    const { data, error } = await supabase
      .from("user_settings")
      .update({ preferred_theme: theme })
      .eq("user_id", userId)
      .select(USER_SETTINGS_COLUMNS)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow;
  }

  async updatePreferences(
    userId: string,
    input: Partial<
      Pick<
        UserSettingsRow,
        "sound_enabled" | "notifications_enabled" | "preferred_language"
      >
    >,
  ): Promise<UserSettingsRow> {
    const supabase = await createServerClient();
    await ensureSettings(supabase, { userId });

    const { data, error } = await supabase
      .from("user_settings")
      .update(input)
      .eq("user_id", userId)
      .select(USER_SETTINGS_COLUMNS)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow;
  }

  async getSoundEnabled(userId: string): Promise<boolean> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing.sound_enabled;
    }

    const created = await this.ensureSettings(userId);
    return created.sound_enabled;
  }

  async ensureSettings(userId: string): Promise<UserSettingsRow> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const supabase = await createServerClient();
    await ensureSettings(supabase, { userId });

    const created = await this.findByUserId(userId);
    if (!created) {
      throw new Error("Failed to create user settings.");
    }

    return created;
  }
}

export const settingsServerRepository = new SettingsServerRepository();
