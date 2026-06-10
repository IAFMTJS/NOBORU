import { createClient as createBrowserClient } from "@/lib/supabase/client";
import {
  ensureUserRecords,
  resolveDisplayName,
} from "@/lib/supabase/ensure-user-records";

class UserRecordsRepository {
  async ensureForCurrentUser(): Promise<void> {
    const supabase = createBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("You must be signed in to initialize your account.");
    }

    await ensureUserRecords(supabase, {
      userId: user.id,
      displayName: resolveDisplayName(user.user_metadata),
    });
  }
}

export const userRecordsRepository = new UserRecordsRepository();
