"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { authService } from "@/features/authentication/services/auth.service";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);

    const result = await authService.signIn({ email, password });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to sign in.");
      return;
    }

    const next = searchParams.get("next") ?? AUTH_ROUTES.home;
    router.push(next);
    router.refresh();
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    submit,
  };
}
