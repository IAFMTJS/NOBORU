import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Review Queue</CardTitle>
          <CardDescription>
            {stats.dueCount} due · {stats.learningCount} learning ·{" "}
            {stats.masteredCount} mastered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={masteryPercent}
            label="Items at mastered or legendary"
            showValue
          />
        </CardContent>
      </Card>

      {stats.weakAreas.length > 0 ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardTitle className="text-heading-6">Weak Areas</CardTitle>
            <CardDescription>
              Focus extra practice on these content types.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {stats.weakAreas.map((area) => (
              <Badge key={area.contentType} variant="outline">
                {area.label} · {area.count}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
