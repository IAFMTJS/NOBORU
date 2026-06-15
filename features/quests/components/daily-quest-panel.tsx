import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card className="border-primary/30 shadow-elevation-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-heading-6">Daily Quests</CardTitle>
            <CardDescription>All quests complete for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Trail cleared</Badge>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-primary/30 shadow-elevation-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-heading-6">Daily Quests</CardTitle>
              <CardDescription>
                {quests.completedCount}/{quests.totalCount} complete
              </CardDescription>
            </div>
            <Badge variant="outline">+{nextQuest.epReward} EP</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 shadow-elevation-1">
      <CardHeader>
        <CardTitle>Daily Quests</CardTitle>
        <CardDescription>
          {quests.completedCount}/{quests.totalCount} complete today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.quests.map((quest) => (
          <div key={quest.id} className="space-y-2 rounded-lg border p-3">
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
      </CardContent>
    </Card>
  );
}
