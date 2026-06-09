import { authServerRepository } from "@/features/authentication/repositories/auth-server.repository";
import { PLACEHOLDER_PROFILE_STATS } from "@/features/profile/constants/placeholder-profile";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import type {
  JlptPlacement,
  ProfileViewModel,
} from "@/features/profile/types/profile.types";

const LEVEL_LABELS: Record<JlptPlacement, string> = {
  none: "Beginner",
  n5: "N5",
  n4: "N4",
  n3: "N3",
  n2: "N2",
  n1: "N1",
};

function mapProfileToViewModel(
  profile: {
    display_name: string;
    user_id: string;
    onboarding_completed: boolean;
    learning_goal: ProfileViewModel["learningGoal"];
    current_level: JlptPlacement | null;
    current_region_slug: string;
  },
  email: string,
): ProfileViewModel {
  const levelLabel = profile.current_level
    ? LEVEL_LABELS[profile.current_level]
    : PLACEHOLDER_PROFILE_STATS.levelLabel;

  return {
    userId: profile.user_id,
    email,
    displayName: profile.display_name,
    levelLabel,
    onboardingCompleted: profile.onboarding_completed,
    learningGoal: profile.learning_goal,
    currentLevel: profile.current_level,
    currentRegionSlug: profile.current_region_slug,
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

  async isOnboardingComplete(userId: string): Promise<boolean> {
    const profile = await profileServerRepository.findByUserId(userId);
    return profile?.onboarding_completed ?? false;
  }
}

export const profileServerService = new ProfileServerService();
