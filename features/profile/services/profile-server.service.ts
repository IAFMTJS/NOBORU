import { authServerRepository } from "@/features/authentication/repositories/auth-server.repository";
import { PLACEHOLDER_PROFILE_STATS } from "@/features/profile/constants/placeholder-profile";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";

function mapProfileToViewModel(
  profile: { display_name: string; user_id: string },
  email: string,
): ProfileViewModel {
  return {
    userId: profile.user_id,
    email,
    displayName: profile.display_name,
    levelLabel: PLACEHOLDER_PROFILE_STATS.levelLabel,
    stats: PLACEHOLDER_PROFILE_STATS.stats.map((stat) => ({ ...stat })),
  };
}

class ProfileServerService {
  async getProfile(): Promise<ProfileViewModel | null> {
    const user = await authServerRepository.getUser();
    if (!user) {
      return null;
    }

    const displayName =
      typeof user.user_metadata?.display_name === "string"
        ? user.user_metadata.display_name
        : "Climber";

    const profile = await profileServerRepository.ensureProfile(
      user.id,
      displayName,
    );

    return mapProfileToViewModel(profile, user.email ?? "");
  }
}

export const profileServerService = new ProfileServerService();
