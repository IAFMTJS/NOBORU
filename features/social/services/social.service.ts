import type {
  FriendsDashboardViewModel,
  FriendsLeaderboardViewModel,
} from "@/features/social/types/social.types";

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
      titleLabel: "Lantern Keeper",
      achievementCount: 12,
      isCurrentUser: false,
    },
    {
      rank: 2,
      userId: "u2",
      displayName: "SummitSeeker",
      weeklyEp: 385,
      regionLabel: "Mount N5",
      titleLabel: "Peak Walker",
      achievementCount: 9,
      isCurrentUser: false,
    },
    {
      rank: 3,
      userId: "u3",
      displayName: "KitsuneClimb",
      weeklyEp: 340,
      regionLabel: "Foothills",
      titleLabel: "Trail Scout",
      achievementCount: 8,
      isCurrentUser: false,
    },
    {
      rank: 4,
      userId: "current",
      displayName: "You",
      weeklyEp: 290,
      regionLabel: "Foothills",
      titleLabel: "Foothill Climber",
      achievementCount: 6,
      isCurrentUser: true,
    },
    {
      rank: 5,
      userId: "u5",
      displayName: "LanternPath",
      weeklyEp: 255,
      regionLabel: "Forest Trail",
      titleLabel: "Pathfinder",
      achievementCount: 5,
      isCurrentUser: false,
    },
    {
      rank: 6,
      userId: "u6",
      displayName: "ToriiWalker",
      weeklyEp: 210,
      regionLabel: "Foothills",
      titleLabel: "Shrine Visitor",
      achievementCount: 4,
      isCurrentUser: false,
    },
  ],
};

const PLACEHOLDER_FRIENDS: FriendsDashboardViewModel = {
  following: [
    {
      userId: "u1",
      displayName: "HanaTrail",
      isFollowing: true,
      regionLabel: "Forest Trail",
      titleLabel: "Lantern Keeper",
      achievementCount: 12,
    },
    {
      userId: "u2",
      displayName: "SummitSeeker",
      isFollowing: true,
      regionLabel: "Mount N5",
      titleLabel: "Peak Walker",
      achievementCount: 9,
    },
    {
      userId: "u3",
      displayName: "KitsuneClimb",
      isFollowing: true,
      regionLabel: "Foothills",
      titleLabel: "Trail Scout",
      achievementCount: 8,
    },
  ],
  followers: [
    {
      userId: "u5",
      displayName: "LanternPath",
      isFollowing: false,
      regionLabel: "Forest Trail",
      titleLabel: "Pathfinder",
      achievementCount: 5,
    },
    {
      userId: "u6",
      displayName: "ToriiWalker",
      isFollowing: false,
      regionLabel: "Foothills",
      titleLabel: "Shrine Visitor",
      achievementCount: 4,
    },
  ],
  activityFeed: [
    {
      userId: "u1",
      displayName: "HanaTrail",
      activityType: "lesson_complete",
      activityLabel: "Completed a Forest Trail vocabulary lesson",
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
      userId: "u2",
      displayName: "SummitSeeker",
      activityType: "region_unlock",
      activityLabel: "Reached Mount N5 gate",
      createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    },
    {
      userId: "u3",
      displayName: "KitsuneClimb",
      activityType: "review_session",
      activityLabel: "Finished a review session — 18 cards",
      createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    },
  ],
};

class SocialService {
  getFriendsLeaderboard(): FriendsLeaderboardViewModel {
    return PLACEHOLDER_LEADERBOARD;
  }

  getFriendsDashboard(): FriendsDashboardViewModel {
    return PLACEHOLDER_FRIENDS;
  }
}

export const socialService = new SocialService();
