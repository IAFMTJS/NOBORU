import type { FriendsLeaderboardViewModel } from "@/features/social/types/social.types";

const PLACEHOLDER_LEADERBOARD: FriendsLeaderboardViewModel = {
  leagueLabel: "Foothills Climbers",
  weekEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
  currentUserRank: 4,
  entries: [
    {
      rank: 1,
      userId: "u1",
      displayName: "HanaTrail",
      weeklyEp: 420,
      regionLabel: "Forest Trail",
      isCurrentUser: false,
    },
    {
      rank: 2,
      userId: "u2",
      displayName: "SummitSeeker",
      weeklyEp: 385,
      regionLabel: "Mount N5",
      isCurrentUser: false,
    },
    {
      rank: 3,
      userId: "u3",
      displayName: "KitsuneClimb",
      weeklyEp: 340,
      regionLabel: "Foothills",
      isCurrentUser: false,
    },
    {
      rank: 4,
      userId: "current",
      displayName: "You",
      weeklyEp: 290,
      regionLabel: "Foothills",
      isCurrentUser: true,
    },
    {
      rank: 5,
      userId: "u5",
      displayName: "LanternPath",
      weeklyEp: 255,
      regionLabel: "Forest Trail",
      isCurrentUser: false,
    },
    {
      rank: 6,
      userId: "u6",
      displayName: "ToriiWalker",
      weeklyEp: 210,
      regionLabel: "Foothills",
      isCurrentUser: false,
    },
  ],
};

class SocialService {
  getFriendsLeaderboard(): FriendsLeaderboardViewModel {
    return PLACEHOLDER_LEADERBOARD;
  }
}

export const socialService = new SocialService();
