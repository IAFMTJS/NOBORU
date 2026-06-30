import type { User } from "@supabase/supabase-js";

import { isContentAdminRole } from "@/lib/content/types";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export type ProfileJwtClaims = {
  onboarding_completed: boolean;
  role: string;
  is_content_admin: boolean;
  display_name: string | null;
};

export type MiddlewareProfile = {
  onboarding_completed: boolean;
  role: string | null;
};

const syncedClaimUsers = new Set<string>();

export function readProfileClaimsFromUser(
  user: User,
): MiddlewareProfile | null {
  const appMetadata = user.app_metadata ?? {};
  const userMetadata = user.user_metadata ?? {};
  const onboardingCompleted =
    typeof appMetadata.onboarding_completed === "boolean"
      ? appMetadata.onboarding_completed
      : typeof userMetadata.onboarding_completed === "boolean"
        ? userMetadata.onboarding_completed
        : null;

  if (onboardingCompleted === null) {
    return null;
  }

  const role =
    typeof appMetadata.role === "string" && appMetadata.role.length > 0
      ? appMetadata.role
      : typeof userMetadata.role === "string" && userMetadata.role.length > 0
        ? userMetadata.role
        : "learner";

  return {
    onboarding_completed: onboardingCompleted,
    role,
  };
}

export async function ensureProfileJwtClaims(userId: string): Promise<void> {
  if (!isAdminClientConfigured() || syncedClaimUsers.has(userId)) {
    return;
  }

  try {
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("onboarding_completed, role, display_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[auth] Failed to resolve profile for JWT claims:", profileError);
      return;
    }

    if (!profile) {
      return;
    }

    const role =
      profile && typeof profile === "object" && "role" in profile
        ? String((profile as { role?: string }).role ?? "learner")
        : "learner";
    const onboardingCompleted = Boolean(
      profile &&
        typeof profile === "object" &&
        "onboarding_completed" in profile &&
        (profile as { onboarding_completed?: boolean }).onboarding_completed,
    );
    const displayName =
      profile &&
      typeof profile === "object" &&
      "display_name" in profile &&
      typeof (profile as { display_name?: string | null }).display_name === "string"
        ? (profile as { display_name: string }).display_name
        : null;

    const claims: ProfileJwtClaims = {
      onboarding_completed: onboardingCompleted,
      role,
      is_content_admin: isContentAdminRole(role),
      display_name: displayName,
    };

    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: claims,
    });

    if (updateError) {
      console.error("[auth] Failed to sync profile JWT claims:", updateError);
      return;
    }

    syncedClaimUsers.add(userId);
  } catch (error) {
    console.error("[auth] Profile JWT claim sync failed:", error);
  }
}
