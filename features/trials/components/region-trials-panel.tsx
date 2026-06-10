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
};

export function RegionTrialsPanel({ regionSlug, trials }: RegionTrialsPanelProps) {
  const regionTrials = trials.filter((trial) => trial.regionSlug === regionSlug);
  if (regionTrials.length === 0) return null;

  return (
    <Card className="border-primary/20 shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-heading-6">Region Trials</CardTitle>
        <CardDescription>
          Validate mastery with timed recall challenges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
