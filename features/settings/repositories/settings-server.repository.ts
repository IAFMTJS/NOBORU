import { createClient as createServerClient } from "@/lib/supabase/server";
import { ensureSettings } from "@/lib/supabase/ensure-user-records";

import type {
  ThemePreference,
  UserSettingsRow,
} from "@/features/settings/types/settings.types";

class SettingsServerRepository {
  async findByUserId(userId: string): Promise<UserSettingsRow | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
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
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow;
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
