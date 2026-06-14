import { FriendsLeaderboardScreen } from "@/features/social/components/friends-leaderboard-screen";
import { socialService } from "@/features/social/services/social.service";

export default function SocialPage() {
  const leaderboard = socialService.getFriendsLeaderboard();
  return <FriendsLeaderboardScreen leaderboard={leaderboard} />;
}
