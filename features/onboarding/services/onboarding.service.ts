import { onboardingRepository } from "@/features/onboarding/repositories/onboarding.repository";
import type {
  CompleteOnboardingInput,
  OnboardingResult,
} from "@/features/onboarding/types/onboarding.types";

class OnboardingService {
  async completeOnboarding(
    input: CompleteOnboardingInput,
  ): Promise<OnboardingResult> {
    try {
      await onboardingRepository.completeOnboarding(input);
      return { success: true };
    } catch (caught) {
      return {
        success: false,
        error:
          caught instanceof Error
            ? caught.message
            : "Unable to complete onboarding.",
      };
    }
  }
}

export const onboardingService = new OnboardingService();
