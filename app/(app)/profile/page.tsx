import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export default async function ProfilePage() {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return <ProfileScreen profile={profile} />;
}
