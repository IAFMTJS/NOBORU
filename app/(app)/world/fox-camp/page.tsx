import { redirect } from "next/navigation";

import { campServerService } from "@/features/camp/services/camp-server.service";
import { FoxCampScreen } from "@/features/camp/components/fox-camp-screen";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export default async function FoxCampPage() {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);
  if (!profile.onboardingCompleted) redirect(AUTH_ROUTES.onboarding);

  const data = await campServerService.getCampDashboard(
    profile.userId,
    profile.currentRegionSlug,
  );

  return <FoxCampScreen data={data} />;
}
