import { createClient as createBrowserClient } from "@/lib/supabase/client";

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

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        learning_goal: input.learningGoal,
        current_level: input.currentLevel,
        current_region_slug: FOOTHILLS_REGION.slug,
        theme: input.theme,
      })
      .eq("user_id", user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { error: settingsError } = await supabase
      .from("user_settings")
      .update({
        daily_goal: input.dailyGoalMinutes,
        preferred_theme: input.theme,
      })
      .eq("user_id", user.id);

    if (settingsError) {
      throw new Error(settingsError.message);
    }
  }
}

export const onboardingRepository = new OnboardingRepository();
