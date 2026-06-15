import { FriendsLeaderboardScreen } from "@/features/social/components/friends-leaderboard-screen";
import { socialService } from "@/features/social/services/social.service";

export default function CommunityPage() {
  const leaderboard = socialService.getFriendsLeaderboard();
  const friends = socialService.getFriendsDashboard();

  return (
    <FriendsLeaderboardScreen
      leaderboard={leaderboard}
      friends={friends}
      defaultTab="friends"
    />
  );
}
