import { isContentAdminRole } from "@/lib/content/types";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

const syncedClaimUsers = new Set<string>();

export async function ensureContentAdminClaim(userId: string): Promise<void> {
  if (!isAdminClientConfigured() || syncedClaimUsers.has(userId)) {
    return;
  }

  try {
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[auth] Failed to resolve profile role for JWT claim:", profileError);
      return;
    }

    const role =
      profile && typeof profile === "object" && "role" in profile
        ? String((profile as { role?: string }).role ?? "learner")
        : "learner";
    const isContentAdmin = isContentAdminRole(role);

    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: {
        is_content_admin: isContentAdmin,
      },
    });

    if (updateError) {
      console.error("[auth] Failed to sync content admin JWT claim:", updateError);
      return;
    }

    syncedClaimUsers.add(userId);
  } catch (error) {
    console.error("[auth] Content admin claim sync failed:", error);
  }
}
