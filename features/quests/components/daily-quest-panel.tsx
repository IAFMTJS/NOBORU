import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { DailyQuestsViewModel } from "@/features/quests/types/quest.types";

type DailyQuestPanelProps = {
  quests: DailyQuestsViewModel;
  compact?: boolean;
};

export function DailyQuestPanel({ quests, compact = false }: DailyQuestPanelProps) {
  if (compact) {
    const nextQuest =
      quests.quests.find((quest) => !quest.completed) ?? quests.quests[0];

    if (!nextQuest) {
      return (
        <GlassPanel className="space-y-3 border-primary/30 p-4 shadow-elevation-1">
          <div className="space-y-1">
            <p className="text-heading-6 font-medium">Daily Quests</p>
            <p className="text-caption text-muted-foreground">All quests complete for today</p>
          </div>
          <Badge variant="success">Trail cleared</Badge>
        </GlassPanel>
      );
    }

    return (
      <GlassPanel className="space-y-3 border-primary/30 p-4 shadow-elevation-1">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-heading-6 font-medium">Daily Quests</p>
            <p className="text-caption text-muted-foreground">
              {quests.completedCount}/{quests.totalCount} complete
            </p>
          </div>
          <Badge variant="outline">+{nextQuest.epReward} EP</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-body-sm font-medium">{nextQuest.title}</p>
          {nextQuest.description ? (
            <p className="text-caption text-muted-foreground">
              {nextQuest.description}
            </p>
          ) : null}
        </div>
        <ProgressBar
          value={nextQuest.current}
          max={nextQuest.target}
          showValue
          valueLabel={`${nextQuest.current}/${nextQuest.target}`}
        />
        <Button className="w-full" asChild>
          <Link href={nextQuest.href}>Continue Quest</Link>
        </Button>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="space-y-4 border-primary/30 p-4 shadow-elevation-1">
      <div className="space-y-1">
        <p className="font-medium">Daily Quests</p>
        <p className="text-caption text-muted-foreground">
          {quests.completedCount}/{quests.totalCount} complete today
        </p>
      </div>
      {quests.quests.map((quest) => (
        <div key={quest.id} className="space-y-2 rounded-lg border border-white/10 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-body-sm font-medium">{quest.title}</p>
              {quest.description ? (
                <p className="text-caption text-muted-foreground">
                  {quest.description}
                </p>
              ) : null}
            </div>
            <Badge variant={quest.completed ? "success" : "outline"}>
              {quest.completed ? "Complete" : `+${quest.epReward} EP`}
            </Badge>
          </div>
          <ProgressBar
            value={quest.current}
            max={quest.target}
            showValue
            valueLabel={`${quest.current}/${quest.target}`}
          />
          {!quest.completed ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={quest.href}>Go</Link>
            </Button>
          ) : null}
        </div>
      ))}
    </GlassPanel>
  );
}
