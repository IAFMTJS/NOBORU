import { redirect } from "next/navigation";

import { LeagueCommunityScreen } from "@/features/leagues/components/league-community-screen";
import { leagueService } from "@/features/leagues/services/league.service";
import { SocialComingSoonScreen } from "@/features/social/components/social-coming-soon-screen";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { getAuthSession } from "@/lib/auth/require-session";
import { FEATURE_FLAGS } from "@/lib/release/feature-flags";

export default async function LeaderboardPage() {
  if (!FEATURE_FLAGS.socialLeagues) {
    return (
      <SocialComingSoonScreen
        title="Leaderboard opens soon"
        description="Weekly EP leagues will be opt-in only — calm competition without streak pressure. Check back after the next release."
      />
    );
  }

  const session = await getAuthSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const dashboard = await leagueService.getDashboard(session.userId);

  return (
    <LeagueCommunityScreen dashboard={dashboard} defaultTab="leaderboard" title="Leaderboard" />
  );
}
