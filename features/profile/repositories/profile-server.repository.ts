import { createClient as createServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-user-records";

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

  async updateDisplayName(
    userId: string,
    displayName: string,
  ): Promise<ProfileRow> {
    const supabase = await createServerClient();
    await ensureProfile(supabase, { userId, displayName });

    const { data, error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileRow;
  }

  async updateCurrentRegionSlug(
    userId: string,
    regionSlug: string,
  ): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({ current_region_slug: regionSlug })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async ensureProfile(userId: string, displayName: string): Promise<ProfileRow> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const supabase = await createServerClient();
    await ensureProfile(supabase, { userId, displayName });

    const created = await this.findByUserId(userId);
    if (!created) {
      throw new Error("Failed to create profile.");
    }

    return created;
  }
}

export const profileServerRepository = new ProfileServerRepository();
