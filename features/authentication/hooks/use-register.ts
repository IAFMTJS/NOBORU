"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { loadAuthService } from "@/features/authentication/utils/load-auth-service";

export function useRegister() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
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
    const result = await authService.signUp({
      displayName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to create account.");
      return;
    }

    if (result.requiresEmailConfirmation) {
      setMessage(result.message ?? AUTH_MESSAGES.emailConfirmation);
      return;
    }

    router.push(AUTH_ROUTES.home);
    router.refresh();
  }

  return {
    displayName,
    setDisplayName,
    email,
    setEmail,
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
