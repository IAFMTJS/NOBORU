import type { SupabaseClient } from "@supabase/supabase-js";

import type { ThemePreference } from "@/features/settings/types/settings.types";

type EnsureProfileInput = {
  userId: string;
  displayName?: string;
};

type EnsureSettingsInput = {
  userId: string;
  preferredTheme?: ThemePreference;
};

type EnsureUserRecordsInput = EnsureProfileInput & EnsureSettingsInput;

async function requireRowExists(
  supabase: SupabaseClient,
  table: "profiles" | "user_settings",
  userId: string,
  label: string,
): Promise<void> {
  const { data, error } = await supabase
    .from(table)
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(`${label} record could not be created.`);
  }
}

export async function ensureProfile(
  supabase: SupabaseClient,
  input: EnsureProfileInput,
): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: input.userId,
      display_name: input.displayName ?? "Climber",
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );

  if (error) {
    throw new Error(error.message);
  }

  await requireRowExists(supabase, "profiles", input.userId, "Profile");
}

export async function ensureSettings(
  supabase: SupabaseClient,
  input: EnsureSettingsInput,
): Promise<void> {
  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: input.userId,
      preferred_theme: input.preferredTheme ?? "dark",
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );

  if (error) {
    throw new Error(error.message);
  }

  await requireRowExists(supabase, "user_settings", input.userId, "User settings");
}

export async function ensureUserRecords(
  supabase: SupabaseClient,
  input: EnsureUserRecordsInput,
): Promise<void> {
  await ensureProfile(supabase, input);
  await ensureSettings(supabase, input);
}

export function resolveDisplayName(
  metadata: Record<string, unknown> | undefined,
): string {
  if (typeof metadata?.display_name === "string" && metadata.display_name.trim()) {
    return metadata.display_name.trim();
  }

  return "Climber";
}
