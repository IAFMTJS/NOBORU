"use client";

import { useCallback, useState } from "react";

import type { SettingsViewModel } from "@/features/settings/types/settings.types";
import { settingsService } from "@/features/settings/services/settings.service";

export function useTrailPreferences(initial: SettingsViewModel) {
  const [soundEnabled, setSoundEnabled] = useState(initial.soundEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initial.notificationsEnabled,
  );
  const [preferredLanguage, setPreferredLanguage] = useState(initial.preferredLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (patch: {
      soundEnabled?: boolean;
      notificationsEnabled?: boolean;
      preferredLanguage?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await settingsService.updatePreferences(patch);
        if (patch.soundEnabled !== undefined) setSoundEnabled(result.soundEnabled);
        if (patch.notificationsEnabled !== undefined) {
          setNotificationsEnabled(result.notificationsEnabled);
        }
        if (patch.preferredLanguage !== undefined) {
          setPreferredLanguage(result.preferredLanguage);
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to update preference.");
        throw caught;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    soundEnabled,
    notificationsEnabled,
    preferredLanguage,
    loading,
    error,
    toggleSound: () => update({ soundEnabled: !soundEnabled }),
    toggleNotifications: () =>
      update({ notificationsEnabled: !notificationsEnabled }),
    setLanguage: (language: string) => update({ preferredLanguage: language }),
  };
}
