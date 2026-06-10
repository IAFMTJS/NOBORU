import { createClient as createServerClient } from "@/lib/supabase/server";
import { ensureSettings } from "@/lib/supabase/ensure-user-records";

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
    await ensureSettings(supabase, { userId });

    const created = await this.findByUserId(userId);
    if (!created) {
      throw new Error("Failed to create user settings.");
    }

    return created;
  }
}

export const settingsServerRepository = new SettingsServerRepository();
