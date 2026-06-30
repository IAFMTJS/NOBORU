import { redirect } from "next/navigation";

import { friendsService } from "@/features/friends/services/friends.service";
import { LeagueCommunityScreen } from "@/features/leagues/components/league-community-screen";
import { leagueService } from "@/features/leagues/services/league.service";
import { SocialComingSoonScreen } from "@/features/social/components/social-coming-soon-screen";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { getAuthSession } from "@/lib/auth/require-session";
import { FEATURE_FLAGS } from "@/lib/release/feature-flags";

export default async function CommunityPage() {
  if (!FEATURE_FLAGS.socialLeagues) {
    return (
      <SocialComingSoonScreen
        title="Community trail opens soon"
        description="Friends, climbs together, and opt-in leagues are being prepared. No placeholder rankings — the real summit board ships next."
      />
    );
  }

  const session = await getAuthSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const [dashboard, friends] = await Promise.all([
    leagueService.getDashboard(session.userId),
    friendsService.getDashboard(session.userId),
  ]);

  return (
    <LeagueCommunityScreen
      dashboard={dashboard}
      friends={friends}
      defaultTab="leaderboard"
      title="Community"
    />
  );
}
