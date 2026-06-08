import { createClient as createServerClient } from "@/lib/supabase/server";

import type { ProfileRow } from "@/features/profile/types/profile.types";

class ProfileServerRepository {
  async findByUserId(userId: string): Promise<ProfileRow | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileRow | null;
  }

  async ensureProfile(userId: string, displayName: string): Promise<ProfileRow> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        display_name: displayName,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileRow;
  }
}

export const profileServerRepository = new ProfileServerRepository();
