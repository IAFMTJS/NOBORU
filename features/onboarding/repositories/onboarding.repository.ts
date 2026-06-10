import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { resolveDisplayName } from "@/lib/supabase/ensure-user-records";

import { FOOTHILLS_REGION } from "@/features/onboarding/constants/onboarding.constants";
import type { CompleteOnboardingInput } from "@/features/onboarding/types/onboarding.types";

class OnboardingRepository {
  async completeOnboarding(input: CompleteOnboardingInput): Promise<void> {
    const supabase = createBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("You must be signed in to complete onboarding.");
    }

    const displayName = resolveDisplayName(user.user_metadata);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          display_name: displayName,
          onboarding_completed: true,
          learning_goal: input.learningGoal,
          current_level: input.currentLevel,
          current_region_slug: FOOTHILLS_REGION.slug,
          theme: input.theme,
        },
        { onConflict: "user_id" },
      )
      .select("onboarding_completed")
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profileData?.onboarding_completed) {
      throw new Error("Onboarding profile was not saved. Please try again.");
    }

    const { data: settingsData, error: settingsError } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: user.id,
          daily_goal: input.dailyGoalMinutes,
          preferred_theme: input.theme,
        },
        { onConflict: "user_id" },
      )
      .select("daily_goal, preferred_theme")
      .single();

    if (settingsError) {
      throw new Error(settingsError.message);
    }

    if (
      settingsData?.daily_goal !== input.dailyGoalMinutes ||
      settingsData?.preferred_theme !== input.theme
    ) {
      throw new Error("Onboarding settings were not saved. Please try again.");
    }
  }
}

export const onboardingRepository = new OnboardingRepository();
