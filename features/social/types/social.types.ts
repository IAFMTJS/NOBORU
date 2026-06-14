export type LeaderboardEntryViewModel = {
  rank: number;
  userId: string;
  displayName: string;
  weeklyEp: number;
  regionLabel: string;
  isCurrentUser: boolean;
};

export type FriendsLeaderboardViewModel = {
  leagueLabel: string;
  weekEndsAt: string;
  entries: LeaderboardEntryViewModel[];
  currentUserRank: number | null;
};
