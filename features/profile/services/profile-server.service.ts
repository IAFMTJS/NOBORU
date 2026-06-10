import {
  getCachedProfileCore,
  getCachedProfileWithStats,
} from "@/lib/cache/request-cache";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";

class ProfileServerService {
  async getProfileCore(): Promise<ProfileViewModel | null> {
    return getCachedProfileCore();
  }

  async getProfile(): Promise<ProfileViewModel | null> {
    return getCachedProfileWithStats();
  }

  async isOnboardingComplete(userId: string): Promise<boolean> {
    const profile = await profileServerRepository.findByUserId(userId);
    return profile?.onboarding_completed ?? false;
  }
}

export const profileServerService = new ProfileServerService();
