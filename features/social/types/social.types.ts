export type LeaderboardEntryViewModel = {
  rank: number;
  userId: string;
  displayName: string;
  weeklyEp: number;
  regionLabel: string;
  titleLabel: string;
  achievementCount: number;
  isCurrentUser: boolean;
};

export type FriendsLeaderboardViewModel = {
  leagueLabel: string;
  weekEndsAt: string;
  entries: LeaderboardEntryViewModel[];
  currentUserRank: number | null;
};

export type FriendViewModel = {
  userId: string;
  displayName: string;
  isFollowing: boolean;
  regionLabel: string;
  titleLabel: string;
  achievementCount: number;
};

export type FriendActivityViewModel = {
  userId: string;
  displayName: string;
  activityType: string;
  activityLabel: string;
  createdAt: string;
};

export type FriendsDashboardViewModel = {
  following: FriendViewModel[];
  followers: FriendViewModel[];
  activityFeed: FriendActivityViewModel[];
};
