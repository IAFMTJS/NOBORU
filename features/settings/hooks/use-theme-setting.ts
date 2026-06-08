"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { settingsService } from "@/features/settings/services/settings.service";
import type { ThemePreference } from "@/features/settings/types/settings.types";

export function useThemeSetting(initialTheme: ThemePreference) {
  const { setTheme } = useTheme();
  const [theme, setThemeState] = useState<ThemePreference>(initialTheme);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  async function updateTheme(nextTheme: ThemePreference) {
    const previousTheme = theme;
    setLoading(true);
    setError(null);
    setThemeState(nextTheme);
    setTheme(nextTheme);

    try {
      const result = await settingsService.updateTheme({ theme: nextTheme });
      setThemeState(result.theme);
      setTheme(result.theme);
    } catch (caught) {
      setThemeState(previousTheme);
      setTheme(previousTheme);
      setError(
        caught instanceof Error ? caught.message : "Unable to update theme.",
      );
    } finally {
      setLoading(false);
    }
  }

  return { theme, updateTheme, loading, error };
}
