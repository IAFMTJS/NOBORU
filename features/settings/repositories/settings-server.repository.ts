import { createClient as createServerClient } from "@/lib/supabase/server";

import type { UserSettingsRow } from "@/features/settings/types/settings.types";

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

  async ensureSettings(userId: string): Promise<UserSettingsRow> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("user_settings")
      .insert({
        user_id: userId,
        preferred_theme: "dark",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserSettingsRow;
  }
}

export const settingsServerRepository = new SettingsServerRepository();
