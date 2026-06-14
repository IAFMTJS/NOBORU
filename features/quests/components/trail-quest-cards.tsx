import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type {
  DailyQuestsViewModel,
  WeeklyQuestsViewModel,
} from "@/features/quests/types/quest.types";

type TrailQuestCardsProps = {
  daily: DailyQuestsViewModel;
  weekly?: WeeklyQuestsViewModel;
  variant?: "default" | "compact";
  streakDays?: number;
};

export function TrailQuestCards({
  daily,
  weekly,
  variant = "default",
  streakDays = 0,
}: TrailQuestCardsProps) {
  return (
    <DailyQuestBoard
      daily={daily}
      weekly={weekly}
      variant={variant === "compact" ? "compact" : "camp"}
      streakDays={streakDays}
    />
  );
}
