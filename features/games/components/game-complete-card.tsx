import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
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
    <GlassPanel className="space-y-4 border-success/30 p-4 shadow-elevation-1">
      <div className="space-y-1">
        <p className="font-story text-story-title">{title}</p>
        <p className="text-caption text-muted-foreground">
          Accuracy {result.accuracyPercent}% · +{result.epAwarded} meters climbed
        </p>
      </div>
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
        <Link href="/camp">Return to Camp</Link>
      </Button>
    </GlassPanel>
  );
}
