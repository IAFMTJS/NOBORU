import { createClient as createServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-user-records";

import type { ProfileRow } from "@/features/profile/types/profile.types";

const PROFILE_ROW_COLUMNS =
  "id, user_id, username, display_name, avatar_id, title_id, bio, country, timezone, language, theme, role, onboarding_completed, learning_goal, current_level, current_region_slug, created_at, updated_at" as const;

class ProfileServerRepository {
  async findByUserId(userId: string): Promise<ProfileRow | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_ROW_COLUMNS)
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
      .select(PROFILE_ROW_COLUMNS)
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

  async findDisplayNamesByUserIds(userIds: string[]): Promise<Map<string, string>> {
    if (userIds.length === 0) return new Map();

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    if (error) throw new Error(error.message);

    const map = new Map<string, string>();
    for (const row of data ?? []) {
      map.set(row.user_id as string, (row.display_name as string) ?? "Climber");
    }
    return map;
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
