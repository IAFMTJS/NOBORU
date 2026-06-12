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
import { QuestCompleteFeedback } from "@/features/quests/components/quest-complete-feedback";
import type { GameCompleteViewModel } from "@/features/games/types/game.types";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { yamaService } from "@/features/yama/services/yama.service";

type GameCompleteCardProps = {
  result: GameCompleteViewModel;
  title: string;
  backHref?: string;
  backLabel?: string;
};

export function GameCompleteCard({
  result,
  title,
  backHref = "/games",
  backLabel = "Back to Games",
}: GameCompleteCardProps) {
  return (
    <Card className="border-success/30 shadow-elevation-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Accuracy {result.accuracyPercent}% · +{result.epAwarded} EP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <YamaCelebration
          presence={
            result.elevation?.leveledUp
              ? yamaService.resolveCelebration("level_up")
              : yamaService.resolveGameVictory()
          }
          title={
            result.elevation?.leveledUp
              ? `Level ${result.elevation.currentLevel} reached`
              : "Sprint complete"
          }
        />
        {result.elevation?.leveledUp ? (
          <Badge variant="secondary">
            Level up! Now level {result.elevation.currentLevel}
          </Badge>
        ) : null}
        <QuestCompleteFeedback completions={result.quests} />
        <Button className="w-full" asChild>
          <Link href={backHref}>{backLabel}</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/home">Return Home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
