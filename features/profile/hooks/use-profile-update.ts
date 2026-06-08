"use client";

import { useState } from "react";

import { profileService } from "@/features/profile/services/profile.service";

export function useProfileUpdate(initialDisplayName: string) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [savedName, setSavedName] = useState(initialDisplayName);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setError(null);

    try {
      const result = await profileService.updateProfile({ displayName });
      setSavedName(result.displayName);
      setDisplayName(result.displayName);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to update profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    displayName,
    setDisplayName,
    savedName,
    error,
    loading,
    save,
    isDirty: displayName.trim() !== savedName,
  };
}
