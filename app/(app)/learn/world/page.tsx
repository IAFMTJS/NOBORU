import { redirect } from "next/navigation";

import { WorldMapScreen } from "@/features/world-map/components/world-map-screen";
import { buildWorldMapViewModel } from "@/features/world-map/types/world-map.types";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";

export default async function WorldMapPage() {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);
  if (!profile.onboardingCompleted) redirect(AUTH_ROUTES.onboarding);

  const [regions, progressRows, passedTrialSlugs] = await Promise.all([
    learningPathRepository.listPublishedRegionsWithCurriculum(),
    getCachedProgressRows(profile.userId),
    learningPathService.getPassedTrialSlugs(profile.userId),
  ]);

  const learningPath = learningPathService.buildLearningPath(
    regions,
    progressRows,
    passedTrialSlugs,
  );

  const data = buildWorldMapViewModel(learningPath, profile.currentRegionSlug);

  return <WorldMapScreen data={data} />;
}
