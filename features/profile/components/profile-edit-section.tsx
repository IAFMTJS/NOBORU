"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useProfileUpdate } from "@/features/profile/hooks/use-profile-update";

type ProfileEditSectionProps = {
  initialDisplayName: string;
};

export function ProfileEditSection({
  initialDisplayName,
}: ProfileEditSectionProps) {
  const { displayName, setDisplayName, error, loading, save, isDirty } =
    useProfileUpdate(initialDisplayName);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="space-y-3"
    >
      <FormField id="displayName" label="Display Name" error={error ?? undefined}>
        <Input
          id="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
        />
      </FormField>
      <Button type="submit" disabled={!isDirty} loading={loading}>
        Save Profile
      </Button>
    </form>
  );
}
