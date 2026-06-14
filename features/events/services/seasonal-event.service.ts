import type { SeasonalEventViewModel } from "@/features/events/types/seasonal-event.types";

const SAKURA_FESTIVAL: SeasonalEventViewModel = {
  slug: "sakura-festival-2026",
  title: "Sakura Festival",
  titleJa: "桜祭り",
  description:
    "Cherry blossoms line the trail. Complete festival quests to earn petals and exclusive cosmetics.",
  startsAt: "2026-03-20T00:00:00.000Z",
  endsAt: "2026-04-10T23:59:59.000Z",
  progressPercent: 35,
  joined: true,
  rewards: [
    {
      id: "sakura-xp",
      label: "Festival XP",
      amount: 500,
      currency: "xp",
      iconLabel: "✨",
    },
    {
      id: "sakura-gems",
      label: "Cherry Gems",
      amount: 15,
      currency: "gems",
      iconLabel: "💎",
    },
    {
      id: "sakura-tokens",
      label: "Petal Tokens",
      amount: 40,
      currency: "tokens",
      iconLabel: "🌸",
    },
  ],
};

class SeasonalEventService {
  getActiveEvent(): SeasonalEventViewModel {
    return SAKURA_FESTIVAL;
  }
}

export const seasonalEventService = new SeasonalEventService();
