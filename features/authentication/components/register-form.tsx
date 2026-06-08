"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { useRegister } from "@/features/authentication/hooks/use-register";

export function RegisterForm() {
  const {
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
  } = useRegister();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="space-y-4"
    >
      <FormField id="displayName" label="Display Name">
        <Input
          id="displayName"
          placeholder="Climber"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
        />
      </FormField>
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
      <FormField id="password" label="Password">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </FormField>
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        error={error ?? undefined}
      >
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </FormField>
      {message ? (
        <p className="text-body-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" loading={loading}>
        {loading ? AUTH_MESSAGES.signUpLoading : AUTH_MESSAGES.signUp}
      </Button>
      <p className="text-center text-body-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={AUTH_ROUTES.login} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
