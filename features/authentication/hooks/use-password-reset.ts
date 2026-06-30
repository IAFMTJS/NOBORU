"use client";

import { useState } from "react";

import { loadAuthService } from "@/features/authentication/utils/load-auth-service";

export function usePasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const authService = await loadAuthService();
    const result = await authService.requestPasswordReset({ email });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to send reset link.");
      return;
    }

    setMessage(result.message ?? null);
  }

  return {
    email,
    setEmail,
    error,
    message,
    loading,
    submit,
  };
}
