"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { usePasswordReset } from "@/features/authentication/hooks/use-password-reset";

export function ForgotPasswordForm() {
  const { email, setEmail, error, message, loading, submit } = usePasswordReset();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="space-y-4"
    >
      <FormField id="email" label="Email" error={error ?? undefined}>
        <Input
          id="email"
          type="email"
          placeholder="climber@noboru.app"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </FormField>
      {message ? (
        <p className="text-body-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" loading={loading}>
        {loading ? AUTH_MESSAGES.resetLinkLoading : AUTH_MESSAGES.resetLink}
      </Button>
      <p className="text-center text-body-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href={AUTH_ROUTES.login} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
