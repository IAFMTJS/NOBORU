import { createClient } from "@/lib/supabase/server";

import {
  CONTENT_ADMIN_ROLES,
  type AdminRole,
  isContentAdminRole,
} from "@/lib/content/types";

export type AdminSession = {
  userId: string;
  email: string;
  role: AdminRole;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile?.role) {
    return null;
  }

  if (!isContentAdminRole(profile.role)) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role: profile.role,
  };
}

export function canManageContent(role: AdminRole): boolean {
  return CONTENT_ADMIN_ROLES.includes(role);
}
