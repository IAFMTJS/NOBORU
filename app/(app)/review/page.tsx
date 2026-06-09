import { ReviewSession } from "@/features/review/components/review-session";
import { reviewServerService } from "@/features/review/services/review-server.service";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";

export default async function ReviewPage() {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  const session = await reviewServerService.getSession(profile.userId);
  return <ReviewSession initialSession={session} />;
}
