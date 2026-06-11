import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type {
  DailyQuestsViewModel,
  WeeklyQuestsViewModel,
} from "@/features/quests/types/quest.types";

type TrailQuestCardsProps = {
  daily: DailyQuestsViewModel;
  weekly?: WeeklyQuestsViewModel;
};

function QuestCardList({
  title,
  subtitle,
  quests,
}: {
  title: string;
  subtitle: string;
  quests: DailyQuestsViewModel["quests"];
}) {
  return (
    <div className="space-y-3 rounded-xl border border-primary/20 bg-card/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-body-sm font-medium">{title}</p>
          <p className="text-caption text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {quests.map((quest) => {
          const firstIncomplete = quests.find((q) => !q.completed);
          const highlight = firstIncomplete?.id === quest.id;

          return (
          <div
            key={quest.id}
            className={cn(
              "space-y-2 rounded-lg border bg-background/80 p-3",
              highlight
                ? "border-primary bg-primary/5 shadow-elevation-1"
                : "border-border/80",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-body-sm font-medium">{quest.title}</p>
                {quest.description ? (
                  <p className="text-caption text-muted-foreground">
                    {quest.description}
                  </p>
                ) : null}
              </div>
              <Badge variant={quest.completed ? "success" : "outline"}>
                {quest.completed ? "Done" : `+${quest.epReward} EP`}
              </Badge>
            </div>
            <ProgressBar
              value={quest.current}
              max={quest.target}
              label={quest.title}
              showValue
            />
            {!quest.completed ? (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={quest.href}>Continue on trail</Link>
              </Button>
            ) : null}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrailQuestCards({ daily, weekly }: TrailQuestCardsProps) {
  return (
    <div className="space-y-3">
      <QuestCardList
        title="Today's Quests"
        subtitle={`${daily.completedCount}/${daily.totalCount} complete`}
        quests={daily.quests}
      />
      {weekly && weekly.totalCount > 0 ? (
        <QuestCardList
          title="Weekly Quests"
          subtitle={`${weekly.completedCount}/${weekly.totalCount} complete this week`}
          quests={weekly.quests}
        />
      ) : null}
    </div>
  );
}
