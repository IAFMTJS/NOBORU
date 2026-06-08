"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { useLogin } from "@/features/authentication/hooks/use-login";

export function LoginForm() {
  const { email, setEmail, password, setPassword, error, loading, submit } =
    useLogin();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="space-y-4"
    >
      <FormField id="email" label="Email">
        <Input
          id="email"
          type="email"
          placeholder="climber@noboru.app"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </FormField>
      <FormField id="password" label="Password" error={error ?? undefined}>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </FormField>
      <div className="text-right">
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="text-body-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        {loading ? AUTH_MESSAGES.signInLoading : AUTH_MESSAGES.signIn}
      </Button>
      <p className="text-center text-body-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={AUTH_ROUTES.register} className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
