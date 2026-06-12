import { redirect } from "next/navigation";

import { gameService } from "@/features/games/services/game.service";
import type { PlayableGameSlug } from "@/features/games/constants/game.constants";
import type {
  GameAvailabilityViewModel,
  GameSessionViewModel,
} from "@/features/games/types/game.types";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";

async function requireOnboardedUserId(): Promise<string> {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);
  if (!profile.onboardingCompleted) redirect(AUTH_ROUTES.onboarding);
  return profile.userId;
}

export async function getGameAvailability(): Promise<GameAvailabilityViewModel> {
  const userId = await requireOnboardedUserId();
  return gameService.getAvailability(userId);
}

export async function getGameSession(
  slug: PlayableGameSlug,
  options?: { weakOnly?: boolean },
): Promise<GameSessionViewModel> {
  const userId = await requireOnboardedUserId();
  return gameService.getSession(userId, slug, options);
}
