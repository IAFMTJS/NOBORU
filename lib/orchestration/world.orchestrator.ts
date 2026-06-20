import { redirect } from "next/navigation";

import { companionService } from "@/features/companion/services/companion.service";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import { elevationRepository } from "@/features/elevation/repositories/elevation.repository";
import { streakService } from "@/features/achievements/services/streak.service";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { resolveWorldPortalState } from "@/features/worlds/services/world-portal.service";
import {
  WorldAccessDeniedError,
  worldService,
} from "@/features/worlds/services/world.service";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { WorldPortalState } from "@/features/worlds/types/world.types";
import { resolveWorldForRegionSlug } from "@/features/worlds/constants/world-registry.constants";
import { resolveCurrentWorldIdFromPath } from "@/features/worlds/utils/world-path-filter.utils";
import { journeyService } from "@/features/journey/services/journey.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import type { JlptLevel } from "@/lib/content/types";

export type WorldPageContext = {
  worldPath: JlptWorldPathViewModel;
  portal: WorldPortalState;
  regionName: string;
  profileStats: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
  companionEvolutionSlug: CompanionEvolutionSlug | null;
};

export async function getWorldPageContext(
  jlptLevel: JlptLevel,
): Promise<WorldPageContext> {
  const userId = await requireAuthenticatedUserId();

  try {
    const [worldPath, passedTrialSlugs, profile, currentStreak, elevation, companion] =
      await Promise.all([
        worldService.getWorldPath(userId, jlptLevel),
        worldService.getPassedTrialSlugs(userId),
        profileServerService.getProfileCore(),
        streakService.getCurrentStreak(userId),
        elevationRepository.ensureElevation(userId),
        companionService.getCompanion(userId),
      ]);

    const currentRegion =
      worldPath.journey.regions.find(
        (region) => region.slug === worldPath.position.currentRegionSlug,
      ) ?? worldPath.journey.regions[0];

    return {
      worldPath,
      portal: resolveWorldPortalState(worldPath, passedTrialSlugs),
      regionName: currentRegion?.name ?? worldPath.world.theme.label,
      profileStats: profile
        ? {
            displayName: profile.displayName,
            levelLabel: profile.levelLabel,
            currentStreak,
            totalXp: elevation.total_ep,
          }
        : null,
      companionEvolutionSlug: companion?.evolutionSlug ?? null,
    };
  } catch (error) {
    if (error instanceof WorldAccessDeniedError) {
      const journey = await journeyService.getJourneyPath(userId);
      const fallbackWorldId = resolveCurrentWorldIdFromPath(journey);
      redirect(`/worlds/${fallbackWorldId}`);
    }
    throw error;
  }
}

export async function resolveCurrentWorldHref(): Promise<string> {
  const userId = await requireAuthenticatedUserId();
  const worldId = await worldService.resolveCurrentWorldId(userId);
  return `/worlds/${worldId}`;
}

export async function redirectToCurrentWorld(
  query?: Record<string, string | undefined>,
): Promise<never> {
  const userId = await requireAuthenticatedUserId();
  const worldId = await worldService.resolveCurrentWorldId(userId);
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) params.set(key, value);
  }

  const suffix = params.toString();
  redirect(suffix ? `/worlds/${worldId}?${suffix}` : `/worlds/${worldId}`);
}

export { resolveWorldForRegionSlug, resolveCurrentWorldIdFromPath };
