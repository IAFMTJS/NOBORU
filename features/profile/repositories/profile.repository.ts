import { createClient as createBrowserClient } from "@/lib/supabase/client";

import type { ProfileRow } from "@/features/profile/types/profile.types";

class ProfileRepository {
  async updateDisplayNameClient(
    userId: string,
    displayName: string,
  ): Promise<ProfileRow> {
    const supabase = createBrowserClient();
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

  async updateDisplayNameForCurrentUser(
    displayName: string,
  ): Promise<ProfileRow> {
    const supabase = createBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("You must be signed in to update your profile.");
    }

    return this.updateDisplayNameClient(user.id, displayName);
  }
}

export const profileRepository = new ProfileRepository();
