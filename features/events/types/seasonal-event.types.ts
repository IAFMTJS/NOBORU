export type SeasonalEventRewardViewModel = {
  id: string;
  label: string;
  amount: number;
  currency: "xp" | "gems" | "tokens";
  iconLabel: string;
};

export type SeasonalEventViewModel = {
  slug: string;
  title: string;
  titleJa: string;
  description: string;
  startsAt: string;
  endsAt: string;
  progressPercent: number;
  rewards: SeasonalEventRewardViewModel[];
  joined: boolean;
};
