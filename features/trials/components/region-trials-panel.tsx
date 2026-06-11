import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRIAL_KIND_LABELS } from "@/features/trials/constants/trial.constants";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";

type RegionTrialsPanelProps = {
  regionSlug: string;
  trials: TrialListEntryViewModel[];
  variant?: "default" | "peak";
};

export function RegionTrialsPanel({
  regionSlug,
  trials,
  variant = "default",
}: RegionTrialsPanelProps) {
  const regionTrials = trials.filter((trial) => trial.regionSlug === regionSlug);
  if (regionTrials.length === 0) return null;

  const readyTrial = regionTrials.find((trial) => trial.availability === "available");
  const isPeak = variant === "peak";

  return (
    <Card
      className={
        isPeak && readyTrial
          ? "border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-2"
          : "border-primary/20 shadow-elevation-1"
      }
    >
      <CardHeader>
        <CardTitle className="text-heading-6">
          {isPeak ? "Trial Peak" : "Region Trials"}
        </CardTitle>
        <CardDescription>
          {isPeak && readyTrial
            ? `${readyTrial.title} is ready — prove your mastery.`
            : "Validate mastery with timed recall challenges"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPeak && readyTrial ? (
          <Button className="w-full" size="lg" asChild>
            <Link href={`/trials/${readyTrial.slug}`}>
              Attempt Trial · {readyTrial.title}
            </Link>
          </Button>
        ) : null}
        {regionTrials.map((trial) => (
          <div
            key={trial.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
          >
            <div className="space-y-1">
              <p className="text-body-sm font-medium">{trial.title}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{TRIAL_KIND_LABELS[trial.kind]}</Badge>
                {trial.progress?.passed ? (
                  <Badge variant="success">Passed</Badge>
                ) : trial.availability === "locked" ? (
                  <Badge variant="secondary">Locked</Badge>
                ) : (
                  <Badge variant="outline">Available</Badge>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={trial.availability === "locked"}
              asChild={trial.availability !== "locked"}
            >
              {trial.availability === "locked" ? (
                <span>Locked</span>
              ) : (
                <Link href={`/trials/${trial.slug}`}>Open</Link>
              )}
            </Button>
          </div>
        ))}
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/trials">View all trials</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
