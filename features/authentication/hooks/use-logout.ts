"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { loadAuthService } from "@/features/authentication/utils/load-auth-service";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setLoading(true);
    setError(null);

    const authService = await loadAuthService();
    const result = await authService.signOut();

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to sign out.");
      return;
    }

    router.push(AUTH_ROUTES.login);
    router.refresh();
  }

  return { logout, loading, error };
}
