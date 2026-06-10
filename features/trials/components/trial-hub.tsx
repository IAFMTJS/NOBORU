import Link from "next/link";
import { Lock, Mountain, Trophy } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
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
import { TrialPerformancePanel } from "@/features/trials/components/trial-performance-panel";
import {
  TRIAL_GRADE_LABELS,
  TRIAL_KIND_LABELS,
} from "@/features/trials/constants/trial.constants";
import type {
  TrialListEntryViewModel,
  TrialPerformanceViewModel,
} from "@/features/trials/types/trial.types";

type TrialHubProps = {
  trials: TrialListEntryViewModel[];
  performance: TrialPerformanceViewModel;
};

function TrialCard({ trial }: { trial: TrialListEntryViewModel }) {
  const locked = trial.availability === "locked";
  const passed = trial.availability === "passed";

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-heading-6">{trial.title}</CardTitle>
            <CardDescription>{trial.description}</CardDescription>
          </div>
          {locked ? (
            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
          ) : passed ? (
            <Trophy className="h-5 w-5 text-success" aria-hidden />
          ) : (
            <Mountain className="h-5 w-5 text-primary" aria-hidden />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{TRIAL_KIND_LABELS[trial.kind]}</Badge>
          <Badge variant="secondary">{trial.bossName}</Badge>
          <Badge variant="outline">Pass {trial.passScore}%</Badge>
          {trial.progress?.bestGrade ? (
            <Badge variant="outline">
              Best: {TRIAL_GRADE_LABELS[trial.progress.bestGrade]}
            </Badge>
          ) : null}
        </div>
        {trial.progress ? (
          <ProgressBar
            value={trial.progress.bestScore}
            label="Best score"
            showValue
          />
        ) : null}
        {locked ? (
          <p className="text-caption text-muted-foreground">{trial.lockReason}</p>
        ) : null}
        <Button className="w-full" disabled={locked} asChild={!locked}>
          {locked ? (
            <span>Locked</span>
          ) : (
            <Link href={`/trials/${trial.slug}`}>
              {passed ? "Retry Trial" : "Start Trial"}
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function TrialHub({ trials, performance }: TrialHubProps) {
  const regional = trials.filter((trial) => trial.kind === "regional_challenge");
  const bossAndFinal = trials.filter(
    (trial) => trial.kind === "boss_trial" || trial.kind === "final_trial",
  );

  return (
    <PageContainer>
      <ScreenHeader
        title="Trials"
        subtitle="High-stakes challenges that validate real recall"
      />

      <TrialPerformancePanel performance={performance} />

      <div className="space-y-3">
        <h2 className="text-heading-6">Regional Challenges</h2>
        {regional.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-heading-6">Boss & Final Trials</h2>
        {bossAndFinal.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>
    </PageContainer>
  );
}
