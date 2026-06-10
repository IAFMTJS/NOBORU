import { authServerRepository } from "@/features/authentication/repositories/auth-server.repository";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";

export type AuthenticatedContext = {
  userId: string;
  onboardingCompleted: boolean;
};

export async function getAuthenticatedContextUncached(): Promise<AuthenticatedContext | null> {
  const user = await authServerRepository.getUser();
  if (!user) {
    return null;
  }

  const profile = await profileServerRepository.findByUserId(user.id);
  if (!profile) {
    return null;
  }

  return {
    userId: profile.user_id,
    onboardingCompleted: profile.onboarding_completed,
  };
}
