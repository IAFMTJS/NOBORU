"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AUTH_MESSAGES } from "@/features/authentication/constants/auth.constants";
import { useUpdatePassword } from "@/features/authentication/hooks/use-update-password";

export function UpdatePasswordForm() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    loading,
    submit,
  } = useUpdatePassword();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="space-y-4"
    >
      <FormField id="password" label="New Password">
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
        {loading
          ? AUTH_MESSAGES.updatePasswordLoading
          : AUTH_MESSAGES.updatePassword}
      </Button>
    </form>
  );
}
