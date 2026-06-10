import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TRIAL_GRADE_LABELS } from "@/features/trials/constants/trial.constants";
import type { TrialPerformanceViewModel } from "@/features/trials/types/trial.types";

type TrialPerformancePanelProps = {
  performance: TrialPerformanceViewModel;
};

export function TrialPerformancePanel({ performance }: TrialPerformancePanelProps) {
  const passRate =
    performance.totalAttempts === 0
      ? 0
      : Math.round((performance.trialsPassed / Math.max(performance.trialsAvailable + performance.trialsPassed, 1)) * 100);

  return (
    <Card className="border-primary/20 shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-heading-6">Trial Performance</CardTitle>
        <CardDescription>Track your climb through regional and N5 challenges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-border px-3 py-3">
            <p className="text-caption text-muted-foreground">Attempts</p>
            <p className="text-heading-5">{performance.totalAttempts}</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-3">
            <p className="text-caption text-muted-foreground">Passed</p>
            <p className="text-heading-5">{performance.trialsPassed}</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-3">
            <p className="text-caption text-muted-foreground">Available</p>
            <p className="text-heading-5">{performance.trialsAvailable}</p>
          </div>
        </div>
        <ProgressBar value={passRate} label="Trial completion" showValue />
        {performance.bestGrades.length > 0 ? (
          <div className="space-y-2">
            <p className="text-body-sm font-medium">Best grades</p>
            {performance.bestGrades.map((entry) => (
              <div
                key={entry.slug}
                className="flex items-center justify-between gap-3 text-body-sm"
              >
                <span>{entry.title}</span>
                <span className="text-muted-foreground">
                  {TRIAL_GRADE_LABELS[entry.grade]} · {entry.score}%
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
