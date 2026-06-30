"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { loadAuthService } from "@/features/authentication/utils/load-auth-service";

export function useUpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const authService = await loadAuthService();
    const result = await authService.updatePassword({
      password,
      confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to update password.");
      return;
    }

    setMessage(result.message ?? null);
    router.push(AUTH_ROUTES.home);
    router.refresh();
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    loading,
    submit,
  };
}
