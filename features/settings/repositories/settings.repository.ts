import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { ensureSettings } from "@/lib/supabase/ensure-user-records";

import type {
  ThemePreference,
  UserSettingsRow,
} from "@/features/settings/types/settings.types";

class SettingsRepository {
  async updateThemeClient(
    userId: string,
    theme: ThemePreference,
  ): Promise<UserSettingsRow> {
    const supabase = createBrowserClient();
    await ensureSettings(supabase, { userId, preferredTheme: theme });

    const { data, error } = await supabase
      .from("user_settings")
      .update({ preferred_theme: theme })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow;
  }

  async updateThemeForCurrentUser(
    theme: ThemePreference,
  ): Promise<UserSettingsRow> {
    const supabase = createBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("You must be signed in to update settings.");
    }

    return this.updateThemeClient(user.id, theme);
  }
}

export const settingsRepository = new SettingsRepository();
