import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { yamaService } from "@/features/yama/services/yama.service";
import { getAchievementShowcase } from "@/lib/orchestration/achievements.orchestrator";

export default async function ProfilePage() {
  const [profile, achievements] = await Promise.all([
    profileServerService.getProfile(),
    getAchievementShowcase(),
  ]);

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  const yama = yamaService.resolveProfilePresence();

  return <ProfileScreen profile={profile} achievements={achievements} yama={yama} />;
}
