import { Badge } from "@/components/ui/badge";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatMeters, formatMetersClimbed } from "@/features/elevation/constants/elevation.constants";
import type { ElevationSummaryViewModel } from "@/features/elevation/types/elevation.types";

type ElevationSummaryProps = {
  summary: ElevationSummaryViewModel;
  compact?: boolean;
};

export function ElevationSummary({ summary, compact = false }: ElevationSummaryProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-body-sm font-medium">Level {summary.currentLevel}</p>
            {summary.activeTitle ? (
              <p className="text-caption text-muted-foreground">{summary.activeTitle}</p>
            ) : null}
          </div>
          <Badge variant="secondary">{formatMetersClimbed(summary.totalEp)}</Badge>
        </div>
        <ProgressBar
          value={summary.levelProgressPercent}
          label="Level progress"
          showValue
        />
      </div>
    );
  }

  return (
    <GlassPanel className="space-y-4 p-4 shadow-elevation-1">
      <div className="space-y-1">
        <StoryTitle as="h2" className="text-base">
          Elevation
        </StoryTitle>
        <p className="text-body-sm text-muted-foreground">
          Level {summary.currentLevel}
          {summary.activeTitle ? ` · ${summary.activeTitle}` : ""}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-body-sm text-muted-foreground">
            {formatMeters(summary.currentEp)} / {formatMeters(summary.epToNextLevel)} to next
            level
          </p>
          <Badge variant="outline">{formatMetersClimbed(summary.totalEp)}</Badge>
        </div>
        <ProgressBar
          value={summary.levelProgressPercent}
          label="Level progress"
          showValue
        />
        {summary.nextReward ? (
          <p className="text-caption text-muted-foreground">
            Next reward at level {summary.nextReward.level}: {summary.nextReward.title}
          </p>
        ) : null}
        {summary.recentRewards.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {summary.recentRewards.map((reward) => (
              <Badge key={reward.level} variant="outline">
                L{reward.level} · {reward.title}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}
