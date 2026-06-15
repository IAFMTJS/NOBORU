import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { ReviewStatsViewModel } from "@/features/review/types/review.types";

type ReviewStatsPanelProps = {
  stats: ReviewStatsViewModel;
};

export function ReviewStatsPanel({ stats }: ReviewStatsPanelProps) {
  const masteryPercent =
    stats.totalCount === 0
      ? 0
      : Math.round((stats.masteredCount / stats.totalCount) * 100);

  return (
    <div className="space-y-4">
      <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
        <div className="space-y-1">
          <p className="font-medium">Review Queue</p>
          <p className="text-caption text-muted-foreground">
            {stats.dueCount} due · {stats.learningCount} learning ·{" "}
            {stats.masteredCount} mastered
          </p>
        </div>
        <ProgressBar
          value={masteryPercent}
          label="Items at mastered or legendary"
          showValue
        />
      </GlassPanel>

      {stats.weakAreas.length > 0 ? (
        <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
          <div className="space-y-1">
            <p className="text-heading-6 font-medium">Weak Areas</p>
            <p className="text-caption text-muted-foreground">
              Focus extra practice on these content types.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.weakAreas.map((area) => (
              <Badge key={area.contentType} variant="outline">
                {area.label} · {area.count}
              </Badge>
            ))}
          </div>
        </GlassPanel>
      ) : null}
    </div>
  );
}
