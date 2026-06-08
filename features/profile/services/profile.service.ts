import { profileRepository } from "@/features/profile/repositories/profile.repository";
import type { UpdateProfileInput } from "@/features/profile/types/profile.types";

class ProfileService {
  async updateProfile(
    input: UpdateProfileInput,
  ): Promise<{ displayName: string }> {
    const trimmedName = input.displayName.trim();
    if (!trimmedName) {
      throw new Error("Display name is required.");
    }

    const profile =
      await profileRepository.updateDisplayNameForCurrentUser(trimmedName);

    return { displayName: profile.display_name };
  }
}

export const profileService = new ProfileService();
