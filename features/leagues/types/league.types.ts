export type LeagueTier =
  | "bronze_trail"
  | "silver_trail"
  | "gold_trail"
  | "platinum_trail"
  | "diamond_summit"
  | "master_summit"
  | "legend_summit";

export const LEAGUE_TIER_LABELS: Record<LeagueTier, string> = {
  bronze_trail: "Bronze Trail",
  silver_trail: "Silver Trail",
  gold_trail: "Gold Trail",
  platinum_trail: "Platinum Trail",
  diamond_summit: "Diamond Summit",
  master_summit: "Master Summit",
  legend_summit: "Legend Summit",
};

export type LeagueMembershipRow = {
  id: string;
  user_id: string;
  season_id: string;
  tier: LeagueTier;
  weekly_ep: number;
  opted_in: boolean;
};

export type LeagueLeaderboardEntry = {
  userId: string;
  displayName: string;
  weeklyEp: number;
  tier: LeagueTier;
  rank: number;
};

export type LeagueDashboardViewModel = {
  optedIn: boolean;
  tier: LeagueTier;
  tierLabel: string;
  weeklyEp: number;
  rank: number | null;
  leaderboard: LeagueLeaderboardEntry[];
};
